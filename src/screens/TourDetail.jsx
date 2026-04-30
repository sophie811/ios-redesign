import { useState, useRef } from 'react'
import { Icon } from '../Icon.jsx'

const TABS = ['Space', 'Details', 'Add-ons', 'Media', 'Property Report', 'Analytics']

export function TourDetail({ project, onBack, onRename, onDelete }) {
  const [activeTab, setActiveTab] = useState('Space')
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const p = project

  return (
    <div className="screen tour-detail-screen">
      <div className="tour-top-bar">
        <button className="tour-back icon-only" onClick={onBack} aria-label="Back">
          <Icon name="chevronLeft" size={16} />
        </button>
        <div className="tour-top-title">
          <h1 className="tour-title">{p.name}</h1>
          <div className="tour-edit-wrap">
            <button className="tour-edit-btn" onClick={() => setShowMenu(!showMenu)}>
              <Icon name="edit" size={12} />
            </button>
            {showMenu && (
              <div className="folder-action-menu" onClick={e => e.stopPropagation()}>
                <button className="folder-action-item" onClick={() => {
                  setShowMenu(false)
                  setRenameValue(p.name)
                  setRenaming(true)
                }}>
                  <Icon name="edit" size={14} /> Rename
                </button>
                <button className="folder-action-item danger" onClick={() => {
                  setShowMenu(false)
                  setConfirmDelete(true)
                }}>
                  <Icon name="trash" size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="tour-top-actions">
          <button className="tour-action-btn primary">
            <Icon name="share" size={12} /> Share
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="sheet-backdrop" onClick={() => setShowMenu(false)} style={{ zIndex: 35, background: 'transparent', backdropFilter: 'none' }} />
      )}

      {renaming && (
        <>
          <div className="modal-backdrop" onClick={() => setRenaming(false)} />
          <div className="modal-dialog">
            <div className="modal-content">
              <h2>Rename Tour</h2>
              <div className="field">
                <label>Tour name</label>
                <input
                  type="text"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && renameValue.trim()) {
                      onRename(p.id, renameValue.trim())
                      setRenaming(false)
                    }
                  }}
                  autoFocus
                />
              </div>
              <button
                className="btn-primary"
                disabled={!renameValue.trim()}
                onClick={() => {
                  onRename(p.id, renameValue.trim())
                  setRenaming(false)
                }}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {confirmDelete && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDelete(false)} />
          <div className="modal-dialog">
            <div className="modal-body" style={{ paddingTop: 20 }}>
              Are you sure you want to delete <strong>"{p.name}"</strong>?
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="modal-btn delete" onClick={() => {
                onDelete(p.id)
                setConfirmDelete(false)
              }}>Delete</button>
            </div>
          </div>
        </>
      )}

      <div className="tour-tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`tour-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Space' && (
        <div className="tour-viewer">
          <iframe
            className="tour-iframe"
            src="https://stager-a.the3dapp.com/?mode=walk&tour_id=vceVdLMPyekK7XZ4Va4B&floor=1&pano=EGrWsP7fcXtp3CvP4OQ8&yaw=-2.34"
            allow="xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
          />
        </div>
      )}

      {activeTab === 'Details' && (
        <div className="tour-section">
          <div className="tour-detail-row">
            <span className="tour-detail-label">Address</span>
            <span className="tour-detail-value">{p.address}</span>
          </div>
          <div className="tour-detail-row">
            <span className="tour-detail-label">Type</span>
            <span className="tour-detail-value">{p.type === 'pro' ? 'Professional Scan' : 'DIY Scan'}</span>
          </div>
          <div className="tour-detail-row">
            <span className="tour-detail-label">Status</span>
            <span className="tour-detail-value">Live</span>
          </div>
          <div className="tour-detail-row">
            <span className="tour-detail-label">Published</span>
            <span className="tour-detail-value">{p.publishedAt || '—'}</span>
          </div>
        </div>
      )}

      {activeTab === 'Media' && (
        <div className="tour-section">
          <div className="tour-media-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="tour-media-thumb">
                {p.photo && <img src={p.photo} alt="" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="tour-section">
          <div className="tour-stat-row">
            <div className="tour-stat">
              <div className="tour-stat-num">{(p.views || 0).toLocaleString()}</div>
              <div className="tour-stat-label">Views</div>
            </div>
            <div className="tour-stat">
              <div className="tour-stat-num">{p.leads || 0}</div>
              <div className="tour-stat-label">Leads</div>
            </div>
            <div className="tour-stat">
              <div className="tour-stat-num">{Math.round((p.leads || 0) / Math.max(p.views || 1, 1) * 100)}%</div>
              <div className="tour-stat-label">Conv. Rate</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Add-ons' && (
        <div className="tour-section">
          <div className="empty" style={{ padding: '40px 20px' }}>
            <p><strong style={{ color: 'var(--ink)' }}>Add-ons</strong></p>
            <p>Enhance your tour with add-ons.</p>
          </div>
        </div>
      )}

      {activeTab === 'Property Report' && (
        <div className="tour-section">
          <div className="empty" style={{ padding: '40px 20px' }}>
            <p><strong style={{ color: 'var(--ink)' }}>Property report</strong></p>
            <p>Report generation coming soon.</p>
          </div>
        </div>
      )}
    </div>
  )
}
