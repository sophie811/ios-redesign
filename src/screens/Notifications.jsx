import { Icon } from '../Icon.jsx'

const NOTIFICATIONS = [
  {
    id: 1,
    icon: 'check',
    title: 'Lakeview Loft is live',
    body: 'Your 3D tour has been published and is ready to share.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 2,
    icon: 'cube',
    title: 'Riverside Studio processing',
    body: 'Your scan is being processed. Estimated 1–2 days remaining.',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: 3,
    icon: 'user',
    title: 'Pro scanner assigned',
    body: 'A certified scanner has been assigned to Elm Street Bungalow.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 5,
    icon: 'globe',
    title: 'Panoramas ready',
    body: 'Panorama stitching for Lakeview Loft is complete.',
    time: '3 days ago',
    unread: false,
  },
  {
    id: 6,
    icon: 'mail',
    title: 'New lead from Zillow',
    body: 'Someone requested a tour of Oak Hill Residence.',
    time: '4 days ago',
    unread: false,
  },
]

function NotifItem({ n }) {
  return (
    <div className={`notif-item ${n.unread ? 'unread' : ''}`}>
      <div className="notif-ico">
        <Icon name={n.icon} size={16} />
      </div>
      <div className="notif-content">
        <div className="notif-title">{n.title}</div>
        <div className="notif-body">{n.body}</div>
        <div className="notif-time">{n.time}</div>
      </div>
      {n.unread && <span className="notif-dot" />}
    </div>
  )
}

export function Notifications({ onBack }) {
  const newNotifs = NOTIFICATIONS.filter(n => n.unread)
  const olderNotifs = NOTIFICATIONS.filter(n => !n.unread)
  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Back">‹</button>
        <div />
      </div>

      <div style={{ padding: '0 18px 14px' }}>
        <div className="title" style={{ fontSize: 22 }}>Notifications</div>
      </div>

      {newNotifs.length > 0 && (
        <>
          <div className="section-head">
            <span className="section-title">New</span>
          </div>
          <div className="notif-list">
            {newNotifs.map(n => (
              <NotifItem key={n.id} n={n} />
            ))}
          </div>
        </>
      )}

      {olderNotifs.length > 0 && (
        <>
          <div className="section-head">
            <span className="section-title">Older</span>
          </div>
          <div className="notif-list">
            {olderNotifs.map(n => (
              <NotifItem key={n.id} n={n} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
