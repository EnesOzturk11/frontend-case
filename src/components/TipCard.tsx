import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'

export type TipCardData = {
  submissionDate: string
  timestamp: string
  location: string
  coordinates: [number, number]
  suspectName: string
  tip: string
  confidence: 'low' | 'medium' | 'high'
  reporterName: string
}

function formatCoords([lat, lng]: [number, number]) {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`
}

function formatTimestamp(ts: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(ts))
  } catch {
    return ts
  }
}

const confidenceConfig = {
  low: { label: 'Low', className: 'bg-amber-100 text-amber-700 ring-amber-300' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700 ring-blue-300' },
  high: { label: 'High', className: 'bg-emerald-100 text-emerald-700 ring-emerald-300' },
}

export function TipCardContent({ checkin }: Readonly<{ checkin: TipCardData }>) {
  const { submissionDate, timestamp, location, coordinates, suspectName, tip, confidence, reporterName } = checkin
  const conf = confidenceConfig[confidence]

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-(--surface) text-(--sea-ink) ring-1 ring-(--chip-line)">
      {/* Header — suspect name + confidence badge */}
      <div className="flex items-start justify-between gap-3 border-b border-(--line) px-4 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-(--sea-ink-soft)">Suspect</p>
          <p className="truncate font-bold leading-snug text-(--sea-ink)">{suspectName}</p>
          <p className="mt-0.5 text-xs text-(--sea-ink-soft)">Reported by {reporterName}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${conf.className}`}
        >
          {conf.label} confidence
        </span>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* Location */}
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined mt-0.5 text-[16px] text-(--lagoon)">
            location_on
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-(--sea-ink-soft)">Location</p>
            <p className="text-sm font-medium text-(--sea-ink)">{location}</p>
            <p className="mt-0.5 font-mono text-[11px] tracking-tight text-(--lagoon)">
              {formatCoords(coordinates)}
            </p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined mt-0.5 text-[16px] text-(--lagoon)">
            schedule
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-(--sea-ink-soft)">Occurred at</p>
            <p className="text-sm font-medium text-(--sea-ink)">{formatTimestamp(timestamp)}</p>
            <p className="mt-0.5 text-[11px] text-(--sea-ink-soft)">
              Submitted {formatTimestamp(submissionDate)}
            </p>
          </div>
        </div>

        {/* Tip */}
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined mt-0.5 text-[16px] text-(--lagoon)">
            chat_bubble
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-(--sea-ink-soft)">Tip</p>
            <p className="mt-0.5 text-sm leading-relaxed text-(--sea-ink-soft)">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Map pin button ─────────────────────────────────────────────────────────

function PinButton({ label }: Readonly<{ label: string }>) {
  return (
    <button
      type="button"
      aria-label={`View tip about ${label}`}
      className="group relative flex h-9 w-9 cursor-pointer items-end justify-center focus:outline-none"
    >
      <span className="absolute top-0 flex h-7 w-7 items-center justify-center rounded-full bg-(--lagoon) shadow-lg shadow-(--lagoon)/40 ring-2 ring-(--foam) transition-transform duration-150 group-hover:-translate-y-1 group-focus:-translate-y-1">
        <span className="material-symbols-outlined text-[15px] text-(--foam)">sticky_note_2</span>
      </span>
      <span className="h-2 w-0.5 rounded-b-full bg-(--lagoon) opacity-80" />
    </button>
  )
}

// ─── Standalone popover-pin (non-map usage) ─────────────────────────────────

export function TipPopoverCard({
  checkin,
  trigger,
}: Readonly<{
  checkin: TipCardData
  trigger?: React.ReactNode
}>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? <PinButton label={checkin.suspectName} />}
      </PopoverTrigger>

      <PopoverContent
        align="center"
        sideOffset={10}
        className="w-72 border-0 p-0 shadow-2xl shadow-black/40"
      >
        <TipCardContent checkin={checkin} />
      </PopoverContent>
    </Popover>
  )
}