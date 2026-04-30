import { useState } from 'react'
import { Icon } from '../Icon.jsx'

export function ProcessingDetail({ project, onBack, onCancel }) {
  const [confirmCancel, setConfirmCancel] = useState(false)
  const isPro = project.status === 'pro-pending'
  const steps = isPro
    ? [
        { key: 'booked', title: 'Booking confirmed', desc: 'Payment authorized. Scanner assigned.', time: 'Today, 9:24 AM', state: 'done' },
        { key: 'scheduled', title: 'Scan scheduled', desc: `Arrives ${project.scheduledDate}`, time: 'Upcoming', state: 'active' },
        { key: 'received', title: 'Scan received', desc: 'Your 3D tour is ready to review.', time: '—', state: 'idle' },
      ]
    : [
        { key: 'uploaded', title: 'Uploaded', desc: 'Scan and panos received.', time: 'Yesterday, 6:12 PM', state: 'done' },
        { key: 'processing', title: 'Processing', desc: 'Building your 3D model.', time: 'In progress', state: 'active' },
        { key: 'received', title: 'Scan received', desc: 'Your 3D tour is ready to review.', time: '—', state: 'idle' },
      ]

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Back">‹</button>
        <div />
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div className="detail-name" style={{ padding: 0 }}>{project.name}</div>
        <div className="detail-addr" style={{ padding: '2px 0 0' }}>{project.address}</div>
        <div className="detail-status-line">
          {isPro ? 'Awaiting scheduled scan' : 'Processing your scan'}
          <span>{isPro ? `Scheduled ${project.scheduledDate}` : 'ETA 1–2 days'}</span>
        </div>
      </div>

      <div className="timeline">
        <h3>Status</h3>
        {steps.map(s => (
          <div key={s.key} className={`tl-step ${s.state}`}>
            <div className="node">
              {s.state === 'done' && <Icon name="check" size={14} />}
            </div>
            <div className="body">
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <div className="time">{s.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="detail-actions">
        <button className="btn-ghost">
          {isPro ? 'Message scanner' : 'View upload details'}
        </button>
        <button className="btn-ghost" style={{ color: '#c53030' }} onClick={() => setConfirmCancel(true)}>
          {isPro ? 'Cancel booking' : 'Cancel scan'}
        </button>
      </div>

      {confirmCancel && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmCancel(false)} />
          <div className="modal-dialog">
            <div className="modal-body" style={{ paddingTop: 20 }}>
              Are you sure you want to {isPro ? 'cancel this booking' : 'cancel this scan'}? This will delete <strong>"{project.name}"</strong>.
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setConfirmCancel(false)}>Keep</button>
              <button className="modal-btn delete" onClick={() => {
                onCancel(project.id)
                setConfirmCancel(false)
              }}>{isPro ? 'Cancel booking' : 'Cancel scan'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
