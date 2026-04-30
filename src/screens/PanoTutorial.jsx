import { useState, useEffect } from 'react'
import { Icon } from '../Icon.jsx'

const PAGES = [
  {
    image: '/pano-tut-1.png',
    tips: [
      <>We recommend you take at least <strong>2 panos</strong> for each room in your floorplan</>,
      'Stand up straight and keep your device elevated at chest height',
      'Slowly pivot on one heel and align each triangle as you rotate clockwise',
    ],
  },
  {
    image: '/pano-tut-2.png',
    tips: [
      'Keep a clear line of sight from one pano point to the next',
      'For smaller rooms take panos in central locations',
      'For larger rooms take panos 6 feet apart for best viewpoints',
      'Avoid people and moving objects',
    ],
  },
  {
    image: '/gallery-4.jpg',
    tips: [],
  },
]

const pickPano = () => `/gallery-${Math.floor(Math.random() * 6) + 1}.jpg`

export function PanoTutorial({ onClose, onComplete, skipTutorial = false, existingPanos = [] }) {
  const total = PAGES.length
  const [page, setPage] = useState(skipTutorial ? total - 1 : 0)
  const [panos, setPanos] = useState(existingPanos)
  const [replayKey, setReplayKey] = useState(0)
  const isLast = page === total - 1

  useEffect(() => {
    if (isLast && panos.length === 0) setPanos([pickPano()])
  }, [isLast, panos.length])

  const { image, tips } = PAGES[page]

  if (isLast) {
    const finalize = () => onComplete(panos.length > 0 ? panos : [pickPano()])
    return (
      <div
        className="screen scan-tutorial scan-tut-fullscreen"
        style={{ backgroundImage: `url(${image})` }}
      >
        <button className="scan-tut-close" onClick={finalize} aria-label="Close">
          <Icon name="close" size={14} />
        </button>
        <div className="pano-tut-guide" key={replayKey}>
          <span className="pano-line" />
          <div className="pano-triangle-wrap">
            <svg className="pano-triangle pano-triangle-outline" viewBox="0 0 80 68" width="80" height="68" aria-hidden="true">
              <polygon points="40,4 76,64 4,64" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <svg className="pano-triangle pano-triangle-filled" viewBox="0 0 80 68" width="80" height="68" aria-hidden="true">
              <polygon points="40,4 76,64 4,64" fill="#000" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
              <path className="pano-triangle-check" d="M28 42 L37 51 L54 34" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="pano-line" />
        </div>
        <div className="pano-tut-actions-bottom" key={`btns-${replayKey}`}>
          <button
            className="scan-tut-btn primary"
            onClick={() => {
              setPanos(p => [...p, pickPano()])
              setReplayKey(k => k + 1)
            }}
          >
            Add another pano
          </button>
          <button className="scan-tut-btn ghost" onClick={finalize}>
            Save and exit
          </button>
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

        <h2 className="scan-tut-title">How to take panos</h2>
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
