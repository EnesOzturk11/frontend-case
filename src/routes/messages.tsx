import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MessageCardContent } from '#/components/MessageCard'
import type { MessageCardData } from '#/components/MessageCard'

export const Route = createFileRoute('/messages')({
  loader: async () => {
    const res = await fetch(
      'https://api.jotform.com/form/261065765723966/submissions?apikey=ad39735f1449a6dc28d60e0921352665',
    )
    const json = await res.json()
    const messages: MessageCardData[] = (json.content ?? []).map(
      (submission: {
        answers: Record<string, { name: string; answer?: string }>
      }) => {
        const byName = (name: string) =>
          Object.values(submission.answers).find((a) => a.name === name)
            ?.answer ?? ''

        const senderName = byName('senderName')
        const rawCoords = byName('coordinates')
        const [lat, lng] = rawCoords.split(',').map(Number)
        const urgencyRaw = byName('urgency') as MessageCardData['urgency']

        return {
          senderName,
          senderInitials: senderName
            .split(' ')
            .map((w: string) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
          recipientName: byName('recipientName'),
          coordinates: [lat, lng] as [number, number],
          location: byName('location'),
          timestamp: byName('timestamp'),
          text: byName('text'),
          urgency: ['low', 'medium', 'high'].includes(urgencyRaw ?? '')
            ? urgencyRaw
            : undefined,
        } satisfies MessageCardData
      },
    )
    return { messages }
  },
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
      <span class="material-symbols-outlined" style="font-size:15px;color:var(--foam,#131b2e)">chat</span>
    </div>
    <div style="width:2px;height:8px;background:var(--lagoon,#7bd0ff);border-radius:0 0 2px 2px;opacity:.85"></div>
  </div>`,
  className: '',
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -42],
})

function RouteComponent() {
  const { messages } = Route.useLoaderData()

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
        {messages.map((message) => (
          <Marker
            key={`${message.senderName}-${message.timestamp}`}
            position={message.coordinates}
            icon={pinIcon}
          >
            <Popup
              minWidth={288}
              maxWidth={288}
              className="checkin-popup"
            >
              <MessageCardContent checkin={message} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  )
}