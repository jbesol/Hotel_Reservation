// ═══════════════════════════════════════════════════════════════════
// API SERVICE — Hotel Grand Meridian
//
// HOW TO SWITCH FROM MOCK → REAL BACKEND:
//   1. Set  USE_MOCK = false
//   2. Make sure your Spring Boot server is running on BASE_URL
//   3. Configure CORS in your Spring Boot app (allow http://localhost:3000)
// ═══════════════════════════════════════════════════════════════════

// ── Configuration ───────────────────────────────────────────────────
// Replace with your actual Spring Boot backend URL
const BASE_URL = 'http://localhost:8080/api/v1'

// Toggle to false to use the real REST API
const USE_MOCK = true

// Simulated network latency (ms)
const MOCK_DELAY = 750

// ── Mock data — mirrors HabitacionDto.Response ───────────────────────
const MOCK_HABITACIONES = [
  {
    id: 1,
    numHabitacion: '101',
    tipo: 'SIMPLE',
    precioPorNoche: 89.0,
    capacidad: 1,
    descripcion:
      'Habitación íntima pensada para el viajero reflexivo. Escritorio de madera de roble macizo, TV 4K de 55", ducha de efecto lluvia, cafetera Nespresso y amenidades de autor. La quietud perfecta para el descanso o el trabajo concentrado.',
    disponible: true,
  },
  {
    id: 2,
    numHabitacion: '205',
    tipo: 'DOBLE',
    precioPorNoche: 149.0,
    capacidad: 2,
    descripcion:
      'Amplia habitación para dos con cama king size de plumas premium, sala de estar integrada, ventanales de piso a techo con vistas al jardín botánico privado y bañera independiente en mármol blanco de Carrara.',
    disponible: true,
  },
  {
    id: 3,
    numHabitacion: '308',
    tipo: 'SUITE',
    precioPorNoche: 289.0,
    capacidad: 3,
    descripcion:
      'Suite de lujo contemporáneo con bañera de hidromasaje exenta, sala de estar separada con chimenea eléctrica, minibar gourmet reabastecido diariamente y terraza privada con vistas panorámicas al skyline.',
    disponible: true,
  },
  {
    id: 4,
    numHabitacion: '401',
    tipo: 'PRESIDENCIAL',
    precioPorNoche: 589.0,
    capacidad: 4,
    descripcion:
      'La cúspide de la hospitalidad: dos plantas con comedor para ocho personas, cocina profesional Gaggenau, galería de arte curada, mayordomo personal 24h, piscina privada con temperatura regulable y vistas de 360° sobre la ciudad.',
    disponible: true,
  },
  {
    id: 5,
    numHabitacion: '102',
    tipo: 'SIMPLE',
    precioPorNoche: 89.0,
    capacidad: 1,
    descripcion:
      'Refugio urbano con vista al jardín zen interior. Iluminación circadiana regulable, cama doble de plumas, escritorio ejecutivo flotante y baño revestido en travertino romano con ducha italiana.',
    disponible: true,
  },
  {
    id: 6,
    numHabitacion: '207',
    tipo: 'DOBLE',
    precioPorNoche: 165.0,
    capacidad: 2,
    descripcion:
      'Habitación doble premium con acceso directo a la piscina exterior, terraza privada con mobiliario de teca, servicio de desayuno continental in-room y cama king con dosel artesanal de hierro forjado.',
    disponible: true,
  },
  {
    id: 7,
    numHabitacion: '310',
    tipo: 'SUITE',
    precioPorNoche: 320.0,
    capacidad: 3,
    descripcion:
      'Suite de autor con sala de estar integrada, baño doble revestido en mármol blanco, escritorio de diseño firmado y una selección curada de obras de arte original de artistas colombianos emergentes.',
    disponible: false,
  },
  {
    id: 8,
    numHabitacion: '402',
    tipo: 'PRESIDENCIAL',
    precioPorNoche: 650.0,
    capacidad: 6,
    descripcion:
      'Piso completo de 280 m² con tres habitaciones maestras, cocina gourmet equipada, sala de cine privado en Dolby Atmos, sala de reuniones ejecutiva, acceso exclusivo al spa y servicio de mayordomo y chef privado las 24h.',
    disponible: true,
  },
]

// Mock huéspedes storage (simulates DB auto-increment)
let mockHuespedIdCounter = 1001

// ── Internal helpers ─────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const mockResolve = async (data, ms = MOCK_DELAY) => {
  await delay(ms)
  return data
}

const mockReject = async (message, ms = MOCK_DELAY) => {
  await delay(ms)
  throw new Error(message)
}

// ── Real fetch wrapper with error normalisation ───────────────────────
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

// ════════════════════════════════════════════════════════════════════
// HABITACIONES
// ════════════════════════════════════════════════════════════════════

/**
 * GET /api/v1/habitaciones
 * Supports client-side filters: tipo, minPrecio, maxPrecio, soloDisponibles
 */
export async function getHabitaciones({ tipo, minPrecio, maxPrecio, soloDisponibles } = {}) {
  if (USE_MOCK) {
    let result = [...MOCK_HABITACIONES]
    if (tipo)            result = result.filter((h) => h.tipo === tipo)
    if (minPrecio)       result = result.filter((h) => h.precioPorNoche >= Number(minPrecio))
    if (maxPrecio)       result = result.filter((h) => h.precioPorNoche <= Number(maxPrecio))
    if (soloDisponibles) result = result.filter((h) => h.disponible)
    return mockResolve(result)
  }

  // REAL API ──────────────────────────────────────────────────────
  if (soloDisponibles) {
    return apiFetch('/habitaciones/disponibles')
  }
  const params = new URLSearchParams()
  if (tipo)      params.append('tipo', tipo)
  if (minPrecio) params.append('minPrecio', minPrecio)
  if (maxPrecio) params.append('maxPrecio', maxPrecio)
  return apiFetch(`/habitaciones?${params.toString()}`)
}

/**
 * GET /api/v1/habitaciones/disponibles/fechas?checkIn=...&checkOut=...
 */
export async function getHabitacionesDisponiblesPorFechas(checkIn, checkOut, tipo = '') {
  if (USE_MOCK) {
    let result = MOCK_HABITACIONES.filter((h) => h.disponible)
    if (tipo) result = result.filter((h) => h.tipo === tipo)
    return mockResolve(result)
  }

  // REAL API ──────────────────────────────────────────────────────
  return apiFetch(`/habitaciones/disponibles/fechas?checkIn=${checkIn}&checkOut=${checkOut}`)
}

/**
 * GET /api/v1/habitaciones/:id
 */
export async function getHabitacionById(id) {
  if (USE_MOCK) {
    const hab = MOCK_HABITACIONES.find((h) => h.id === Number(id))
    if (!hab) return mockReject('Habitación no encontrada')
    return mockResolve(hab)
  }

  // REAL API ──────────────────────────────────────────────────────
  return apiFetch(`/habitaciones/${id}`)
}

// ════════════════════════════════════════════════════════════════════
// HUÉSPEDES
// ════════════════════════════════════════════════════════════════════

/**
 * POST /api/v1/huespedes
 * Creates guest first; returns guest with generated ID used for reservation
 */
export async function crearHuesped({ nombre, apellido, email, telefono, documento }) {
  if (USE_MOCK) {
    const nuevoId = mockHuespedIdCounter++
    return mockResolve({ id: nuevoId, nombre, apellido, email, telefono, documento }, 600)
  }

  // REAL API ──────────────────────────────────────────────────────
  return apiFetch('/huespedes', {
    method: 'POST',
    body: JSON.stringify({ nombre, apellido, email, telefono, documento }),
  })
}

// ════════════════════════════════════════════════════════════════════
// RESERVAS
// ════════════════════════════════════════════════════════════════════

/**
 * POST /api/v1/reservas  → 201 Created
 * Payload: { huespedId, habitacionId, checkIn, checkOut, observaciones }
 */
export async function crearReserva({ huespedId, habitacionId, checkIn, checkOut, observaciones }) {
  if (USE_MOCK) {
    const hab = MOCK_HABITACIONES.find((h) => h.id === Number(habitacionId))
    const reservationId = Math.floor(Math.random() * 90000) + 10000
    return mockResolve(
      {
        id: reservationId,
        habitacion: hab,
        checkIn,
        checkOut,
        estado: 'PENDIENTE',
        totalPagar: null, // backend calculates this
        observaciones: observaciones || null,
      },
      1100
    )
  }

  // REAL API ──────────────────────────────────────────────────────
  const res = await fetch(`${BASE_URL}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ huespedId, habitacionId, checkIn, checkOut, observaciones }),
  })
  if (res.status !== 201) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

/**
 * GET /api/v1/reservas
 */
export async function getReservas() {
  if (USE_MOCK) return mockResolve([])
  return apiFetch('/reservas')
}

/**
 * GET /api/v1/reservas/:id
 */
export async function getReservaById(id) {
  if (USE_MOCK) return mockResolve(null)
  return apiFetch(`/reservas/${id}`)
}

/**
 * PATCH /api/v1/reservas/:id/estado?nuevoEstado=...
 */
export async function cambiarEstadoReserva(id, nuevoEstado) {
  if (USE_MOCK) return mockResolve({ id, estado: nuevoEstado })
  return apiFetch(`/reservas/${id}/estado?nuevoEstado=${nuevoEstado}`, { method: 'PATCH' })
}
