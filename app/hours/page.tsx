// Hours page — static placeholder data only (Phase 4.1)

const HOURS_DATA = [
  {
    name: "Café 3",
    emoji: "🍽️",
    isOpen: true,
    schedule: [
      { period: "Breakfast", time: "7:00 AM – 9:30 AM" },
      { period: "Lunch",     time: "11:00 AM – 2:00 PM" },
      { period: "Dinner",    time: "5:00 PM – 8:00 PM" },
    ],
  },
  {
    name: "Crossroads",
    emoji: "🥘",
    isOpen: true,
    schedule: [
      { period: "Breakfast", time: "7:00 AM – 10:00 AM" },
      { period: "Brunch",    time: "10:00 AM – 2:00 PM" },
      { period: "Lunch",     time: "11:00 AM – 2:00 PM" },
      { period: "Dinner",    time: "5:00 PM – 9:00 PM" },
      { period: "Late Night", time: "9:00 PM – 11:00 PM" },
    ],
  },
  {
    name: "Foothill",
    emoji: "🏔️",
    isOpen: false,
    schedule: [
      { period: "Breakfast", time: "7:30 AM – 10:00 AM" },
      { period: "Lunch",     time: "11:00 AM – 1:30 PM" },
      { period: "Dinner",    time: "5:00 PM – 7:30 PM" },
    ],
  },
  {
    name: "Clark Kerr",
    emoji: "🌿",
    isOpen: true,
    schedule: [
      { period: "Breakfast", time: "7:00 AM – 9:30 AM" },
      { period: "Lunch",     time: "11:00 AM – 2:00 PM" },
      { period: "Dinner",    time: "5:00 PM – 8:00 PM" },
    ],
  },
  {
    name: "Golden Bear Café",
    emoji: "☕",
    isOpen: true,
    schedule: [
      { period: "All Day", time: "7:00 AM – 4:00 PM" },
    ],
  },
  {
    name: "The Eateries",
    emoji: "🥪",
    isOpen: true,
    schedule: [
      { period: "All Day", time: "8:00 AM – 3:00 PM" },
    ],
  },
  {
    name: "Browns",
    emoji: "🍕",
    isOpen: false,
    schedule: [
      { period: "Lunch",  time: "11:00 AM – 3:00 PM" },
      { period: "Dinner", time: "5:00 PM – 9:00 PM" },
    ],
  },
];

const PERIOD_COLORS: Record<string, string> = {
  Breakfast:  "bg-amber-50 text-amber-700",
  Brunch:     "bg-orange-50 text-orange-700",
  Lunch:      "bg-green-50 text-green-700",
  Dinner:     "bg-blue-50 text-blue-700",
  "Late Night": "bg-purple-50 text-purple-700",
  "All Day":  "bg-gray-100 text-gray-600",
};

export default function HoursPage() {
  return (
    <div className="px-4 py-5 space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Hours</h2>
        <p className="text-sm text-gray-400 mt-0.5">Today's operating schedule</p>
      </div>

      <div className="space-y-3">
        {HOURS_DATA.map(({ name, emoji, isOpen, schedule }) => (
          <div
            key={name}
            className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${!isOpen ? "opacity-60" : ""}`}
          >
            {/* Hall header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{emoji}</span>
                <span className="font-semibold text-gray-900 text-sm">{name}</span>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  isOpen ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"
                }`}
              >
                {isOpen ? "Open" : "Closed"}
              </span>
            </div>

            {/* Schedule rows */}
            <div className="divide-y divide-gray-50">
              {schedule.map(({ period, time }) => (
                <div key={period} className="flex items-center justify-between px-4 py-2.5">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                      PERIOD_COLORS[period] ?? "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {period}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-gray-400 pt-2">
        Hours may vary on holidays and finals week.
      </p>
    </div>
  );
}
