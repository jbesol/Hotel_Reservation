import { useEffect } from 'react'
import { CheckCircle2, X, CalendarDays, BedDouble, Moon, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SuccessModal({ reserva, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const nights = reserva?.checkIn && reserva?.checkOut
    ? Math.max(1, Math.ceil((new Date(reserva.checkOut) - new Date(reserva.checkIn)) / 86400000))
    : null

  const total = nights && reserva?.habitacion?.precioPorNoche
    ? (nights * reserva.habitacion.precioPorNoche).toFixed(2)
    : null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 anim-fade-in"
      style={{ background: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-modal anim-slide-up overflow-hidden">
        {/* Primary top stripe */}
        <div className="h-1.5 bg-primary" />

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full bg-score-light flex items-center justify-center"
                style={{ animation: 'checkPop 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}
              >
                <CheckCircle2 size={22} className="text-score" />
              </div>
              <div>
                <p className="text-[10px] text-ink-light uppercase tracking-widest mb-0.5">
                  Reserva Confirmada
                </p>
                <h2 className="text-lg font-semibold text-ink">¡Listo!</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-ink-light">
              <X size={16} />
            </button>
          </div>

          {/* Reservation ID */}
          <div className="bg-page rounded-xl p-4 mb-5 text-center border border-line">
            <p className="text-[10px] text-ink-light uppercase tracking-widest mb-1">ID de Reserva</p>
            <p className="font-brand text-4xl font-bold text-primary tracking-wider">
              #{reserva?.id}
            </p>
          </div>

          {/* Detail rows */}
          <div className="space-y-2 mb-5">
            <Row icon={BedDouble}    label="Habitación" value={`Nro. ${reserva?.habitacion?.numHabitacion} — ${reserva?.habitacion?.tipo}`} />
            <Row icon={CalendarDays} label="Check-in"   value={fmt(reserva?.checkIn)} />
            <Row icon={CalendarDays} label="Check-out"  value={fmt(reserva?.checkOut)} />
            {nights && <Row icon={Moon}       label="Noches"    value={`${nights} noche${nights !== 1 ? 's' : ''}`} />}
            {total  && <Row icon={DollarSign} label="Total"     value={`$${total} USD`} accent />}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => { onClose(); navigate('/') }}
              className="flex-1 btn-secondary py-3 text-sm"
            >
              Ir al inicio
            </button>
            <button onClick={onClose} className="flex-1 btn-primary py-3 text-sm">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 bg-page rounded-xl px-3.5 py-2.5 border border-line/60">
      <div className="w-7 h-7 rounded-lg bg-white border border-line flex items-center justify-center shrink-0">
        <Icon size={13} className="text-ink-light" />
      </div>
      <span className="text-sm text-ink-secondary flex-1">{label}</span>
      <span className={`text-sm font-semibold ${accent ? 'text-primary' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  )
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}
