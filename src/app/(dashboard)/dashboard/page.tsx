'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Page() {
  const { data: session } = useSession()
  const [nome, setNome] = useState('')
  const [timestamp, setTimestamp] = useState<string>('')
  const [carregou, setiscarregou] = useState(false)
  console.log(session?.user)

  useEffect(() => {
    if (session) {
      if (session.user.nome) {
        if (!carregou) {
          if (timestamp === '') {
            setTimestamp(Date.now().toString())
          }
          setNome(session?.user?.nome)

          setiscarregou(true)
        }
      }
    }
  }, [timestamp, session, carregou])

  return !session ? (
    <div className="flex pt-10 items-center justify-center h-full w-full">
      <Spinner />
    </div>
  ) : (
    <ScrollArea className="h-full">Pagina logada para {nome}</ScrollArea>
  )
}
