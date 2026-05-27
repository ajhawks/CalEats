// Halls page — static placeholder data only (Phase 4.1)
// Updated in Phase 4.2: links to /halls/[slug] detail pages

import Link from 'next/link'

const DINING_HALLS = [
  {
    slug: 'cafe-3',
    name: 'Café 3',
    type: 'Dining Commons',
    location: 'Unit 3, Southside',
    isOpen: true,
    currentPeriod: 'Lunch',
    closesAt: '2:00 PM',
    emoji: '🍽️',
  },
  {
    slug: 'crossroads',
    name: 'Crossroads',
    type: 'Dining Commons',
    location: 'Unit 1, Northside',
    isOpen: true,
    currentPeriod: 'Lunch',
    closesAt: '2:00 PM',
    emoji: '🥘',
  },
  {
    slug: 'foothill',
    name: 'Foothill',
    type: 'Dining Commons',
    location: 'Foothill / Stern Hall',
    isOpen: false,
    currentPeriod: null,
    closesAt: null,
    emoji: '🏔️',
  },
  {
    slug: 'clark-kerr',
    name: 'Clark Kerr',
    type: 'Dining Commons',
    location: 'Clark Kerr Campus',
    isOpen: true,
    currentPeriod: 'Lunch',
    closesAt: '2:00 PM',
    emoji: '🌿',
  },
]

const CAMPUS_RESTAURANTS = [
  {
    slug: 'golden-bear-cafe',
    name: 'Golden Bear Café',
    type: 'Campus Restaurant',
    location: 'MLK Student Union',
    isOpen: true,
    currentPeriod: 'All Day',
    closesAt: '4:00 PM',
    emoji: '☕',
  },
  {
    slug: 'student-union',
    name: 'The Eateries',
    type: 'Campus Restaurant',
    location: 'MLK Student Union',
    isOpen: true,
    currentPeriod: 'All Day',
    closesAt: '3:00 PM',
    emoji: '🥪',
  },
  {
    slug: 'browns',
    name: 'Browns',
    type: 'Campus Restaurant',
    location: 'Bancroft Way',
    isOpen: false,
    currentPeriod: null,
    closesAt: null,
    emoji: '🍕',
  },
]

type Hall = (typeof DINING_HALLS)[number]

function HallCard({ slug, name, location, isOpen, currentPeriod, closesAt, emoji }: Hall) {
  return (
    <Link
      href={`/halls/${slug}`}
      className={`block rounded-2xl border p-4 bg-white shadow-sm transition-colors active:bg-gray-50 ${!isOpen ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">{emoji}</span>
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">{name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{location}</p>
          </div>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
            isOpen ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      {isOpen && currentPeriod && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-400">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-500">
              Serving <span className="font-medium text-gray-700">{currentPeriod}</span> until {closesAt}
            </span>
          </div>
          <span className="text-xs text-[#003262] font-medium">View menu →</span>
        </div>
      )}
    </Link>
  )
}

export default function HallsPage() {
  return (
    <div className="px-4 py-5 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dining Halls</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {DINING_HALLS.filter((h) => h.isOpen).length} of {DINING_HALLS.length} open now
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Dining Commons
        </h3>
        {DINING_HALLS.map((hall) => (
          <HallCard key={hall.name} {...hall} />
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Campus Restaurants
        </h3>
        {CAMPUS_RESTAURANTS.map((hall) => (
          <HallCard key={hall.name} {...hall} />
        ))}
      </section>
    </div>
  )
}
