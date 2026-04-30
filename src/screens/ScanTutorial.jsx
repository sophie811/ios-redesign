import { useState } from 'react'
import { Icon } from '../Icon.jsx'

const PAGES = [
  {
    image: '/scan-tut-1.png',
    tips: [
      'Slowly walk around the space',
      'Point the device to remove the black overlay',
      'Keep the floor baseline in view at all times',
    ],
  },
  {
    image: '/scan-tut-2.png',
    tips: [
      'Maintain 6 feet from walls and other bare areas',
      'Avoid people and moving objects',
      'Avoid capturing your feet',
      'Make sure the area has adequate lighting',
    ],
  },
  {
    image: '/scan-tut-3.png',
    tips: [],
  },
]

export function ScanTutorial({ onClose, onComplete }) {
  const [page, setPage] = useState(0)
  const total = PAGES.length
  const isLast = page === total - 1

  const { image, tips } = PAGES[page]

  if (isLast) {
    return (
      <div
        className="screen scan-tutorial scan-tut-fullscreen"
        style={{ backgroundImage: `url(${image})` }}
      >
        <button className="scan-tut-close" onClick={onComplete} aria-label="Close">
          <Icon name="close" size={14} />
        </button>
        <div className="scan-tut-minimap">
          <img src="/scan-minimap.png" alt="" />
        </div>
        <div className="scan-tut-finish">
          <button className="scan-tut-btn primary" onClick={onComplete}>Finish scan</button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen scan-tutorial">
      <div className="scan-tut-preview">
        <img src={image} alt="" className="scan-tut-photo" />
        <button className="scan-tut-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={14} />
        </button>
      </div>

      <div className="scan-tut-panel">
        <div className="scan-tut-step">
          <span>{page + 1} of {total - 1}</span>
          <div className="scan-tut-progress">
            <div style={{ width: `${((page + 1) / (total - 1)) * 100}%` }} />
          </div>
        </div>

        <h2 className="scan-tut-title">How to scan</h2>
        <ul className="scan-tut-list">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>

        <div className="scan-tut-actions">
          <button className="scan-tut-btn ghost" onClick={onClose}>Skip</button>
          <button
            className="scan-tut-btn primary"
            onClick={() => setPage(page + 1)}
          >
            {page === total - 2 ? 'Start' : 'Next step'}
          </button>
        </div>
      </div>
    </div>
  )
}
