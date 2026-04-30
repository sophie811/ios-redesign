import { useMemo, useState } from 'react'
import { Icon } from '../Icon.jsx'

const STEP_META = {
  scan: {
    title: '3D Scan',
    desc: 'Walk through every room with the capture tool.',
    icon: 'logoMark',
    required: true,
  },
  pano: {
    title: 'Panoramas',
    desc: '360° photos of key rooms for quick previews.',
    icon: 'pano',
    required: true,
  },
}

export function UploadHub({ project, onBack, onUpdate, onSubmit, onStartScan, onStartPano }) {
  const steps = project.steps || { scan: 'idle', pano: 'idle' }
  const keys = ['scan', 'pano']
  const [confirmDelete, setConfirmDelete] = useState(null)

  const progress = useMemo(() => {
    const done = keys.filter(k => steps[k] === 'complete').length
    return Math.round((done / keys.length) * 100)
  }, [steps])

  const allDone = keys.every(k => steps[k] === 'complete')

  const bump = (key) => {
    const order = ['idle', 'uploading', 'complete']
    const next = order[(order.indexOf(steps[key]) + 1) % order.length]
    const newSteps = { ...steps, [key]: next }
    const done = keys.filter(k => newSteps[k] === 'complete').length
    onUpdate({ steps: newSteps, progress: Math.round((done / keys.length) * 100) })
  }

  const removePano = (index) => {
    const list = (project.panoImages || []).filter((_, i) => i !== index)
    const newSteps = { ...steps, pano: list.length > 0 ? steps.pano : 'idle' }
    const done = keys.filter(k => newSteps[k] === 'complete').length
    onUpdate({
      panoImages: list,
      panoCount: list.length,
      steps: newSteps,
      progress: Math.round((done / keys.length) * 100),
    })
  }

  return (
    <div className="screen">
      <div className="screen-header centered-title">
        <button className="back-btn" onClick={onBack} aria-label="Back">‹</button>
        <div className="centered-header-title">Upload your scan</div>
        <div />
      </div>

      <div className="hub-subtext">Please complete both steps to continue</div>

      <div className="hub-steps">
        {keys.map(k => {
          const s = steps[k]
          const meta = STEP_META[k]
          const hasPanos = k === 'pano' && project.panoImages && project.panoImages.length > 0
          const onClick = () => {
            if (k === 'scan' && onStartScan) onStartScan()
            else if (k === 'pano' && onStartPano) onStartPano()
            else bump(k)
          }
          return (
            <div
              key={k}
              className={`step-card ${s} ${hasPanos ? 'with-thumbs' : ''}`}
              onClick={onClick}
              role="button"
            >
              <div className="step-card-row">
                <div className="step-ico"><Icon name={meta.icon} size={22} /></div>
                <div className="info">
                  <h4>
                    {meta.title}
                    {k === 'pano' && project.panoCount > 0 && (
                      <span className="step-count"> ({project.panoCount})</span>
                    )}
                  </h4>
                </div>
                <div className="check-circle">
                  {s === 'complete' && <Icon name="check" size={13} />}
                </div>
              </div>
              {hasPanos && (
                <div className="pano-thumbs">
                  {project.panoImages.map((src, i) => (
                    <div key={i} className="pano-thumb">
                      <img src={src} alt="" />
                      <button
                        className="pano-thumb-delete"
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(i) }}
                        aria-label="Delete pano"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="submit-bar">
        <button
          className="btn-primary"
          disabled={!allDone}
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>

      {confirmDelete !== null && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDelete(null)} />
          <div className="modal-dialog">
            <div className="modal-body" style={{ paddingTop: 20 }}>
              Are you sure you want to delete this pano?
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="modal-btn delete" onClick={() => {
                removePano(confirmDelete)
                setConfirmDelete(null)
              }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
