import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, X, SearchX, Star, Check, MapPin, Users } from 'lucide-react'
import { getHabitaciones, getHabitacionesDisponiblesPorFechas } from '../api/api'
import { CardSkeleton } from '../components/LoadingSkeleton'
import ErrorBanner from '../components/ErrorBanner'
import { getScore, scoreLabel, TYPE_STARS } from '../utils/scores'
import { getRoomThumb } from '../utils/images'

// ── Display constants ────────────────────────────────────────────────
const TIPOS = ['SIMPLE', 'DOBLE', 'SUITE', 'PRESIDENCIAL']

const TIPO_META = {
  SIMPLE:       { icon: '🛏️', label: 'Simple',       grad: 'grad-simple',       chip: 'bg-blue-50   text-blue-700   border-blue-200'  },
  DOBLE:        { icon: '🏡', label: 'Doble',        grad: 'grad-doble',        chip: 'bg-orange-50 text-orange-700 border-orange-200' },
  SUITE:        { icon: '✨', label: 'Suite',         grad: 'grad-suite',        chip: 'bg-purple-50 text-purple-700 border-purple-200' },
  PRESIDENCIAL: { icon: '👑', label: 'Presidencial',  grad: 'grad-presidencial', chip: 'bg-amber-50  text-amber-700  border-amber-200'  },
}

const AMENITY_PREVIEW = {
  SIMPLE:       ['Wi-Fi gratis', 'Ducha lluvia', 'Cafetera'],
  DOBLE:        ['Wi-Fi gratis', 'Bañera mármol', 'Vista jardín'],
  SUITE:        ['Hidromasaje', 'Terraza privada', 'Minibar premium'],
  PRESIDENCIAL: ['Piscina privada', 'Chef privado', 'Mayordomo 24h'],
}

// ────────────────────────────────────────────────────────────────────

export default function Results() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [rooms,      setRooms]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const [filters, setFilters] = useState({
    tipo:            searchParams.get('tipo')            || '',
    checkIn:         searchParams.get('checkIn')         || '',
    checkOut:        searchParams.get('checkOut')        || '',
    maxPrecio:       searchParams.get('maxPrecio')       || '700',
    soloDisponibles: searchParams.get('soloDisponibles') === 'true',
  })

  const syncUrl = (f) => {
    const p = {}
    if (f.tipo)               p.tipo            = f.tipo
    if (f.checkIn)            p.checkIn         = f.checkIn
    if (f.checkOut)           p.checkOut        = f.checkOut
    if (f.maxPrecio !== '700') p.maxPrecio      = f.maxPrecio
    if (f.soloDisponibles)    p.soloDisponibles = 'true'
    setSearchParams(p)
  }

  const update = (key, value) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    syncUrl(next)
  }

  const clearAll = () => {
    const blank = { tipo: '', checkIn: '', checkOut: '', maxPrecio: '700', soloDisponibles: false }
    setFilters(blank)
    setSearchParams({})
  }

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let data = filters.checkIn && filters.checkOut
        ? await getHabitacionesDisponiblesPorFechas(filters.checkIn, filters.checkOut, filters.tipo)
        : await getHabitaciones({ tipo: filters.tipo || undefined, soloDisponibles: filters.soloDisponibles || undefined })

      // Client-side price cap
      data = data.filter((h) => h.precioPorNoche <= Number(filters.maxPrecio))
      setRooms(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filters]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchRooms() }, [fetchRooms])

  const today    = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const hasActive = filters.tipo || filters.checkIn || filters.soloDisponibles || filters.maxPrecio !== '700'

  return (
    <div className="min-h-screen bg-page pt-14">

      {/* ── Top bar ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-line sticky top-14 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base font-semibold text-ink truncate">Habitaciones</h1>
            {!loading && (
              <span className="text-sm text-ink-secondary shrink-0">
                {rooms.length} resultado{rooms.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasActive && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors"
              >
                <X size={11} />
                Limpiar
              </button>
            )}
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className={`inline-flex items-center gap-2 text-sm px-3.5 py-2 rounded-xl border transition-all ${
                filterOpen || hasActive
                  ? 'border-primary text-primary bg-primary-light'
                  : 'border-line text-ink-secondary bg-white hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filtros</span>
              {hasActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          </div>
        </div>

        {/* Expandable filter bar */}
        {filterOpen && (
          <div className="border-t border-line bg-white px-4 sm:px-6 py-4 anim-slide-up">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Tipo */}
              <div>
                <label className="block text-[10px] font-semibold text-ink-light uppercase tracking-wide mb-1.5">
                  Tipo de habitación
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['', ...TIPOS].map((t) => (
                    <button
                      key={t || 'all'}
                      type="button"
                      onClick={() => update('tipo', t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        filters.tipo === t
                          ? 'border-primary bg-primary text-white'
                          : 'border-line bg-white text-ink-secondary hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      {t ? `${TIPO_META[t].icon} ${TIPO_META[t].label}` : 'Todos'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="block text-[10px] font-semibold text-ink-light uppercase tracking-wide mb-1.5">
                  Fechas
                </label>
                <div className="flex gap-2">
                  <input
                    type="date" value={filters.checkIn} min={today}
                    onChange={(e) => update('checkIn', e.target.value)}
                    className="input-field text-xs py-2 flex-1"
                  />
                  <input
                    type="date" value={filters.checkOut} min={filters.checkIn || tomorrow}
                    onChange={(e) => update('checkOut', e.target.value)}
                    className="input-field text-xs py-2 flex-1"
                  />
                </div>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-[10px] font-semibold text-ink-light uppercase tracking-wide mb-1.5">
                  Precio máximo · <span className="text-ink">${filters.maxPrecio}</span>/noche
                </label>
                <input
                  type="range" min={0} max={700} step={10}
                  value={filters.maxPrecio}
                  onChange={(e) => update('maxPrecio', e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-ink-light mt-1">
                  <span>$0</span><span>$700</span>
                </div>
              </div>

              {/* Disponibles */}
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => update('soloDisponibles', !filters.soloDisponibles)}
                    className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${
                      filters.soloDisponibles ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      filters.soloDisponibles ? 'left-5' : 'left-0.5'
                    }`} />
                  </div>
                  <span className="text-sm text-ink-secondary">Solo disponibles</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Room list ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorBanner message={error} onRetry={fetchRooms} />
        ) : rooms.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <div className="space-y-4">
            {rooms.map((room, i) => (
              <RoomCard
                key={room.id}
                room={room}
                index={i}
                onClick={() => navigate(`/habitacion/${room.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Room card ─────────────────────────────────────────────────────────
function RoomCard({ room, index, onClick }) {
  const meta       = TIPO_META[room.tipo]   || TIPO_META.SIMPLE
  const amenities  = AMENITY_PREVIEW[room.tipo] || []
  const stars      = TYPE_STARS[room.tipo]  || 3
  const { score, reviews } = getScore(room.id)
  const label      = scoreLabel(score)

  return (
    <div
      className={`card overflow-hidden flex flex-col sm:flex-row transition-all duration-250 anim-slide-up
        ${room.disponible
          ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer'
          : 'opacity-80 cursor-not-allowed'
        }`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={room.disponible ? onClick : undefined}
    >
      {/* ── Image area ─────────── */}
      <div className={`relative ${meta.grad} shrink-0 h-48 sm:h-auto sm:w-52 lg:w-64 overflow-hidden`}>
        {/* Real photo — gradient is the fallback when image fails */}
        <img
          src={getRoomThumb(room.id, room.tipo)}
          alt={`Habitación ${meta.label}`}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 dots-overlay" />

        {/* Room number */}
        <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm rounded-md px-2 py-0.5">
          <span className="text-[10px] font-medium text-white/90">Nro. {room.numHabitacion}</span>
        </div>

        {/* Stars */}
        <div className="absolute top-3 right-3 flex items-center gap-0.5">
          {Array.from({ length: stars }).map((_, i) => (
            <Star key={i} size={11} className="text-yellow-300 fill-yellow-300" />
          ))}
        </div>

        {/* Type icon (decorative) */}
        <div className="absolute bottom-4 right-4 text-5xl opacity-20 select-none">
          {meta.icon}
        </div>

        {/* Unavailable overlay */}
        {!room.disponible && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-medium text-ink-secondary border border-line bg-white/80 px-3 py-1.5 rounded-full">
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* ── Card body ─────────────────────── */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          {/* Title + type chip */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-ink">
                {meta.label} — {room.tipo === 'PRESIDENCIAL' ? 'Suite Presidencial' : `Habitación ${meta.label}`}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-secondary">
              <span className="flex items-center gap-1"><MapPin size={11} /> Nro. {room.numHabitacion}</span>
              <span className="flex items-center gap-1"><Users size={11} /> {room.capacidad} pers.</span>
              <span
                className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${meta.chip}`}
              >
                {meta.label}
              </span>
            </div>
          </div>

          {/* Score badge */}
          <div className="shrink-0 text-right">
            <div className="inline-flex flex-col items-center gap-0.5">
              <span className="score-badge px-2.5 py-1.5 text-base">
                {score.toFixed(1)}
              </span>
              <span className="text-[10px] font-medium text-score">{label}</span>
              <span className="text-[10px] text-ink-light">{reviews} reseñas</span>
            </div>
          </div>
        </div>

        {/* Description preview */}
        <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 mb-3">
          {room.descripcion}
        </p>

        {/* Amenities chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {amenities.map((a) => (
            <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-ink-secondary border border-line">
              <Check size={10} className="text-score" />
              {a}
            </span>
          ))}
        </div>

        {/* Footer: availability + price + CTA */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-line">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${room.disponible ? 'bg-score' : 'bg-gray-300'}`} />
            <span className={`text-xs font-medium ${room.disponible ? 'text-score' : 'text-ink-light'}`}>
              {room.disponible ? 'Disponible' : 'Ocupada'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xl font-bold text-ink">${room.precioPorNoche}</span>
              <span className="text-xs text-ink-secondary ml-1">/noche</span>
            </div>
            <button
              disabled={!room.disponible}
              className="btn-primary px-5 py-2.5 text-sm whitespace-nowrap"
            >
              {room.disponible ? 'Ver y reservar' : 'No disponible'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────
function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center anim-fade-in">
      <SearchX size={36} className="text-gray-300 mb-4" />
      <h3 className="text-base font-semibold text-ink mb-1.5">Sin resultados</h3>
      <p className="text-sm text-ink-secondary max-w-xs leading-relaxed">
        No encontramos habitaciones con los filtros actuales. Ajusta el rango de precios o el tipo.
      </p>
      <button
        onClick={onClear}
        className="mt-6 text-sm text-primary hover:text-primary-hover transition-colors font-medium underline underline-offset-4"
      >
        Ver todas las habitaciones
      </button>
    </div>
  )
}
