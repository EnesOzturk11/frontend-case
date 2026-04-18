import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TipCardContent } from '#/components/TipCard'
import type { TipCardData } from '#/components/TipCard'

export const Route = createFileRoute('/tips')({
  component: RouteComponent,
})

const DEMO_TIPS: TipCardData[] = [
  {
    submissionDate: '2026-04-17T09:15:00Z',
    timestamp: '2026-04-17T02:30:00Z',
    location: 'Kızılay Square, Ankara',
    coordinates: [39.9208, 32.8541],
    suspectName: 'Viktor Kasparov',
    tip: 'Seen exchanging a black briefcase near the fountain at around 2:30 AM. Wore a dark coat and kept looking over his shoulder.',
    confidence: 'high',
    reporterName: 'Anonymous',
  },
  {
    submissionDate: '2026-04-16T18:45:00Z',
    timestamp: '2026-04-16T14:00:00Z',
    location: 'Atatürk Cultural Center',
    coordinates: [39.9334, 32.8597],
    suspectName: 'Unknown Male',
    tip: 'A man matching the description was seen taking photos of the back entrance repeatedly.',
    confidence: 'medium',
    reporterName: 'Security Guard',
  },
  {
    submissionDate: '2026-04-15T22:10:00Z',
    timestamp: '2026-04-15T21:00:00Z',
    location: 'Tunalı Hilmi Street',
    coordinates: [39.9072, 32.8627],
    suspectName: 'Lena Marchetti',
    tip: 'Overheard a phone conversation referencing a pickup location and a time. Voice matched the description from previous reports.',
    confidence: 'low',
    reporterName: 'Café Owner',
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
        {DEMO_TIPS.map((tip) => (
          <Marker
            key={`${tip.suspectName}-${tip.timestamp}`}
            position={tip.coordinates}
            icon={pinIcon}
          >
            <Popup minWidth={288} maxWidth={288} className="checkin-popup">
              <TipCardContent checkin={tip} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  )
}