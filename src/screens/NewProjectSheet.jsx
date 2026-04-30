import { Icon } from '../Icon.jsx'

export function NewProjectSheet({ onClose, onDIY, onPro }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="handle" />
        <button className="sheet-close" onClick={onClose}>
          <Icon name="close" size={18} />
        </button>
        <h2>Start a new project</h2>

        <div className="choices">
          <button className="choice" onClick={onDIY}>
            <div className="ico"><Icon name="phone" size={22} /></div>
            <h3>DIY Scan</h3>
          </button>

          <button className="choice pro" onClick={onPro}>
            <div className="ico"><Icon name="userCheck" size={26} /></div>
            <h3>Book a Pro</h3>
          </button>
        </div>

      </div>
    </>
  )
}
