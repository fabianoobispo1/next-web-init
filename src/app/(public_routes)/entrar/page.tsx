import AuthenticationModal from '@/components/signin/authentication-modal'
import { Metadata } from 'next'
/* import Image from 'next/image' */

export const metadata: Metadata = {
  title: 'next-web-init',
  description: 'projeto de partida para o desenvolvimento de aplicações web',
  keywords: '',
}

export default function authentication() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        {/*       <Image
          src="/financas-background.jpg"
          alt="Gestão financeira simplificada"
          fill
          className="object-cover opacity-80"
          priority
        /> */}

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-semibold">"Mensagem ........"</p>
          </blockquote>
        </div>
      </div>

      <AuthenticationModal />
    </div>
  )
}
