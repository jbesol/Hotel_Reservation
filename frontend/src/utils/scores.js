// Display-only score data — not served by the backend.
// In a real implementation these would come from a reviews endpoint.
const DATA = {
  1: { score: 8.2, reviews: 47  },
  2: { score: 9.1, reviews: 83  },
  3: { score: 9.4, reviews: 61  },
  4: { score: 9.8, reviews: 29  },
  5: { score: 8.6, reviews: 52  },
  6: { score: 9.3, reviews: 74  },
  7: { score: 9.0, reviews: 38  },
  8: { score: 9.7, reviews: 22  },
}

export const getScore = (id) => DATA[Number(id)] ?? { score: 8.5, reviews: 35 }

export const scoreLabel = (score) => {
  if (score >= 9.5) return 'Excepcional'
  if (score >= 9.0) return 'Excelente'
  if (score >= 8.5) return 'Muy bueno'
  if (score >= 8.0) return 'Bueno'
  return 'Agradable'
}

// Stars per room type (display only)
export const TYPE_STARS = {
  SIMPLE:       3,
  DOBLE:        4,
  SUITE:        4,
  PRESIDENCIAL: 5,
}
