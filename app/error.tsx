'use client'

// Error boundary for the home page.
// Shown when getCachedHallsAndHours() or any server-side call throws.

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4 text-center px-6">
      <p className="text-4xl">⚠️</p>
      <div>
        <p className="font-semibold text-gray-800 text-base">Couldn't load dining data</p>
        <p className="text-sm text-gray-400 mt-1">
          {error.message ?? 'An unexpected error occurred.'}
        </p>
      </div>
      <button
        onClick={reset}
        className="mt-2 px-5 py-2 rounded-full bg-[#003262] text-white text-sm font-semibold transition-opacity active:opacity-80"
      >
        Try again
      </button>
    </div>
  )
}
