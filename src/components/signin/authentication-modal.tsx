'use client'

import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import UserAuthForm from '@/components/forms/user-auth-form'
import UserRegisterForm from '@/components/forms/user-register-form'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'

// Dados fixos simulando usuários
const mockUsers = [
  {
    _id: '1',
    email: 'usuario@exemplo.com',
    password: '$2a$10$X7aPLX5LX5LX5LX5LX5LX.X7aPLX5LX5LX5LX5LX5LX5LX5LX5',
    name: 'Usuário Teste',
    image: 'https://via.placeholder.com/150',
    role: 'user',
    provider: 'credentials',
    last_login: 0,
  },
]

// Função para simular busca de usuário por email
async function getUserByEmail(email: string) {
  return mockUsers.find((user) => user.email === email) || null
}

// Função para simular criação de recuperação de senha
async function createPasswordRecovery(data: {
  email: string
  created_at: number
  valid_at: number
}) {
  // Gerar um ID único para a recuperação de senha
  const recoveryId = `recovery_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  // Aqui você poderia armazenar essa informação em algum lugar
  console.log(`Criada recuperação de senha: ${recoveryId} para ${data.email}`)

  return recoveryId
}

const formSchema = z.object({
  email: z.string().email({ message: 'Digite um email valido.' }),
})

export default function AuthenticationModal() {
  const [button, setButton] = useState('Cadastrar')
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // verifica email
    const emailExists = await getUserByEmail(data.email)

    if (emailExists) {
      // verifica se logou com algum provider
      if (emailExists.provider !== 'credentials') {
        toast.error('Erro', {
          description: 'Sem senha para resetar',
          duration: 3000,
          richColors: true,
        })
        setOpen(false)
        return
      }

      const timestampAtual = new Date().getTime()
      const trintaMinutosEmMilissegundos = 30 * 60 * 1000 // 30 minutos em milissegundos
      const timestampMais30Min = timestampAtual + trintaMinutosEmMilissegundos

      const recuperaSenha = await createPasswordRecovery({
        email: data.email,
        created_at: timestampAtual,
        valid_at: timestampMais30Min,
      })

      // Simulação de envio de email
      try {
        // Aqui você pode implementar uma chamada para sua API de envio de email
        console.log('Enviando email para:', data.email)
        console.log('ID de recuperação:', recuperaSenha)
        console.log('Nome do usuário:', emailExists.name)

        toast.success('Email enviado', {
          description: 'Verifique sua caixa de entrada para redefinir sua senha',
          duration: 3000,
          richColors: true,
        })
      } catch (error) {
        toast.error('Erro ao enviar email', {
          description: 'Tente novamente mais tarde',
          duration: 3000,
          richColors: true,
        })
      }
    } else {
      toast.error('Email não encontrado', {
        description: 'Verifique se o email está correto',
        duration: 3000,
        richColors: true,
      })
    }

    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => {
          button === 'Cadastrar' ? setButton('Login') : setButton('Cadastrar')
        }}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        {button}
      </button>

      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col justify-center items-center space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {button === 'Login' ? 'Criar uma conta' : 'Realizar login'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {button === 'Login'
                ? 'Digite seu e-mail abaixo para criar sua conta.'
                : 'Digite seu e-mail abaixo para realizar login.'}
            </p>
          </div>
          {button === 'Login' ? <UserRegisterForm setButton={setButton} /> : <UserAuthForm />}
          <p className="px-8 text-center text-sm text-muted-foreground">
            Esqueceu sua Senha? recupere{' '}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">
                aqui.
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription>
                    <div className="flex justify-center pb-4">
                      <p>Insira seu email para receber um link para redfinir sua senha.</p>
                    </div>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex justify-center gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit">Enviar</Button>
                      </form>
                    </Form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </div>
    </>
  )
}
