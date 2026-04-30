import { Icon } from '../Icon.jsx'

export function BottomNav({ tab, onChange }) {
  return (
    <div className="bottom-nav">
      <button
        className={tab === 'home' ? 'active' : ''}
        onClick={() => onChange('home')}
      >
        <Icon name="home" size={22} className="nav-ico" />
        Home
      </button>
      <button
        className={tab === 'dashboard' ? 'active' : ''}
        onClick={() => onChange('dashboard')}
      >
        <Icon name="grid" size={22} className="nav-ico" />
        Dashboard
      </button>
      <button
        className={tab === 'profile' ? 'active' : ''}
        onClick={() => onChange('profile')}
      >
        <Icon name="user" size={22} className="nav-ico" />
        Profile
      </button>
    </div>
  )
}
