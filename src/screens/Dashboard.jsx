import { Icon } from '../Icon.jsx'

export function Dashboard({ projects, onNotifications, onNew, onOpen }) {
  const inProgress = projects
    .filter(p => p.status === 'processing' || p.status === 'pro-pending' || p.status === 'draft')
    .slice()
    .sort((a, b) => (b.lastActiveAt || 0) - (a.lastActiveAt || 0))
  const active = projects.filter(p => p.status === 'active').slice(0, 5)

  return (
    <div className="screen has-nav">
      <div className="screen-header">
        <img src="/logo.png" alt="The 3D App" className="brand-logo" />
        <button className="icon-btn" aria-label="Notifications" onClick={onNotifications}>
          <Icon name="bell" size={18} />
          <span className="dot-badge" />
        </button>
      </div>

      {inProgress.length > 0 && (
        <>
          <div className="section-head">
            <span className="section-title">In Progress</span>
          </div>
          <div className="h-scroll">
            {inProgress.map(p => (
              <ProgressCard key={p.id} project={p} onClick={() => onOpen(p.id)} />
            ))}
          </div>
        </>
      )}

      <div className="section-head">
        <span className="section-title">Recent Tours</span>
      </div>

      {active.length === 0 ? (
        <div className="empty">
          <div className="ico"><Icon name="plus" size={26} /></div>
          <p><strong style={{ color: 'var(--ink)' }}>No tours yet</strong></p>
          <p>Finished scans will appear here.</p>
        </div>
      ) : (
        <div className="cards">
          {active.map(p => (
            <HeroCard key={p.id} project={p} onClick={() => onOpen(p.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function daysRemaining(project) {
  if (project.status === 'processing' && project.submittedAt) {
    const elapsed = (Date.now() - project.submittedAt) / (1000 * 60 * 60 * 24)
    return Math.max(0, Math.ceil(3 - elapsed))
  }
  if (project.status === 'pro-pending' && project.scheduledDate) {
    const target = new Date(project.scheduledDate).getTime()
    return Math.max(0, Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24)))
  }
  return null
}

function ProgressCard({ project, onClick }) {
  const p = project
  const days = daysRemaining(p)
  return (
    <button className="p-card" onClick={onClick}>
      <div className={`p-thumb ${p.thumb || 'img1'} ${p.status === 'pro-pending' && !p.photo ? 'logo-placeholder' : ''}`}>
        {p.photo ? (
          <img className="thumb-img" src={p.photo} alt="" loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }} />
        ) : p.status === 'pro-pending' && (
          <img className="thumb-logo" src="/logo.png" alt="" />
        )}
        <div className="p-overlay" />
        <div className="p-badge">
          {p.status === 'processing' && 'Processing'}
          {p.status === 'pro-pending' && 'Pro Scheduled'}
          {p.status === 'draft' && 'Draft'}
        </div>
      </div>
      <div className="p-body">
        <div className="p-name">{p.name}</div>
        <div className="p-sub">
          {p.status === 'draft'
            ? `${p.progress || 0}% uploaded`
            : days !== null
              ? `${days} day${days === 1 ? '' : 's'} remaining`
              : 'Awaiting scan'}
        </div>
        <div className="p-bar"><div style={{ width: `${p.progress || 0}%` }} /></div>
      </div>
    </button>
  )
}

function HeroCard({ project, onClick }) {
  const p = project
  return (
    <button className="hero-card" onClick={onClick}>
      <div className={`hero-thumb ${p.thumb || 'img1'}`}>
        {p.photo && (
          <img className="thumb-img" src={p.photo} alt="" loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }} />
        )}
        <div className="hero-gradient" />
        <div className="hero-content">
          <div className="hero-title">{p.name}</div>
          <div className="hero-addr">{p.address}</div>
        </div>
      </div>
    </button>
  )
}
