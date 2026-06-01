import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-line shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Building2 size={14} className="text-primary" />
          </div>
          <span className="font-brand text-base font-semibold text-ink">
            Grand <span className="text-primary italic">Meridian</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink to="/resultados">Habitaciones</NavLink>
          <Link to="/resultados" className="btn-primary text-sm px-5 py-2 inline-flex items-center">
            Reservar
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-ink-secondary"
          aria-label="Menú"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-line px-4 py-4 flex flex-col gap-3 anim-slide-up">
          <NavLink to="/resultados">Habitaciones</NavLink>
          <Link to="/resultados" className="btn-primary text-sm px-5 py-3 text-center">
            Reservar ahora
          </Link>
        </div>
      )}
    </header>
  )
}

function NavLink({ to, children }) {
  const { pathname } = useLocation()
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        pathname === to ? 'text-primary' : 'text-ink-secondary hover:text-ink'
      }`}
    >
      {children}
    </Link>
  )
}
