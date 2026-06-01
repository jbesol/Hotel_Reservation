import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']
const MONTHS   = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

function toStr(d) {
  return d.toISOString().split('T')[0]
}

function buildMonth(year, month) {
  const firstDOW    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array(firstDOW).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}

/**
 * Interactive date range picker.
 *
 * Props:
 *   checkIn  {string} ISO date "YYYY-MM-DD"
 *   checkOut {string} ISO date "YYYY-MM-DD"
 *   onChange {({checkIn, checkOut}) => void}
 */
export default function DateRangePicker({ checkIn, checkOut, onChange }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [hoverDate, setHoverDate] = useState(null)
  // step tracks whether the next click sets checkIn or checkOut
  const [step, setStep] = useState(checkIn ? 'checkOut' : 'checkIn')

  const month2 = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)

  const canGoPrev = viewMonth > new Date(today.getFullYear(), today.getMonth(), 1)

  const handleDayClick = (date) => {
    const str = toStr(date)
    if (step === 'checkIn') {
      onChange({ checkIn: str, checkOut: '' })
      setStep('checkOut')
    } else {
      if (str <= checkIn) {
        // Clicked before or on start — restart selection
        onChange({ checkIn: str, checkOut: '' })
        setStep('checkOut')
      } else {
        onChange({ checkIn, checkOut: str })
        setStep('checkIn')
      }
    }
  }

  // The "end" used for range preview while hovering (before checkOut is confirmed)
  const previewEnd = step === 'checkOut' && hoverDate ? toStr(hoverDate) : checkOut

  const isInRange = (date) => {
    const s = toStr(date)
    return checkIn && previewEnd && s > checkIn && s < previewEnd
  }
  const isStart   = (date) => !!checkIn  && toStr(date) === checkIn
  const isEnd     = (date) => !!checkOut && toStr(date) === checkOut
  const isPast    = (date) => date < today
  const isToday   = (date) => toStr(date) === toStr(today)

  const shared = { handleDayClick, isInRange, isStart, isEnd, isPast, isToday, setHoverDate }

  return (
    <div className="w-full">
      {/* Navigation row */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <button
          onClick={() => canGoPrev && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={15} className="text-ink-secondary" />
        </button>

        <p className="text-xs font-medium text-ink-secondary uppercase tracking-wide">
          {step === 'checkIn'
            ? 'Selecciona tu fecha de llegada'
            : 'Selecciona tu fecha de salida'}
        </p>

        <button
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={15} className="text-ink-secondary" />
        </button>
      </div>

      {/* Two-month grid (stacked on mobile, side-by-side on sm+) */}
      <div className="flex flex-col sm:flex-row gap-6">
        <CalMonth date={viewMonth} {...shared} />
        <div className="hidden sm:block w-px bg-line shrink-0" />
        <CalMonth date={month2}   {...shared} />
      </div>
    </div>
  )
}

function CalMonth({ date, handleDayClick, isInRange, isStart, isEnd, isPast, isToday, setHoverDate }) {
  const year  = date.getFullYear()
  const month = date.getMonth()
  const cells = buildMonth(year, month)

  return (
    <div className="flex-1 min-w-0">
      {/* Month label */}
      <p className="text-sm font-semibold text-ink text-center mb-3">
        {MONTHS[month]} {year}
      </p>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[10px] font-bold text-ink-light py-1 uppercase tracking-wide">
            {w}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={`_${i}`} className="h-9" />

          const past    = isPast(day)
          const start   = isStart(day)
          const end     = isEnd(day)
          const inRange = isInRange(day)
          const todayD  = isToday(day)

          return (
            <div
              key={toStr(day)}
              className={`h-9 flex items-center justify-center
                ${inRange && !start && !end ? 'cal-in-range' : ''}
                ${start && (end || inRange) ? 'bg-gradient-to-r from-transparent to-primary-light' : ''}
                ${end && (start || inRange) ? 'bg-gradient-to-l from-transparent to-primary-light' : ''}
              `}
            >
              <button
                onClick={() => !past && handleDayClick(day)}
                onMouseEnter={() => !past && setHoverDate(day)}
                onMouseLeave={() => setHoverDate(null)}
                disabled={past}
                className={`
                  w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all relative z-10 select-none
                  ${past ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                  ${start || end
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : ''}
                  ${!past && !start && !end
                    ? 'hover:bg-primary-light hover:text-primary'
                    : ''}
                  ${inRange && !start && !end ? 'text-primary font-medium' : ''}
                  ${todayD && !start && !end ? 'ring-1 ring-primary/40 font-semibold text-primary' : ''}
                  ${!past && !start && !end && !todayD && !inRange ? 'text-ink' : ''}
                `}
              >
                {day.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
