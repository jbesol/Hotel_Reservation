import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center anim-fade-in">
      <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1.5">No pudimos cargar los datos</h3>
      <p className="text-ink-secondary text-sm max-w-xs leading-relaxed mb-6">
        {message || 'Verifica tu conexión e intenta de nuevo.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 text-sm btn-secondary px-5 py-2.5"
        >
          <RefreshCcw size={13} />
          Reintentar
        </button>
      )}
    </div>
  )
}
