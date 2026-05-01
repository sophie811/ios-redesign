import { Icon } from '../../Icon.jsx'

export function Profile({ projects }) {
  const active = projects.filter(p => p.status === 'active').length
  const progress = projects.filter(p =>
    p.status === 'processing' || p.status === 'pro-pending' || p.status === 'draft',
  ).length
  const totalViews = projects
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.views || 0), 0)

  return (
    <div className="screen has-nav">
      <div className="screen-header">
        <div />
      </div>

      <div className="profile-hero">
        <div className="avatar">SB</div>
        <h2>Sophie Brenner</h2>
        <div className="email">sophie@spacesapp.com</div>
      </div>

      <div className="stat-row">
        <div className="stat-box">
          <div className="num">{active}</div>
          <div className="lbl">Live Tours</div>
        </div>
        <div className="stat-box">
          <div className="num">{progress}</div>
          <div className="lbl">In Progress</div>
        </div>
        <div className="stat-box">
          <div className="num">{totalViews.toLocaleString()}</div>
          <div className="lbl">Total Views</div>
        </div>
      </div>

      <div className="menu-list">
        <button><span className="mi"><Icon name="user" size={18} /></span> Account settings<Icon name="chevron" size={16} className="arrow-ic" /></button>
        <button><span className="mi"><Icon name="card" size={18} /></span> Billing & plans<Icon name="chevron" size={16} className="arrow-ic" /></button>
        <button><span className="mi"><Icon name="bell" size={18} /></span> Notifications<Icon name="chevron" size={16} className="arrow-ic" /></button>
        <button><span className="mi"><Icon name="help" size={18} /></span> Help & support<Icon name="chevron" size={16} className="arrow-ic" /></button>
        <button><span className="mi"><Icon name="logout" size={18} /></span> Sign out<Icon name="chevron" size={16} className="arrow-ic" /></button>
      </div>
    </div>
  )
}
