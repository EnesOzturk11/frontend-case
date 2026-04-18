import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SightingsCardContent } from '#/components/SightingsCard'
import type { SightingsCardData } from '#/components/SightingsCard'

export const Route = createFileRoute('/sightings')({
  component: RouteComponent,
})

const DEMO_SIGHTINGS: SightingsCardData[] = [
  {
    personName: 'Aidan Thorne',
    personAvatar: 'https://i.pravatar.cc/150?img=8',
    seenWith: 'Sara Voss',
    coordinates: [39.9334, 32.8597],
    location: 'Ankara Citadel',
    timestamp: '2026-04-18T10:24:00Z',
    note: 'Both individuals observed entering the citadel grounds near the east gate.',
  },
  {
    personName: 'Elias Vance',
    personAvatar: 'https://i.pravatar.cc/150?img=30',
    seenWith: 'Unknown contact',
    coordinates: [39.925, 32.866],
    location: 'Ankara Metro Hub',
    timestamp: '2026-04-18T09:10:00Z',
    note: 'Brief exchange at the central platform. Contact left on the southbound line.',
  },
  {
    personName: 'Sara Voss',
    personAvatar: 'https://i.pravatar.cc/150?img=47',
    seenWith: 'Elias Vance',
    coordinates: [39.94, 32.852],
    location: 'Kizilay Control Point',
    timestamp: '2026-04-18T08:45:00Z',
    note: 'Spotted reviewing documents together at an outdoor café adjacent to the square.',
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
      <span class="material-symbols-outlined" style="font-size:15px;color:var(--foam,#131b2e)">visibility</span>
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
        {DEMO_SIGHTINGS.map((sighting) => (
          <Marker
            key={`${sighting.personName}-${sighting.timestamp}`}
            position={sighting.coordinates}
            icon={pinIcon}
          >
            <Popup minWidth={288} maxWidth={288} className="checkin-popup">
              <SightingsCardContent checkin={sighting} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  )
}