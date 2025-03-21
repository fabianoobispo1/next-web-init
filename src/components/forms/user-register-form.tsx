'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { hash } from 'bcryptjs'

import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

// Dados fixos simulando usuários
const mockUsers = [
  {
    id: '1',
    email: 'usuario@exemplo.com',
    password: '$2a$10$X7aPLX5LX5LX5LX5LX5LX.X7aPLX5LX5LX5LX5LX5LX5LX5LX5',
    name: 'Usuário Teste',
    image: 'https://via.placeholder.com/150',
    role: 'user',
    provider: 'credentials',
  },
]

// Função para simular busca de usuário por email
async function getUserByEmail(email: string) {
  return mockUsers.find((user) => user.email === email) || null
}

// Função para simular criação de usuário
async function createUser(userData: {
  password: string
  provider: string
  email: string
  role: string
  image: string
  name: string
}) {
  const newId = (mockUsers.length + 1).toString()
  const newUser = {
    id: newId,
    ...userData,
  }

  mockUsers.push(newUser)
  console.log('Usuário criado:', newUser)
  return newId
}

const formSchema = z
  .object({
    nome: z.string().min(3, { message: 'Digite seu nome.' }),
    email: z.string().email({ message: 'Digite um email valido.' }),
    password: z.string().min(8, { message: 'Senha obrigatoria, min 8' }),
    confirmPassword: z.string().min(8, { message: 'Senha obrigatoria, min 8' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coecindem',
    path: ['confirmPassword'],
  })

type UserFormValue = z.infer<typeof formSchema>

interface UserRegisterFormProps {
  setButton: (value: string) => void
}

export default function UserRegisterForm({ setButton }: UserRegisterFormProps) {
  const [loading, setLoading] = useState(false)
  const defaultValues = {
    email: '',
    password: '',
    nome: '',
    confirmPassword: '',
  }
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true)

    const existingUserByEmail = await getUserByEmail(data.email)

    if (existingUserByEmail) {
      toast.error('Erro', {
        description: 'Email já cadastrado.',
        duration: 3000,
        richColors: true,
      })
      setLoading(false)
      return
    }

    try {
      const hashedPassword = await hash(data.password, 6)
      const userId = await createUser({
        password: hashedPassword,
        provider: 'credentials',
        email: data.email,
        role: 'user',
        image: 'empty',
        name: data.nome,
      })

      if (!userId) {
        toast.error('Erro', {
          description: 'Usuario nao criado.',
          duration: 3000,
          richColors: true,
        })
        setLoading(false)
        return
      }

      toast.success('Ok', {
        description: 'Usuário criado com sucesso. Por favor, faça login.',
        duration: 3000,
        richColors: true,
      })

      setLoading(false)
      setButton('Cadastrar')
    } catch (error) {
      console.error(error)

      toast.error('Erro', {
        description: 'Ocorreu um erro ao criar o usuário.',
        duration: 3000,
        richColors: true,
      })
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    type="nome"
                    placeholder="Digite seu nome..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comfirmar senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Carregando
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
