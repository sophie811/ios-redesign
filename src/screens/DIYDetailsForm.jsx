import { useState } from 'react'

export function DIYDetailsForm({ onBack, onSubmit }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  const valid = name.trim().length > 0 && address.trim().length > 0

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack} aria-label="Back">‹</button>
        <div />
      </div>

      <div style={{ padding: '0 20px 18px' }}>
        <div className="title" style={{ fontSize: 24 }}>New DIY Scan</div>
      </div>

      <div className="form">
        <div className="field">
          <label>Property name</label>
          <input
            type="text"
            placeholder="e.g. Lakeview Loft"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="field">
          <label>Address</label>
          <input
            type="text"
            placeholder="e.g. 1420 Shoreline Dr, Chicago IL"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="submit-bar">
        <button
          className="btn-primary"
          disabled={!valid}
          onClick={() => onSubmit({ name: name.trim(), address: address.trim() })}
        >
          Continue to upload
        </button>
      </div>
    </div>
  )
}
