import { NextAuthConfig } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { z } from 'zod'
import { compare, hash } from 'bcryptjs'

// Dados mockados
const mockUsers = [
  {
    _id: '1',
    email: 'usuario@exemplo.com',
    // Hash para a senha "12345678"
    password: '$2b$10$C/4CpT6lGP.iNQmG6MyDruiX2eQCcuhQ9X79xVlyaTPgt6uGnO0JK',
    name: 'Usuário Teste',
    image: 'https://via.placeholder.com/150',
    role: 'user',
    provider: 'credentials',
    last_login: 0,
  },
]

// Função para simular busca de usuário
async function getUser(identifier: { key: string; value: string }) {
  if (identifier.key === 'email') {
    return mockUsers.find((user) => user.email === identifier.value) || null
  }
  return null
}

// Função para simular atualização de último login
async function updateLastLogin(userId: string) {
  const user = mockUsers.find((user) => user._id === userId)
  if (user) {
    user.last_login = Date.now()
  }
  return user
}

// Função para simular criação de usuário
async function createUser(userData: any) {
  const newId = (mockUsers.length + 1).toString()
  const newUser = {
    _id: newId,
    ...userData,
  }
  mockUsers.push(newUser)
  return newId
}

// Função para simular atualização de usuário
async function updateUser(userId: string, userData: any) {
  const user = mockUsers.find((user) => user._id === userId)
  if (user) {
    Object.assign(user, userData)
  }
  return user
}

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          throw new Error('Credenciais inválidas')
        }

        const { email, password } = parsedCredentials.data

        const user = await getUser({
          key: email ? 'email' : 'username',
          value: email,
        })
        if (!user) {
          throw new Error('Usuário não encontrado')
        }
        if (user.password === '') {
          throw new Error('Entrar com provider')
        }

        const isMatch = await compare(password, user.password)
        if (!isMatch) {
          throw new Error('Senha incorreta')
        }

        // Atualiza o último login após autenticação bem sucedida
        await updateLastLogin(user._id)

        return {
          id: user._id.toString(),
          image: user.image || '',
          email: user.email,
          role: user.role,
          nome: user.name,
        }
      },
    }),
  ],
  pages: {
    signIn: '/entrar',
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === 'github' || account?.provider === 'google') {
        const provider = account?.provider
        const email = profile?.email

        let image = ''
        if (provider === 'google') {
          image = profile?.picture
        }

        if (email) {
          const usuario = await getUser({ key: 'email', value: email })

          if (!usuario) {
            const userId = await createUser({
              password: '',
              provider,
              email,
              role: 'user',
              image,
              name: String(profile.name),
              last_login: Date.now(),
            })
            user.image = String(profile?.image)
            user.nome = String(profile?.name)
            user.id = String(userId)
            user.role = 'user'
          } else {
            const updatedUser = await updateUser(usuario._id, {
              image,
              provider,
              password: '',
              last_login: Date.now(),
            })

            if (updatedUser) {
              user.image = String(updatedUser.image)
              user.nome = String(updatedUser.name)
              user.id = String(updatedUser._id)
              user.role = String(updatedUser.role)
            }
          }
        }
      }

      return true
    },
    async jwt({ token, user }) {
      // console.log('JWT Callback - Token antes:', token)
      // console.log('JWT Callback - User:', user)
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.image = user.image as string
        token.nome = user.nome as string
      }
      // console.log('JWT Callback - Token depois:', token)
      return token
    },

    async session({ session, token }) {
      // console.log('Session Callback - Token:', token)
      // console.log('Session Callback - Session antes:', session)
      if (token.role) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.image = token.image
        session.user.nome = token.nome
      }
      // console.log('Session Callback - Session depois:', session)
      return session
    },
  },
  jwt: {
    maxAge: 60 * 60, // 1 h
  },
} satisfies NextAuthConfig

export default authConfig
