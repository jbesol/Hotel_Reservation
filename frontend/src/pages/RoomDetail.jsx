import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Check, CreditCard, Shield, Star, Moon, Users,
  MapPin, ChevronDown, ChevronUp,
} from 'lucide-react'
import { getHabitacionById, crearHuesped, crearReserva } from '../api/api'
import { DetailSkeleton } from '../components/LoadingSkeleton'
import ErrorBanner from '../components/ErrorBanner'
import SuccessModal from '../components/SuccessModal'
import DateRangePicker from '../components/DateRangePicker'
import { getScore, scoreLabel, TYPE_STARS } from '../utils/scores'
import { getRoomImages } from '../utils/images'

// ── Per-type display data ────────────────────────────────────────────
const TIPO_META = {
  SIMPLE:       { icon: '🛏️', label: 'Simple',       grad: 'grad-simple',       chip: 'bg-blue-50   text-blue-700   border-blue-200'  },
  DOBLE:        { icon: '🏡', label: 'Doble',        grad: 'grad-doble',        chip: 'bg-orange-50 text-orange-700 border-orange-200' },
  SUITE:        { icon: '✨', label: 'Suite',         grad: 'grad-suite',        chip: 'bg-purple-50 text-purple-700 border-purple-200' },
  PRESIDENCIAL: { icon: '👑', label: 'Presidencial',  grad: 'grad-presidencial', chip: 'bg-amber-50  text-amber-700  border-amber-200'  },
}

const AMENITIES = {
  SIMPLE:       ['Wi-Fi alta velocidad', 'TV 4K 55"', 'Cafetera Nespresso', 'Ducha de lluvia', 'Caja fuerte digital', 'Aire acondicionado'],
  DOBLE:        ['Wi-Fi alta velocidad', 'TV 4K 65"', 'Minibar gourmet', 'Bañera de mármol', 'Vista al jardín', 'Desayuno in-room', 'Caja fuerte digital'],
  SUITE:        ['Wi-Fi alta velocidad', 'TV 4K 75"', 'Bañera hidromasaje', 'Sala de estar', 'Minibar premium', 'Terraza privada', 'Mayordomo', 'Room service 24h'],
  PRESIDENCIAL: ['Wi-Fi ilimitado', 'Múltiples TVs 4K', 'Piscina privada', 'Chef privado', 'Mayordomo 24h', 'Cocina gourmet', 'Sala de reuniones', 'Transporte VIP'],
}

// ────────────────────────────────────────────────────────────────────

export default function RoomDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [room,      setRoom]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [reserva,   setReserva]   = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [bookErr,   setBookErr]   = useState(null)
  const [calOpen,   setCalOpen]   = useState(false)
  const [guestOpen, setGuestOpen] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const today    = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '',
    telefono: '', documento: '', observaciones: '',
    checkIn: today, checkOut: tomorrow,
  })

  const fetchRoom = async () => {
    setLoading(true); setError(null)
    try { setRoom(await getHabitacionById(id)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchRoom()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000))
    : 0

  const total = room ? (nights * room.precioPorNoche).toFixed(2) : '0.00'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (nights < 1) { setBookErr('La fecha de salida debe ser posterior a la de llegada.'); return }
    setSubmitting(true); setBookErr(null)
    try {
      const huesped = await crearHuesped({
        nombre: form.nombre, apellido: form.apellido, email: form.email,
        telefono: form.telefono, documento: form.documento,
      })
      const result = await crearReserva({
        huespedId: huesped.id, habitacionId: room.id,
        checkIn: form.checkIn, checkOut: form.checkOut,
        observaciones: form.observaciones || null,
      })
      setReserva({ ...result, habitacion: room })
    } catch (e) {
      setBookErr(e.message || 'Error al procesar la reserva.')
    } finally {
      setSubmitting(false)
    }
  }

  const meta        = TIPO_META[room?.tipo] || TIPO_META.SIMPLE
  const amenities   = AMENITIES[room?.tipo] || []
  const stars       = TYPE_STARS[room?.tipo] || 3
  const { score, reviews } = room ? getScore(room.id) : { score: 8.5, reviews: 35 }
  const roomImages  = room ? getRoomImages(room.id, room.tipo) : []

  return (
    <div className="min-h-screen bg-page pt-14">
      {reserva && <SuccessModal reserva={reserva} onClose={() => setReserva(null)} />}

      {loading ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8"><DetailSkeleton /></div>
      ) : error ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8"><ErrorBanner message={error} onRetry={fetchRoom} /></div>
      ) : room ? (
        <>
          {/* ── Room hero ───────────────────────────────────────── */}
          <div>
            {/* Main image */}
            <div className={`relative h-64 sm:h-[420px] ${meta.grad} overflow-hidden bg-gray-900`}>
              <img
                key={activeImg}
                src={roomImages[activeImg]}
                alt={`Habitación ${meta.label} — foto ${activeImg + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              {/* Gradient overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20" />

              {/* Back button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 sm:top-5 sm:left-6 inline-flex items-center gap-2 text-sm text-white/90 bg-black/30 backdrop-blur-sm hover:bg-black/45 transition-colors px-3.5 py-2 rounded-xl"
              >
                <ArrowLeft size={14} />
                Volver
              </button>

              {/* Photo counter pill */}
              <div className="absolute top-4 right-4 bg-black/35 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                {activeImg + 1} / {roomImages.length}
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 pb-5">
                <div className="max-w-6xl mx-auto flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20">
                        {meta.label}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: stars }).map((_, i) => (
                          <Star key={i} size={11} className="text-yellow-300 fill-yellow-300" />
                        ))}
                      </div>
                    </div>
                    <h1 className="font-brand text-2xl sm:text-3xl font-bold text-white drop-shadow">
                      {meta.label === 'Presidencial'
                        ? 'Suite Presidencial'
                        : `Habitación ${meta.label}`}
                    </h1>
                    <div className="flex items-center gap-4 mt-1 text-xs text-white/80">
                      <span className="flex items-center gap-1"><MapPin size={11} /> Nro. {room.numHabitacion}</span>
                      <span className="flex items-center gap-1"><Users size={11} /> {room.capacidad} persona{room.capacidad !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-bold text-white drop-shadow">${room.precioPorNoche}</span>
                    <p className="text-xs text-white/70">por noche</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="bg-white border-b border-line px-4 sm:px-6 py-2.5">
              <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-0.5">
                {roomImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all
                      ${activeImg === i
                        ? 'border-primary shadow-sm'
                        : 'border-transparent opacity-55 hover:opacity-80'}`}
                  >
                    <img
                      src={src.replace('w=1200', 'w=200')}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Content ─────────────────────────────────────────── */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left: details (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Score + availability row */}
                <div className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="score-badge px-3 py-2 text-xl">{score.toFixed(1)}</span>
                    <div>
                      <p className="font-semibold text-ink">{scoreLabel(score)}</p>
                      <p className="text-xs text-ink-secondary">{reviews} reseñas de huéspedes</p>
                    </div>
                  </div>
                  <div className="sm:ml-auto flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${room.disponible ? 'bg-score' : 'bg-gray-300'}`} />
                    <span className={`text-sm font-medium ${room.disponible ? 'text-score' : 'text-ink-light'}`}>
                      {room.disponible ? 'Disponible para reserva' : 'No disponible actualmente'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="card p-5">
                  <h2 className="text-base font-bold text-ink mb-3">Descripción</h2>
                  <p className="text-sm text-ink-secondary leading-relaxed">{room.descripcion}</p>
                </div>

                {/* Amenities */}
                <div className="card p-5">
                  <h2 className="text-base font-bold text-ink mb-4">Servicios incluidos</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2.5 py-2 px-3 bg-score-light rounded-xl">
                        <Check size={13} className="text-score shrink-0" />
                        <span className="text-sm text-ink-secondary">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Shield,     label: 'Cancelación gratuita', sub: 'Hasta 48h antes' },
                    { icon: Star,       label: `${score.toFixed(1)} / 10`, sub: 'Puntuación media' },
                    { icon: CreditCard, label: 'Pago 100% seguro',    sub: 'SSL certificado' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="card p-4 text-center flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center mb-1">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-ink leading-tight">{label}</span>
                      <span className="text-[10px] text-ink-light">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: booking card (sticky, 1/3) */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <div className="card sticky top-24 overflow-hidden">
                  {/* Primary stripe */}
                  <div className="h-1 bg-primary" />

                  <div className="p-5">
                    <div className="flex items-baseline justify-between mb-4">
                      <h3 className="text-base font-bold text-ink">Reservar</h3>
                      <div>
                        <span className="text-xl font-bold text-ink">${room.precioPorNoche}</span>
                        <span className="text-xs text-ink-secondary ml-1">/noche</span>
                      </div>
                    </div>

                    {bookErr && (
                      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                        <p className="text-xs text-red-600 leading-relaxed">{bookErr}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">

                      {/* ── Date picker ─────────────────────────── */}
                      <div>
                        <button
                          type="button"
                          onClick={() => { setCalOpen((v) => !v); setGuestOpen(false) }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all
                            ${calOpen ? 'border-primary ring-2 ring-primary/10' : 'border-line hover:border-gray-300'}`}
                        >
                          <div className="flex items-center gap-2">
                            <Moon size={15} className="text-ink-light" />
                            <div className="text-left">
                              {form.checkIn && form.checkOut ? (
                                <>
                                  <span className="font-medium text-ink">
                                    {fmtDate(form.checkIn)} → {fmtDate(form.checkOut)}
                                  </span>
                                  {nights > 0 && (
                                    <span className="text-ink-secondary text-xs ml-2">
                                      ({nights} noche{nights !== 1 ? 's' : ''})
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-ink-light">Selecciona las fechas</span>
                              )}
                            </div>
                          </div>
                          {calOpen ? <ChevronUp size={14} className="text-ink-light shrink-0" /> : <ChevronDown size={14} className="text-ink-light shrink-0" />}
                        </button>

                        {calOpen && (
                          <div className="mt-2 p-3 bg-white border border-line rounded-xl anim-slide-up">
                            <DateRangePicker
                              checkIn={form.checkIn}
                              checkOut={form.checkOut}
                              onChange={({ checkIn, checkOut }) => {
                                setForm((f) => ({ ...f, checkIn, checkOut }))
                                if (checkIn && checkOut) setCalOpen(false)
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Price summary (shown when dates are selected) */}
                      {nights > 0 && (
                        <div className="bg-page rounded-xl p-3.5 border border-line text-sm space-y-1.5">
                          <div className="flex justify-between text-ink-secondary">
                            <span>${room.precioPorNoche} × {nights} noche{nights !== 1 ? 's' : ''}</span>
                            <span>${total}</span>
                          </div>
                          <div className="flex justify-between font-bold text-ink pt-1.5 border-t border-line">
                            <span>Total</span>
                            <span className="text-primary text-base">${total}</span>
                          </div>
                        </div>
                      )}

                      {/* ── Guest data ───────────────────────────── */}
                      <div className="border border-line rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setGuestOpen((v) => !v)}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm bg-white hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-ink">Datos del huésped</span>
                          {guestOpen ? <ChevronUp size={14} className="text-ink-light" /> : <ChevronDown size={14} className="text-ink-light" />}
                        </button>

                        {guestOpen && (
                          <div className="p-4 border-t border-line space-y-3 anim-slide-up">
                            <div className="grid grid-cols-2 gap-2">
                              <Field label="Nombre">
                                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Juan" className="input-field py-2.5 text-sm" />
                              </Field>
                              <Field label="Apellido">
                                <input required value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} placeholder="Pérez" className="input-field py-2.5 text-sm" />
                              </Field>
                            </div>
                            <Field label="Correo electrónico">
                              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="juan@email.com" className="input-field py-2.5 text-sm" />
                            </Field>
                            <div className="grid grid-cols-2 gap-2">
                              <Field label="Teléfono">
                                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+57 300..." className="input-field py-2.5 text-sm" />
                              </Field>
                              <Field label="Documento">
                                <input required value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} placeholder="CC / Pasaporte" className="input-field py-2.5 text-sm" />
                              </Field>
                            </div>
                            <Field label="Observaciones (opcional)">
                              <textarea
                                value={form.observaciones}
                                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                                placeholder="Llegada tardía, solicitudes especiales..."
                                rows={2}
                                className="input-field py-2.5 text-sm resize-none"
                              />
                            </Field>
                          </div>
                        )}
                      </div>

                      {/* CTA button */}
                      <button
                        type="submit"
                        disabled={!room.disponible || submitting}
                        className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <><Spinner /> Procesando...</>
                        ) : (
                          <><CreditCard size={15} /> {room.disponible ? 'Reservar ahora' : 'No disponible'}</>
                        )}
                      </button>

                      <p className="text-[10px] text-ink-light text-center">
                        Sin cargos ocultos · Cancelación gratuita 48h antes
                      </p>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-semibold text-ink-light uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}
