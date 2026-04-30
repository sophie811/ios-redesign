import { useState } from 'react'

const SIZES = [
  { label: 'Studio', price: 199 },
  { label: '1–2 BR', price: 249 },
  { label: '3–4 BR', price: 349 },
  { label: '5+ BR', price: 499 },
]

export function BookProForm({ onBack, onSubmit }) {
  const [address, setAddress] = useState('')
  const [size, setSize] = useState('1–2 BR')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  const price = SIZES.find(s => s.label === size)?.price || 199
  const valid = address.trim().length > 0 && date && time

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Back">‹</button>
        <div />
      </div>

      <div style={{ padding: '0 20px 18px' }}>
        <div className="title" style={{ fontSize: 24 }}>Book a Pro Scan</div>
        <div className="sub" style={{ fontSize: 13, color: '#8a94a6', marginTop: 2 }}>
          A certified scanner arrives within 48 hours.
        </div>
      </div>

      <div className="form">
        <div className="pricing-note">
          <span>Estimated total</span>
          <span>${price}</span>
        </div>

        <div className="field">
          <label>Property address</label>
          <input
            type="text"
            placeholder="e.g. 123 Main St, Austin TX"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Property size</label>
          <div className="size-pills">
            {SIZES.map(s => (
              <button
                key={s.label}
                className={size === s.label ? 'active' : ''}
                onClick={() => setSize(s.label)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Preferred date & time</label>
          <div className="row-2">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <select value={time} onChange={e => setTime(e.target.value)}>
              <option value="">Select time</option>
              <option>Morning (8–12)</option>
              <option>Afternoon (12–4)</option>
              <option>Evening (4–7)</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Access notes (optional)</label>
          <textarea
            placeholder="Lockbox code, parking, who to contact…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="submit-bar">
        <button
          className="btn-primary"
          disabled={!valid}
          onClick={() => onSubmit({ address, size, date, time, notes })}
        >
          Request scan — ${price}
        </button>
      </div>
    </div>
  )
}
