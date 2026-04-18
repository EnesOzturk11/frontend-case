import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { InfoCardContent } from '#/components/InfoCard'
import type { InfoCardData } from '#/components/InfoCard'

export const Route = createFileRoute('/')({
  loader: async () => {
    const res = await fetch(
      'https://api.jotform.com/form/261065067494966/submissions?apikey=ad39735f1449a6dc28d60e0921352665',
    )
    const json = await res.json()
    const checkins: InfoCardData[] = (json.content ?? []).map(
      (submission: {
        answers: Record<string, { name: string; answer?: string }>
      }) => {
        const byName = (name: string) =>
          Object.values(submission.answers).find((a) => a.name === name)
            ?.answer ?? ''

        const personName = byName('personName')
        const rawCoords = byName('coordinates')
        const [lat, lng] = rawCoords.split(',').map(Number)

        return {
          personName,
          profileInitials: personName
            .split(' ')
            .map((w: string) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
          coordinates: [lat, lng] as [number, number],
          location: byName('location'),
          timestamp: byName('timestamp'),
          notes: byName('note') || undefined,
        } satisfies InfoCardData
      },
    )
    return { checkins }
  },
  component: App,
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
      <span class="material-symbols-outlined" style="font-size:15px;color:var(--foam,#131b2e)">location_on</span>
    </div>
    <div style="width:2px;height:8px;background:var(--lagoon,#7bd0ff);border-radius:0 0 2px 2px;opacity:.85"></div>
  </div>`,
  className: '',
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -42],
})

// Spread markers sharing the same coordinates in a small spiral so all are clickable
function spreadCoordinates(
  checkins: InfoCardData[],
): (InfoCardData & { displayCoords: [number, number] })[] {
  const RADIUS = 0.0003 // ~33m offset per step
  const counts = new Map<string, number>()

  return checkins.map((checkin) => {
    const key = `${checkin.coordinates[0].toFixed(5)},${checkin.coordinates[1].toFixed(5)}`
    const idx = counts.get(key) ?? 0
    counts.set(key, idx + 1)

    if (idx === 0) return { ...checkin, displayCoords: checkin.coordinates }

    const angle = (idx * (2 * Math.PI)) / 8
    const r = RADIUS * Math.ceil(idx / 8)
    return {
      ...checkin,
      displayCoords: [
        checkin.coordinates[0] + r * Math.cos(angle),
        checkin.coordinates[1] + r * Math.sin(angle),
      ] as [number, number],
    }
  })
}

function App() {
  const { checkins } = Route.useLoaderData()
  const spread = spreadCoordinates(checkins)

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
        {spread.map((checkin) => (
          <Marker
            key={`${checkin.personName}-${checkin.coordinates[0]}-${checkin.coordinates[1]}`}
            position={checkin.displayCoords}
            icon={pinIcon}
          >
            <Popup minWidth={288} maxWidth={288} className="checkin-popup">
              <InfoCardContent checkin={checkin} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  )
}