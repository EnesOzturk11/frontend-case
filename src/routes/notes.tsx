import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NotesCardContent } from '#/components/NotesCard'
import type { NotesCardData } from '#/components/NotesCard'

export const Route = createFileRoute('/notes')({
  component: RouteComponent,
})

const DEMO_NOTES: NotesCardData[] = [
  {
    authorName: 'Aidan Thorne',
    authorAvatar: 'https://i.pravatar.cc/150?img=8',
    coordinates: [39.9334, 32.8597],
    location: 'Ankara Citadel',
    timestamp: '2026-04-18T10:24:00Z',
    note: 'Unusual activity near the east gate. Two individuals lingered for over 20 minutes before departing on foot heading north.',
    mentionedPeople: ['Sara Voss', 'Elias Vance'],
  },
  {
    authorName: 'Elias Vance',
    authorAvatar: 'https://i.pravatar.cc/150?img=30',
    coordinates: [39.925, 32.866],
    location: 'Ankara Metro Hub',
    timestamp: '2026-04-18T09:10:00Z',
    note: 'Package exchange observed at platform 3. Contact departed southbound, suspect boarded the same train one stop later.',
    mentionedPeople: ['Unknown contact'],
  },
  {
    authorName: 'Sara Voss',
    authorAvatar: 'https://i.pravatar.cc/150?img=47',
    coordinates: [39.94, 32.852],
    location: 'Kizilay Control Point',
    timestamp: '2026-04-18T08:45:00Z',
    note: 'Documents reviewed at outdoor table, northeast corner. Both subjects appeared to be cross-referencing printed maps.',
    mentionedPeople: ['Elias Vance'],
  },
]

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
        {DEMO_NOTES.map((note) => (
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