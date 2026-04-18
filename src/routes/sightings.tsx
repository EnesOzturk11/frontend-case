import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SightingsCardContent } from '#/components/SightingsCard'
import type { SightingsCardData } from '#/components/SightingsCard'

const API_KEY = 'ad39735f1449a6dc28d60e0921352665'
const FORM_ID = '261065244786967'

async function fetchSightings(): Promise<SightingsCardData[]> {
  const res = await fetch(
    `https://api.jotform.com/form/${FORM_ID}/submissions?apikey=${API_KEY}&limit=100`,
  )
  const data = await res.json()

  return (data.content as Array<{ answers: Record<string, { name: string; answer?: string }> }>)
    .filter((s) => s.answers['6']?.answer)
    .map((s) => {
      const a = s.answers
      const [lat, lng] = (a['6'].answer ?? '0,0').split(',').map(Number)
      return {
        personName: a['2']?.answer ?? 'Unknown',
        seenWith: a['3']?.answer ?? 'Unknown',
        timestamp: a['4']?.answer ?? '',
        location: a['5']?.answer ?? '',
        coordinates: [lat, lng] as [number, number],
        note: a['7']?.answer ?? '',
      }
    })
}

export const Route = createFileRoute('/sightings')({
  loader: fetchSightings,
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
  const sightings = Route.useLoaderData()
  const center: [number, number] =
    sightings.length > 0 ? sightings[0].coordinates : [39.9334, 32.8597]

  return (
    <main className="relative h-[calc(100vh-var(--header-height,57px))] w-full">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {sightings.map((sighting) => (
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