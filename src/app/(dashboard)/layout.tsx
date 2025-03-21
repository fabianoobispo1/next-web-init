import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'

import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'next-web-init',
  description: 'projeto de partida para o desenvolvimento de aplicações web',
  keywords: '',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) redirect('/')
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="w-full">{children}</main>
    </div>
  )
}
