import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BedDouble, CalendarDays, Users, X, ChevronDown, Check } from 'lucide-react'
import DateRangePicker from '../components/DateRangePicker'

// ── Room type options with metadata ─────────────────────────────────
const TIPO_OPTIONS = [
  { value: 'SIMPLE',       icon: '🛏️', label: 'Simple',        desc: 'Ideal para una persona',          desde: 89  },
  { value: 'DOBLE',        icon: '🏡', label: 'Doble',         desc: 'Para parejas o dos personas',      desde: 149 },
  { value: 'SUITE',        icon: '✨', label: 'Suite',          desc: 'Lujo y comodidad premium',         desde: 289 },
  { value: 'PRESIDENCIAL', icon: '👑', label: 'Presidencial',   desc: 'La experiencia definitiva',        desde: 589 },
]

function fmtDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

// ────────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()

  const [search, setSearch] = useState({
    tipo: '', checkIn: '', checkOut: '', guests: 2,
  })

  // Which panel is open: 'tipo' | 'dates' | 'guests' | null
  const [panel, setPanel] = useState(null)
  // Predictive filter text in the tipo dropdown
  const [tipoQuery, setTipoQuery] = useState('')

  const formRef = useRef(null)

  // Close panels when clicking outside the form
  useEffect(() => {
    const onDown = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) setPanel(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const togglePanel = (name) => setPanel((p) => (p === name ? null : name))

  const handleSearch = (e) => {
    e.preventDefault()
    setPanel(null)
    const params = new URLSearchParams()
    if (search.tipo)    params.append('tipo', search.tipo)
    if (search.checkIn) params.append('checkIn', search.checkIn)
    if (search.checkOut) params.append('checkOut', search.checkOut)
    if (search.guests)  params.append('guests', search.guests)
    navigate(`/resultados?${params.toString()}`)
  }

  const clearTipo = () => {
    setSearch((s) => ({ ...s, tipo: '' }))
    setTipoQuery('')
  }

  const filteredTipos = TIPO_OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(tipoQuery.toLowerCase())
  )

  const selectedTipo = TIPO_OPTIONS.find((o) => o.value === search.tipo)

  const dateLabel = (() => {
    const ci = fmtDate(search.checkIn)
    const co = fmtDate(search.checkOut)
    if (ci && co) return `${ci}  →  ${co}`
    if (ci)       return `${ci}  →  ¿Salida?`
    return null
  })()

  const today    = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  return (
    /* Full-viewport centering — search is the absolute protagonist */
    <div className="min-h-screen bg-page flex flex-col">

      {/* ── Hero area ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8">

        {/* Brand mark */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs font-medium text-ink-light uppercase tracking-[0.25em] mb-2">
            Grand Meridian Hotel · Bogotá
          </p>
          <h1 className="font-brand text-4xl sm:text-5xl font-bold text-ink leading-tight">
            Encuentra tu{' '}
            <span className="text-primary italic">habitación perfecta</span>
          </h1>
          <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-sm mx-auto">
            Selecciona fechas y tipo de habitación para ver disponibilidad en tiempo real.
          </p>
        </div>

        {/* ══ SEARCH FORM ════════════════════════════════════════ */}
        <div ref={formRef} className="w-full max-w-3xl">
          <form onSubmit={handleSearch}>

            {/* ─ Unified search bar ─────────────────────────────── */}
            {/* Desktop: horizontal pill | Mobile: vertical stack  */}
            <div className="card shadow-search overflow-visible">

              {/* Mobile layout: stacked fields */}
              <div className="flex flex-col sm:hidden divide-y divide-line">
                <MobileField
                  icon={<BedDouble size={18} className="text-ink-light" />}
                  label="Tipo de habitación"
                  value={selectedTipo ? `${selectedTipo.icon} ${selectedTipo.label}` : null}
                  placeholder="Cualquier tipo"
                  onTap={() => togglePanel('tipo')}
                  onClear={selectedTipo ? clearTipo : null}
                />
                <MobileField
                  icon={<CalendarDays size={18} className="text-ink-light" />}
                  label="Fechas"
                  value={dateLabel}
                  placeholder="Check-in → Check-out"
                  onTap={() => togglePanel('dates')}
                  onClear={search.checkIn ? () => setSearch((s) => ({ ...s, checkIn: '', checkOut: '' })) : null}
                />
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-ink-light shrink-0" />
                    <div>
                      <p className="text-[10px] text-ink-light uppercase tracking-wide font-medium">Personas</p>
                      <p className="text-sm font-medium text-ink">
                        {search.guests} persona{search.guests !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <GuestCounter
                    value={search.guests}
                    onChange={(v) => setSearch((s) => ({ ...s, guests: v }))}
                  />
                </div>
                <div className="p-3">
                  <button type="submit" className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
                    <Search size={18} />
                    Buscar habitaciones
                  </button>
                </div>
              </div>

              {/* Desktop layout: horizontal segments */}
              <div className="hidden sm:flex items-stretch divide-x divide-line">
                {/* Tipo */}
                <button
                  type="button"
                  onClick={() => togglePanel('tipo')}
                  className={`flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50/80 transition-colors rounded-l-2xl relative ${panel === 'tipo' ? 'bg-primary-light/40' : ''}`}
                >
                  <BedDouble size={18} className="text-ink-light shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-ink-light uppercase tracking-wide font-medium">Habitación</p>
                    <p className={`text-sm truncate ${selectedTipo ? 'font-medium text-ink' : 'text-ink-light'}`}>
                      {selectedTipo ? `${selectedTipo.icon} ${selectedTipo.label}` : 'Cualquier tipo'}
                    </p>
                  </div>
                  {selectedTipo
                    ? <button type="button" onClick={(e) => { e.stopPropagation(); clearTipo() }} className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"><X size={13} className="text-ink-light" /></button>
                    : <ChevronDown size={14} className={`text-ink-light transition-transform ${panel === 'tipo' ? 'rotate-180' : ''}`} />
                  }
                </button>

                {/* Dates */}
                <button
                  type="button"
                  onClick={() => togglePanel('dates')}
                  className={`flex-1 flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50/80 transition-colors relative ${panel === 'dates' ? 'bg-primary-light/40' : ''}`}
                >
                  <CalendarDays size={18} className="text-ink-light shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-ink-light uppercase tracking-wide font-medium">Fechas</p>
                    <p className={`text-sm truncate ${dateLabel ? 'font-medium text-ink' : 'text-ink-light'}`}>
                      {dateLabel || 'Check-in → Check-out'}
                    </p>
                  </div>
                  {search.checkIn
                    ? <button type="button" onClick={(e) => { e.stopPropagation(); setSearch((s) => ({ ...s, checkIn: '', checkOut: '' })) }} className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"><X size={13} className="text-ink-light" /></button>
                    : <ChevronDown size={14} className={`text-ink-light transition-transform ${panel === 'dates' ? 'rotate-180' : ''}`} />
                  }
                </button>

                {/* Guests */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <Users size={18} className="text-ink-light shrink-0" />
                  <div>
                    <p className="text-[10px] text-ink-light uppercase tracking-wide font-medium">Personas</p>
                    <p className="text-sm font-medium text-ink whitespace-nowrap">
                      {search.guests} pers.
                    </p>
                  </div>
                  <GuestCounter
                    value={search.guests}
                    onChange={(v) => setSearch((s) => ({ ...s, guests: v }))}
                  />
                </div>

                {/* Search CTA */}
                <button
                  type="submit"
                  className="btn-primary px-7 rounded-r-2xl rounded-l-none flex items-center gap-2 text-sm shrink-0"
                >
                  <Search size={16} />
                  Buscar
                </button>
              </div>
            </div>

            {/* ─ Tipo dropdown ──────────────────────────────────── */}
            {panel === 'tipo' && (
              <div className="mt-2 card shadow-dropdown p-3 anim-slide-up">
                {/* Predictive text filter */}
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
                  <input
                    autoFocus
                    type="text"
                    value={tipoQuery}
                    onChange={(e) => setTipoQuery(e.target.value)}
                    placeholder="Busca un tipo de habitación..."
                    className="input-field pl-9 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  {filteredTipos.length === 0 ? (
                    <p className="text-center text-sm text-ink-light py-4">Sin coincidencias</p>
                  ) : filteredTipos.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSearch((s) => ({ ...s, tipo: opt.value }))
                        setTipoQuery('')
                        setPanel(null)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors
                        ${search.tipo === opt.value ? 'bg-primary-light' : 'hover:bg-gray-50'}`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink">{opt.label}</p>
                        <p className="text-xs text-ink-secondary">{opt.desc} · desde ${opt.desde}/noche</p>
                      </div>
                      {search.tipo === opt.value && <Check size={15} className="text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─ Dates dropdown ─────────────────────────────────── */}
            {panel === 'dates' && (
              <div className="mt-2 card shadow-dropdown p-4 sm:p-5 anim-slide-up">
                <DateRangePicker
                  checkIn={search.checkIn}
                  checkOut={search.checkOut}
                  onChange={({ checkIn, checkOut }) => setSearch((s) => ({ ...s, checkIn, checkOut }))}
                />
                {search.checkIn && search.checkOut && (
                  <div className="mt-4 pt-3 border-t border-line flex justify-end">
                    <button
                      type="button"
                      onClick={() => setPanel(null)}
                      className="btn-primary px-5 py-2 text-sm"
                    >
                      Confirmar fechas
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* ─ Quick-select chips ─────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
            <span className="text-xs text-ink-light">Populares:</span>
            {TIPO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSearch((s) => ({ ...s, tipo: opt.value }))
                  navigate(`/resultados?tipo=${opt.value}`)
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-line bg-white hover:border-primary/40 hover:text-primary hover:bg-primary-light transition-all"
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── Minimal footer ─────────────────────────────────────────── */}
      <footer className="border-t border-line py-5 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-light">
          <span className="font-brand text-sm font-semibold text-ink">
            Grand <span className="text-primary italic">Meridian</span>
          </span>
          <span>© {new Date().getFullYear()} Reservas · Todos los derechos reservados</span>
        </div>
      </footer>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────

function MobileField({ icon, label, value, placeholder, onTap, onClear }) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
    >
      <span className="shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-ink-light uppercase tracking-wide font-medium">{label}</p>
        <p className={`text-sm font-medium truncate ${value ? 'text-ink' : 'text-ink-light'}`}>
          {value || placeholder}
        </p>
      </div>
      {onClear ? (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClear() }}
          className="p-1 hover:bg-gray-200 rounded-full shrink-0"
        >
          <X size={13} className="text-ink-light" />
        </button>
      ) : (
        <ChevronDown size={14} className="text-ink-light shrink-0" />
      )}
    </button>
  )
}

function GuestCounter({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink-secondary hover:border-primary hover:text-primary transition-colors text-lg font-light disabled:opacity-30"
        disabled={value <= 1}
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(6, value + 1))}
        className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink-secondary hover:border-primary hover:text-primary transition-colors text-lg font-light disabled:opacity-30"
        disabled={value >= 6}
      >
        +
      </button>
    </div>
  )
}
