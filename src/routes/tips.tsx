import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TipCardContent } from '#/components/TipCard'
import type { TipCardData } from '#/components/TipCard'

const FORM_ID = '261065875889981'
const API_KEY = 'ad39735f1449a6dc28d60e0921352665'

async function fetchTips(): Promise<TipCardData[]> {
  const res = await fetch(
    `https://api.jotform.com/form/${FORM_ID}/submissions?apikey=${API_KEY}&limit=100`,
  )
  const json = await res.json()
  const submissions: Array<{ created_at: string; answers: Record<string, { name: string; answer: unknown }> }> =
    json.content ?? []

  return submissions
    .filter((s) => s.answers)
    .map((s) => {
      const a = s.answers
      const coordStr = String(a[4]?.answer ?? '')
      const [lat, lng] = coordStr.split(',').map(Number)
      const confidence = String(a[7]?.answer ?? 'low') as TipCardData['confidence']

      return {
        submissionDate: s.created_at,
        timestamp: String(a[2]?.answer ?? ''),
        location: String(a[3]?.answer ?? ''),
        coordinates: [lat || 39.9334, lng || 32.8597],
        suspectName: String(a[5]?.answer ?? 'Unknown'),
        tip: String(a[6]?.answer ?? ''),
        confidence: ['low', 'medium', 'high'].includes(confidence) ? confidence : 'low',
        reporterName: 'Anonymous',
      }
    })
}

export const Route = createFileRoute('/tips')({
  loader: fetchTips,
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
  const tips = Route.useLoaderData()

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
        {tips.map((tip) => (
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