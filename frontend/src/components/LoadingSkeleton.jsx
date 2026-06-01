export function CardSkeleton() {
  return (
    <div className="card overflow-hidden flex flex-col sm:flex-row">
      {/* Image area */}
      <div className="shimmer-bg h-44 sm:h-auto sm:w-52 shrink-0" />
      {/* Content */}
      <div className="flex-1 p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="shimmer-bg h-5 w-32 rounded" />
            <div className="shimmer-bg h-3 w-20 rounded" />
          </div>
          <div className="shimmer-bg h-10 w-14 rounded-lg" />
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="shimmer-bg h-3 w-full rounded" />
          <div className="shimmer-bg h-3 w-4/5 rounded" />
        </div>
        <div className="flex gap-2 pt-1">
          {[1,2,3].map(i => <div key={i} className="shimmer-bg h-7 w-24 rounded-full" />)}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="shimmer-bg h-6 w-28 rounded" />
          <div className="shimmer-bg h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="shimmer-bg h-56 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="shimmer-bg h-7 w-1/2 rounded-lg" />
          <div className="shimmer-bg h-4 w-1/3 rounded" />
          {[1,2,3,4].map(i => (
            <div key={i} className="shimmer-bg h-3 rounded" style={{ width: `${100 - i * 7}%` }} />
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="shimmer-bg h-12 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="shimmer-bg h-[480px] rounded-2xl" />
      </div>
    </div>
  )
}
