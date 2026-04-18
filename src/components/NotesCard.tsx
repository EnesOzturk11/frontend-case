import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '#/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'

export type NotesCardData = {
  authorName: string
  authorAvatar?: string
  timestamp: string // ISO string or display-ready label
  location: string // human-readable location name
  coordinates: [number, number] // [lat, lng]
  note: string
  mentionedPeople: string[]
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

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// ─── Card content (layout only, no popover shell) ──────────────────────────

export function NotesCardContent({ checkin }: Readonly<{ checkin: NotesCardData }>) {
  const { authorName, authorAvatar, timestamp, location, coordinates, note, mentionedPeople } =
    checkin

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-(--surface) text-(--sea-ink) ring-1 ring-(--chip-line)">
      {/* Header — avatar | author + coords */}
      <div className="flex items-start gap-3 border-b border-(--line) px-4 py-4">
        <Avatar className="h-11 w-11 shrink-0 ring-2 ring-(--lagoon)/30">
          {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
          <AvatarFallback className="bg-(--surface-strong) text-xs font-bold text-(--sea-ink)">
            {getInitials(authorName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-snug text-(--sea-ink)">{authorName}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-(--lagoon)">
            <span className="material-symbols-outlined text-[13px]">my_location</span>
            <span className="font-mono tracking-tight">{formatCoords(coordinates)}</span>
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* Location */}
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined mt-0.5 text-[16px] text-(--lagoon)">
            location_on
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-(--sea-ink-soft)">
              Location
            </p>
            <p className="text-sm font-medium text-(--sea-ink)">{location}</p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined mt-0.5 text-[16px] text-(--lagoon)">
            schedule
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-(--sea-ink-soft)">
              Written at
            </p>
            <p className="text-sm font-medium text-(--sea-ink)">{formatTimestamp(timestamp)}</p>
          </div>
        </div>

        {/* Mentioned people */}
        {mentionedPeople.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined mt-0.5 text-[16px] text-(--lagoon)">
              alternate_email
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-(--sea-ink-soft)">
                Mentions
              </p>
              <p className="text-sm font-medium text-(--sea-ink)">
                {mentionedPeople.join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined mt-0.5 text-[16px] text-(--lagoon)">
            notes
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-(--sea-ink-soft)">Note</p>
            {note ? (
              <p className="mt-0.5 text-sm leading-relaxed text-(--sea-ink-soft)">{note}</p>
            ) : (
              <p className="mt-0.5 text-sm italic text-(--sea-ink-soft)/50">No note attached</p>
            )}
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
      aria-label={`View note by ${label}`}
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

export function NotesCard({
  checkin,
  trigger,
}: Readonly<{
  checkin: NotesCardData
  /** Override the default pin button trigger */
  trigger?: React.ReactNode
}>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? <PinButton label={checkin.authorName} />}
      </PopoverTrigger>

      <PopoverContent
        align="center"
        sideOffset={10}
        className="w-72 border-0 p-0 shadow-2xl shadow-black/40"
      >
        <NotesCardContent checkin={checkin} />
      </PopoverContent>
    </Popover>
  )
}