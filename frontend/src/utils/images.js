// Real hotel room photos from Unsplash (free, no API key needed).
// Each type has 4 photos for the detail gallery; rooms pick their starting index
// so two rooms of the same type show a different main photo.

const BASE = 'https://images.unsplash.com'
const q    = 'auto=format&fit=crop&q=80'

const TYPE_IMAGES = {
  SIMPLE: [
    `${BASE}/photo-1631049307264-da0ec9d70304?${q}&w=1200`,
    `${BASE}/photo-1566665797739-1674de7a421a?${q}&w=1200`,
    `${BASE}/photo-1582719478250-c89cae4dc85b?${q}&w=1200`,
    `${BASE}/photo-1520250497591-112f2f40a3f4?${q}&w=1200`,
  ],
  DOBLE: [
    `${BASE}/photo-1631049552057-403cdb8f0658?${q}&w=1200`,
    `${BASE}/photo-1590490360182-c33d57733427?${q}&w=1200`,
    `${BASE}/photo-1618773928121-c32242e63f39?${q}&w=1200`,
    `${BASE}/photo-1595576508898-0ad5c879a061?${q}&w=1200`,
  ],
  SUITE: [
    `${BASE}/photo-1578683010236-d716f9a3f461?${q}&w=1200`,
    `${BASE}/photo-1604014237800-1c9102c219da?${q}&w=1200`,
    `${BASE}/photo-1615460549969-36fa19521a4f?${q}&w=1200`,
    `${BASE}/photo-1636198445701-c45d7e1e74e7?${q}&w=1200`,
  ],
  PRESIDENCIAL: [
    `${BASE}/photo-1631679706909-1844bbd07221?${q}&w=1200`,
    `${BASE}/photo-1582719508461-905c673771fd?${q}&w=1200`,
    `${BASE}/photo-1596178060810-72f53ce9a65c?${q}&w=1200`,
    `${BASE}/photo-1602941525421-8f8b81d3edbb?${q}&w=1200`,
  ],
}

// Each room ID maps to a starting offset into its type's image array,
// so two Simple rooms show different main photos.
const ROOM_OFFSET = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1, 6: 1, 7: 1, 8: 1 }

/**
 * Returns all images for a room, rotated so the room's unique photo is first.
 */
export function getRoomImages(id, tipo) {
  const imgs = TYPE_IMAGES[tipo] ?? TYPE_IMAGES.SIMPLE
  const start = ROOM_OFFSET[id] ?? 0
  return [...imgs.slice(start), ...imgs.slice(0, start)]
}

/**
 * Returns the single thumbnail URL used in the results card.
 */
export function getRoomThumb(id, tipo) {
  const imgs = TYPE_IMAGES[tipo] ?? TYPE_IMAGES.SIMPLE
  const idx  = ROOM_OFFSET[id] ?? 0
  const url  = imgs[idx]
  // Request a smaller crop for list view
  return url.replace('w=1200', 'w=600')
}
