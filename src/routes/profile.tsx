import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../components/ui/avatar'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

const MESSAGES = [
  {
    id: 1,
    name: 'Agent K',
    avatar: 'https://i.pravatar.cc/150?img=11',
    initials: 'AK',
    message: 'Encrypted link sent',
    time: '10m ago',
    highlight: true,
  },
  {
    id: 2,
    name: 'Sara V.',
    avatar: 'https://i.pravatar.cc/150?img=47',
    initials: 'SV',
    message: 'Awaiting visual confirmation.',
    time: '1h ago',
    highlight: false,
  },
  {
    id: 3,
    name: 'Overwatch HQ',
    avatar: null,
    initials: 'O',
    message: 'Proceed to extraction point Alpha.',
    time: '4h ago',
    highlight: false,
  },
]

const TIMELINE = [
  {
    id: 1,
    type: 'Alert Flagged',
    time: 'Today • 14:20',
    accent: 'alert',
    body: 'Observed unusual frequency shift near sector 7. Thorne appeared to be exchanging secure packets with an unknown entity. Recommend increasing surveillance radius.',
    code: null,
  },
  {
    id: 2,
    type: 'Routine Log',
    time: 'Today • 09:15',
    accent: 'routine',
    body: 'Target acquired morning briefing materials. No deviations from standard operating procedure noted. Vitals normal according to passive scan.',
    code: null,
  },
  {
    id: 3,
    type: 'Comms Intercept',
    time: 'Yesterday • 23:40',
    accent: 'routine',
    body: 'Decrypted partial transcript from burner device.',
    code: '> "Extraction delayed. Wait for signal at waypoint Delta."\n> [END TRANSMISSION]',
  },
]

function StatusDot() {
  return (
    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--foam)] bg-[var(--lagoon)]">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--foam)]" />
    </span>
  )
}

function SectionTitle({
  icon,
  children,
}: {
  icon: string
  children: React.ReactNode
}) {
  return (
    <h2 className="flex items-center gap-2 font-bold text-lg text-[var(--sea-ink)]">
      <span className="material-symbols-outlined text-[20px] text-[var(--lagoon)]">
        {icon}
      </span>
      {children}
    </h2>
  )
}

function ProfilePage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      {/* ── Header ── */}
      <header className="relative w-full overflow-hidden bg-[var(--surface)] px-6 py-8 md:px-12 md:py-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--surface)] to-[var(--bg-base)] opacity-60" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Avatar + identity */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <Avatar className="h-20 w-20 ring-4 ring-[var(--lagoon)]/30 md:h-24 md:w-24">
                <AvatarImage
                  src="https://i.pravatar.cc/150?img=8"
                  alt="Aidan Thorne"
                />
                <AvatarFallback className="bg-[var(--surface-strong)] text-[var(--sea-ink)] text-2xl font-bold">
                  AT
                </AvatarFallback>
              </Avatar>
              <StatusDot />
            </div>

            <div>
              <h1 className="display-title text-3xl font-bold tracking-tight text-[var(--sea-ink)] md:text-4xl">
                Aidan Thorne
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-[var(--sea-ink-soft)]">
                  Intelligence Asset
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--sea-ink-soft)]/40" />
                <span className="flex items-center gap-1 rounded-full bg-[var(--surface-strong)] px-3 py-0.5 text-xs uppercase tracking-wider text-[var(--sea-ink-soft)]">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  Active — Last Seen 12 mins ago
                </span>
              </div>
            </div>
          </div>

          {/* Back button */}
          <Button
            variant="outline"
            className="w-full gap-2 border-[var(--line)] bg-[var(--surface-strong)]/60 text-[var(--lagoon)] hover:bg-[var(--surface-strong)] md:w-auto"
            asChild
          >
            <Link to="/">
              <span className="material-symbols-outlined text-[18px]">map</span>
              Back to Map
            </Link>
          </Button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* Latest Sighting */}
            <div className="island-shell group relative overflow-hidden rounded-2xl">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--lagoon)]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
                <SectionTitle icon="visibility">Latest Sighting</SectionTitle>
                <span className="rounded bg-[var(--surface-strong)] px-2 py-1 text-xs uppercase tracking-wider text-[var(--sea-ink-soft)]">
                  12:04 PM
                </span>
              </div>

              <div className="relative p-6">
                {/* map tint overlay */}
                <div
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10 grayscale mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=60')",
                  }}
                />

                <div className="relative z-10 flex flex-col gap-3">
                  <h3 className="display-title text-3xl font-extrabold tracking-tight text-[var(--sea-ink)]">
                    Ankara Citadel
                  </h3>
                  <p className="text-sm font-medium text-[var(--sea-ink-soft)]">
                    Sector 4, Upper Level Concourse
                  </p>

                  <div className="mt-2 border-t border-[var(--line)] pt-4">
                    <p className="mb-3 text-xs uppercase tracking-wider text-[var(--sea-ink-soft)]">
                      Connected Contact Present
                    </p>
                    <div className="flex cursor-pointer items-center gap-3 rounded-xl bg-[var(--surface-strong)] p-3 transition hover:bg-[var(--surface-strong)]/80">
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10 ring-2 ring-[var(--surface)]">
                          <AvatarImage
                            src="https://i.pravatar.cc/150?img=30"
                            alt="Elias Vance"
                          />
                          <AvatarFallback className="bg-[var(--surface)] text-xs text-[var(--sea-ink)]">
                            EV
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[var(--palm)] ring-2 ring-[var(--surface)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[var(--sea-ink)]">
                          Elias Vance
                        </p>
                        <p className="text-xs text-[var(--sea-ink-soft)]">
                          Asset ID: V-992
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-[var(--sea-ink-soft)]">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Comms */}
            <div className="island-shell flex max-h-[440px] flex-col overflow-hidden rounded-2xl">
              <div className="border-b border-[var(--line)] px-6 py-4">
                <SectionTitle icon="chat">Recent Comms</SectionTitle>
              </div>

              <ul className="flex flex-col gap-0.5 overflow-y-auto p-2">
                {MESSAGES.map((msg) => (
                  <li
                    key={msg.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl p-3 transition hover:bg-[var(--surface-strong)]"
                  >
                    <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                      {msg.avatar ? (
                        <AvatarImage src={msg.avatar} alt={msg.name} />
                      ) : null}
                      <AvatarFallback className="bg-[var(--surface-strong)] text-[10px] font-bold text-[var(--sea-ink)]">
                        {msg.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-baseline justify-between gap-2">
                        <span
                          className={`truncate text-sm font-${msg.highlight ? 'bold' : 'medium'} text-[var(--sea-ink)]`}
                        >
                          {msg.name}
                        </span>
                        <span className="shrink-0 text-[10px] text-[var(--sea-ink-soft)]">
                          {msg.time}
                        </span>
                      </div>
                      <p
                        className={`truncate text-sm ${msg.highlight ? 'font-medium text-[var(--lagoon)]' : 'text-[var(--sea-ink-soft)]'}`}
                      >
                        {msg.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right column: Timeline ── */}
          <div className="lg:col-span-8">
            <div className="island-shell flex h-full flex-col rounded-2xl">
              <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4 md:px-8">
                <SectionTitle icon="description">
                  Field Notes &amp; Analysis
                </SectionTitle>
                <Button
                  size="sm"
                  className="gap-1.5 bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] text-[var(--foam)] shadow-lg shadow-[var(--lagoon)]/20 hover:shadow-[var(--lagoon)]/40"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Entry
                </Button>
              </div>

              <div className="flex-1 p-6 md:p-8">
                <div className="relative ml-3 space-y-8 border-l-2 border-[var(--surface-strong)] py-2 md:ml-4">
                  {TIMELINE.map((entry) => (
                    <div key={entry.id} className="group relative pl-8">
                      {/* dot */}
                      <span
                        className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-4 ring-[var(--surface)] ${
                          entry.accent === 'alert'
                            ? 'bg-[var(--palm)]'
                            : 'bg-[var(--sea-ink-soft)]'
                        }`}
                      />

                      <div className="mb-2 flex flex-col gap-0.5">
                        <span
                          className={`island-kicker text-xs ${
                            entry.accent === 'alert'
                              ? 'text-[var(--palm)]'
                              : 'text-[var(--sea-ink-soft)]'
                          }`}
                        >
                          {entry.type}
                        </span>
                        <span className="text-sm text-[var(--sea-ink-soft)]">
                          {entry.time}
                        </span>
                      </div>

                      <div
                        className={`rounded-xl bg-[var(--surface-strong)] p-5 transition group-hover:bg-[var(--surface-strong)]/80 ${
                          entry.accent === 'alert'
                            ? 'border-l-2 border-[var(--palm)]'
                            : ''
                        }`}
                      >
                        <p className="leading-relaxed text-[var(--sea-ink-soft)]">
                          {entry.body}
                        </p>
                        {entry.code && (
                          <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-[var(--line)] bg-[var(--bg-base)] p-4 font-mono text-sm text-[var(--palm)]/80">
                            {entry.code}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}