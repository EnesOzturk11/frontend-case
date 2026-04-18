import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NotesCardContent } from '#/components/NotesCard'
import type { NotesCardData } from '#/components/NotesCard'

const FORM_ID = '261065509008958'
const API_KEY = 'ad39735f1449a6dc28d60e0921352665'

async function fetchNotes(): Promise<NotesCardData[]> {
  const res = await fetch(
    `https://api.jotform.com/form/${FORM_ID}/submissions?apikey=${API_KEY}&limit=100`,
  )
  const data = await res.json()

  return (data.content ?? [])
    .map((submission: Record<string, unknown>) => {
      const answers = submission.answers as Record<string, { name: string; answer?: string }>

      const get = (name: string) =>
        Object.values(answers).find((a) => a.name === name)?.answer ?? ''

      const rawCoords = get('coordinates')
      const parts = rawCoords.split(',').map(Number)
      const coordinates: [number, number] =
        parts.length === 2 && !parts.some(Number.isNaN)
          ? [parts[0], parts[1]]
          : [39.9334, 32.8597]

      const rawMentioned = get('mentionedPeople')
      const mentionedPeople = rawMentioned
        ? rawMentioned.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []

      return {
        authorName: get('authorName') || 'Unknown',
        timestamp: get('timestamp'),
        location: get('location'),
        coordinates,
        note: get('note'),
        mentionedPeople,
      } satisfies NotesCardData
    })
    .filter((n: NotesCardData) => n.authorName !== 'Unknown' || n.note)
}

export const Route = createFileRoute('/notes')({
  loader: fetchNotes,
  component: RouteComponent,
})

const pinIcon = divIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="
      width:28px;height:28px;border-radius:50%;
      background:var(--lagoon,#7bd0ff);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 14px rgba(123,208,255,.45);
      border:2px solid var(--foam,#131b2e);
    ">
      <span class="material-symbols-outlined" style="font-size:15px;color:var(--foam,#131b2e)">sticky_note_2</span>
    </div>
    <div style="width:2px;height:8px;background:var(--lagoon,#7bd0ff);border-radius:0 0 2px 2px;opacity:.85"></div>
  </div>`,
  className: '',
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -42],
})

function RouteComponent() {
  const notes = Route.useLoaderData()

  return (
    <main className="relative h-[calc(100vh-var(--header-height,57px))] w-full">
      <MapContainer
        center={[39.9334, 32.8597]}
        zoom={13}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {notes.map((note) => (
          <Marker
            key={`${note.authorName}-${note.timestamp}`}
            position={note.coordinates}
            icon={pinIcon}
          >
            <Popup minWidth={288} maxWidth={288} className="checkin-popup">
              <NotesCardContent checkin={note} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  )
}