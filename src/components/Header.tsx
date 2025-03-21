'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  PiggyBank,
  Bell,
  User,
  Menu,
  X,
  Home,
  BarChart2,
  Target,
  CreditCard,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronUp,
  ChevronDown,
  Wallet,
  Tag,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import { Skeleton } from './ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

import { ModeSwitcherTheme } from '@/components/mode-switcher-theme'

type HeaderProps = {
  notificationsCount?: number
}

export default function Header({ notificationsCount = 1 }: HeaderProps) {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    const bannerClosedTime = localStorage.getItem('bannerClosedTime')

    if (bannerClosedTime) {
      const closedTime = parseInt(bannerClosedTime, 10)
      const currentTime = new Date().getTime()
      const fifteenMinutesInMs = 15 * 60 * 1000

      // Se passaram menos de 15 minutos, mantenha o banner fechado
      if (currentTime - closedTime < fifteenMinutesInMs) {
        setShowBanner(false)
      } else {
        // Se passaram mais de 15 minutos, remova o item do localStorage
        localStorage.removeItem('bannerClosedTime')
        setShowBanner(true)
      }
    }
  }, [])

  const closeBanner = () => {
    setShowBanner(false)
    // Salva o timestamp atual quando o banner foi fechado
    localStorage.setItem('bannerClosedTime', new Date().getTime().toString())
  }

  return (
    <>
      {/* Banner de aviso */}
      {showBanner && (
        <div className="bg-red-500/80 backdrop-blur-sm text-white w-full py-2 px-4 relative">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Bell size={16} className="mr-2" />
              <p>Alerta: SIte em vresão teste.</p>
            </div>
            <button
              onClick={closeBanner}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Fechar aviso"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Desktop Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center">
                Logo
                {/* <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white">
                  <PiggyBank size={24} />
                </div>
                <span className="ml-2 text-xl font-bold text-green-500 dark:text-green-400">
                  Planeje<span className="text-blue-500 dark:text-blue-400">Fácil</span>
                </span> */}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Dashboard
              </Link>
              {/* <Link
                href="/dashboard/transactions"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Transações
              </Link>
              <Link
                href="/dashboard/contas"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Contas
              </Link>
              <Link
                href="/dashboard/categorias"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Categorias
              </Link>
              <Link
                href="/dashboard/metas"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Metas
              </Link>
              <Link
                href="/dashboard/relatorios"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
              >
                Relatórios
              </Link> */}
            </nav>

            <div className="flex items-center gap-4">
              <ModeSwitcherTheme />

              {/* <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell size={20} className="text-gray-500 dark:text-gray-300" />
                {notificationsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationsCount > 9 ? '9+' : notificationsCount}
                  </span>
                )}
              </button> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex md:gap-1 md:items-center  p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                    {!session ? (
                      <>
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-[100px]" />
                      </>
                    ) : (
                      <>
                        <Avatar className={' h-8 w-8 '}>
                          <AvatarImage src={session.user.image} alt={session.user.nome} />
                          <AvatarFallback className="bg-gray-300">
                            {session.user.nome[0]}
                          </AvatarFallback>
                        </Avatar>
                        {session.user.nome}
                      </>
                    )}

                    <ChevronDown className="ml-auto" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <a href={'/dashboard/perfil'}>
                    <DropdownMenuItem>
                      <span>Perfil</span>
                    </DropdownMenuItem>
                  </a>
                  {/* <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={() => signOut()}>
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="text-gray-500 dark:text-gray-300" />
                ) : (
                  <Menu size={24} className="text-gray-500 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 space-y-1">
              <div className="flex items-center gap-2 p-2 mb-4">
                {!session ? (
                  <>
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-[100px]" />
                  </>
                ) : (
                  <>
                    <Avatar className={' h-10 w-10 '}>
                      <AvatarImage src={session.user.image} alt={session.user.nome} />
                      <AvatarFallback className="bg-gray-300">
                        {session.user.nome[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {session.user.nome}
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">Plano Básico</div>
                    </div>
                  </>
                )}
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home size={20} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Dashboard</span>
              </Link>

              {/* <Link
                href="/dashboard/transactions"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CreditCard size={20} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Transações</span>
              </Link>

              <Link
                href="/dashboard/contas"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Wallet size={20} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Contas</span>
              </Link>

              <Link
                href="/dashboard/categorias"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Tag size={20} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Categorias</span>
              </Link>

              <Link
                href="/dashboard/metas"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Target size={20} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Metas</span>relatorios
              </Link>

              <Link
                href="/dashboard/c"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart2 size={20} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Relatórios</span>
              </Link> */}

              <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                <Link
                  href="/dashboard/configuracoes"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings size={20} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Configurações</span>
                </Link>

                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <LogOut size={20} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
