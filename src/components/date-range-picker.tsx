'use client'

import * as React from 'react'
import { format, isValid, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DateRangePickerProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onRangeChange: (range: { from?: Date; to?: Date }) => void
  placeholder?: string
  className?: string
  formatoExibicao?: 'curto' | 'longo'
}

export function DateRangePicker({
  startDate,
  endDate,
  onRangeChange,
  placeholder = 'Selecione um período',
  className,
  formatoExibicao = 'curto',
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(startDate || new Date())

  // Função para formatar a exibição do período selecionado
  const formatDisplayText = () => {
    if (!startDate && !endDate) return placeholder

    if (startDate && !endDate) {
      return formatoExibicao === 'longo'
        ? `A partir de ${format(startDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`
        : `A partir de ${format(startDate, 'dd/MM/yyyy')}`
    }

    if (!startDate && endDate) {
      return formatoExibicao === 'longo'
        ? `Até ${format(endDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`
        : `Até ${format(endDate, 'dd/MM/yyyy')}`
    }

    return formatoExibicao === 'longo'
      ? `${format(startDate!, "d 'de' MMMM 'de' yyyy", { locale: ptBR })} até ${format(endDate!, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`
      : `${format(startDate!, 'dd/MM/yyyy')} - ${format(endDate!, 'dd/MM/yyyy')}`
  }

  // Gerar anos para o seletor (de 10 anos atrás até 10 anos à frente)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  // Gerar meses para o seletor
  const months = Array.from({ length: 12 }, (_, i) => i)

  // Manipuladores para os seletores de mês e ano
  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(parseInt(month))
    setCurrentMonth(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth)
    newDate.setFullYear(parseInt(year))
    setCurrentMonth(newDate)
  }

  // Funções para navegar entre os meses
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentMonth(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentMonth(newDate)
  }

  // Funções para selecionar períodos predefinidos
  const selectCurrentMonth = () => {
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)
    onRangeChange({ from: start, to: end })
  }

  const selectPreviousMonth = () => {
    const now = new Date()
    now.setMonth(now.getMonth() - 1)
    const start = startOfMonth(now)
    const end = endOfMonth(now)
    onRangeChange({ from: start, to: end })
  }

  const clearSelection = () => {
    onRangeChange({ from: undefined, to: undefined })
  }

  const applySelection = () => {
    setOpen(false)
  }

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      onRangeChange(range)
    } else {
      onRangeChange({ from: undefined, to: undefined })
    }
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-full justify-start text-left font-normal', className)}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="space-y-3 p-3">
            {/* Seletores rápidos */}
            <div className="flex flex-wrap gap-2 justify-between">
              <Button variant="outline" size="sm" onClick={selectCurrentMonth}>
                Mês atual
              </Button>
              <Button variant="outline" size="sm" onClick={selectPreviousMonth}>
                Mês anterior
              </Button>
            </div>

            {/* Navegação e seletores de mês/ano */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2">
                <Select
                  value={currentMonth.getMonth().toString()}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="w-[110px] h-8 text-sm">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {format(new Date(2000, month, 1), 'MMMM', { locale: ptBR })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={currentMonth.getFullYear().toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-[90px] h-8 text-sm">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendário - Ajustado para melhor alinhamento */}
          <div className="p-3 border-t">
            <Calendar
              mode="range"
              selected={{
                from: startDate,
                to: endDate,
              }}
              onSelect={handleSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              numberOfMonths={1}
              locale={ptBR}
              weekStartsOn={0}
              className="mx-auto"
              required={false}
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                day_selected:
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside: 'text-muted-foreground opacity-50',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
              }}
            />
          </div>

          {/* Botões de ação */}
          <div className="p-3 border-t flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Limpar
            </Button>
            <Button size="sm" onClick={applySelection}>
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
