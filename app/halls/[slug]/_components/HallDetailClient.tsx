'use client'

import { useState } from 'react'
import Link from 'next/link'
import type {
  MockHall,
  MockMenuItem,
  MealPeriodName,
  CarbonFootprint,
} from '@/app/_lib/data/mock-halls'

// ---------------------------------------------------------------------------
// Display metadata
// Real scraper labels: 'vegan' | 'vegetarian' | 'halal' | 'kosher'
// Mock data also uses: 'gluten-free'
// Any unknown label falls back gracefully.
// ---------------------------------------------------------------------------

const DIETARY_META: Record<string, { short: string; color: string }> = {
  'vegan':       { short: 'VE', color: 'bg-green-100 text-green-800' },
  'vegetarian':  { short: 'VG', color: 'bg-emerald-100 text-emerald-800' },
  'halal':       { short: 'HL', color: 'bg-blue-100 text-blue-800' },
  'kosher':      { short: 'KO', color: 'bg-purple-100 text-purple-800' },
  'gluten-free': { short: 'GF', color: 'bg-amber-100 text-amber-800' },
}

const ALLERGEN_EMOJI: Record<string, string> = {
  'milk':       '🥛',
  'egg':        '🥚',
  'fish':       '🐟',
  'shellfish':  '🦐',
  'tree-nuts':  '🌰',
  'wheat':      '🌾',
  'peanuts':    '🥜',
  'soybeans':   '🫘',
  'sesame':     '🌻',
}

const CARBON_META: Record<Exclude<CarbonFootprint, null>, { emoji: string; label: string; color: string }> = {
  low:    { emoji: '🟢', label: 'Low',    color: 'text-green-700' },
  medium: { emoji: '🟡', label: 'Medium', color: 'text-yellow-600' },
  high:   { emoji: '🔴', label: 'High',   color: 'text-red-600' },
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DietaryPills({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {labels.map((l) => {
        const meta = DIETARY_META[l] ?? {
          short: l.slice(0, 2).toUpperCase(),
          color: 'bg-gray-100 text-gray-700',
        }
        return (
          <span key={l} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${meta.color}`}>
            {meta.short}
          </span>
        )
      })}
    </div>
  )
}

function MenuItemCard({
  item,
  onClick,
}: {
  item: MockMenuItem
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm active:bg-gray-50 transition-colors"
    >
      <p className="text-sm font-medium text-gray-900 leading-snug">{item.name}</p>
      <DietaryPills labels={item.dietaryLabels} />
    </button>
  )
}

function MenuSection({
  name,
  items,
  onItemClick,
}: {
  name: string
  items: MockMenuItem[]
  onItemClick: (item: MockMenuItem) => void
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">
        {name}
      </h3>
      {items.map((item) => (
        <MenuItemCard key={item.name} item={item} onClick={() => onItemClick(item)} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Item Detail Modal (bottom sheet)
// ---------------------------------------------------------------------------

function ItemModal({
  item,
  sectionName,
  hallName,
  onClose,
}: {
  item: MockMenuItem
  sectionName: string
  hallName: string
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md bg-white rounded-t-2xl shadow-xl pb-safe"
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Close button */}
        <div className="flex items-start justify-between px-5 pt-3 pb-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{item.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {sectionName} · {hallName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 -mt-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-8 space-y-4">
          {/* Dietary labels */}
          <div>
            <div className="h-px bg-gray-100 mb-3" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Dietary
            </p>
            {item.dietaryLabels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {item.dietaryLabels.map((l) => {
                  const meta = DIETARY_META[l] ?? { short: l.toUpperCase(), color: 'bg-gray-100 text-gray-700' }
                  const fullName =
                    l === 'vegan'       ? 'Vegan'
                    : l === 'vegetarian'? 'Vegetarian'
                    : l === 'halal'     ? 'Halal'
                    : l === 'kosher'    ? 'Kosher'
                    : l === 'gluten-free' ? 'Gluten Free'
                    : l.charAt(0).toUpperCase() + l.slice(1)
                  return (
                    <span key={l} className={`text-xs font-semibold px-3 py-1 rounded-full ${meta.color}`}>
                      ✓ {fullName}
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No dietary labels</p>
            )}
          </div>

          {/* Allergens */}
          <div>
            <div className="h-px bg-gray-100 mb-3" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Contains Allergens
            </p>
            {item.allergens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((a) => (
                  <span key={a} className="text-sm text-gray-700">
                    {ALLERGEN_EMOJI[a] ?? '⚠️'}{' '}
                    <span className="capitalize">{a.replace(/-/g, ' ')}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No major allergens</p>
            )}
          </div>

          {/* Carbon footprint */}
          <div>
            <div className="h-px bg-gray-100 mb-3" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Carbon Footprint
            </p>
            {item.carbonFootprint ? (
              <p className={`text-sm font-semibold ${CARBON_META[item.carbonFootprint].color}`}>
                {CARBON_META[item.carbonFootprint].emoji}{' '}
                {CARBON_META[item.carbonFootprint].label}
              </p>
            ) : (
              <p className="text-sm text-gray-400">Not available</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------

export default function HallDetailClient({ hall }: { hall: MockHall }) {
  const defaultPeriod = hall.currentPeriod ?? hall.meals[0]?.period ?? 'Lunch'
  const [activePeriod, setActivePeriod] = useState<MealPeriodName>(defaultPeriod)
  const [selectedItem, setSelectedItem] = useState<{ item: MockMenuItem; section: string } | null>(null)

  const activeMeal = hall.meals.find((m) => m.period === activePeriod) ?? hall.meals[0]

  return (
    <>
      {/* ── Sub-header (sticky below the fixed top bar) ── */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/halls"
              className="text-[#003262] p-1 -ml-1"
              aria-label="Back to Halls"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
              </svg>
            </Link>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">{hall.name}</h2>
              <p className="text-xs text-gray-400">{hall.location}</p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              hall.isOpen ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {hall.isOpen
              ? hall.closesAt
                ? `Open · until ${hall.closesAt}`
                : 'Open'
              : 'Closed'}
          </span>
        </div>

        {/* Meal period tab strip */}
        <div className="flex gap-0 px-4 pb-0">
          {hall.meals.map(({ period }) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                activePeriod === period
                  ? 'text-[#003262]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {period}
              {activePeriod === period && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003262] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu content ── */}
      <div className="px-4 py-5 space-y-6">
        {activeMeal?.sections.map((section) => (
          <MenuSection
            key={section.name}
            name={section.name}
            items={section.items}
            onItemClick={(item) => setSelectedItem({ item, section: section.name })}
          />
        ))}

        {(!activeMeal || activeMeal.sections.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">🍽️</p>
            <p className="font-medium">Menu not yet posted</p>
            <p className="text-sm mt-1">Check back closer to meal time</p>
          </div>
        )}
      </div>

      {/* ── Item modal ── */}
      {selectedItem && (
        <ItemModal
          item={selectedItem.item}
          sectionName={selectedItem.section}
          hallName={hall.name}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}
