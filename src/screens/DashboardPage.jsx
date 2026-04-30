import { useState, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../Icon.jsx'

const LONG_PRESS_MS = 500
const MOVE_CANCEL_PX = 8

const SORT_OPTIONS = [
  { key: 'date', label: 'Date Created' },
  { key: 'name', label: 'Name' },
  { key: 'views', label: 'Most Viewed' },
]

export function DashboardPage({ projects, folders, onAddFolder, onDeleteFolder, onRenameFolder, onAssignFolder, onOpen }) {
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [menuFor, setMenuFor] = useState(null)
  const [folderMenuFor, setFolderMenuFor] = useState(null)
  const [renaming, setRenaming] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [showSort, setShowSort] = useState(false)
  const [search, setSearch] = useState('')
  const [openFolder, setOpenFolder] = useState(null)
  const [drag, setDrag] = useState(null)
  const pressRef = useRef(null)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)
  const listRef = useRef(null)

  useEffect(() => { dragRef.current = drag }, [drag])

  useEffect(() => {
    const onMove = (e) => {
      const point = e.touches ? e.touches[0] : e
      const x = point.clientX
      const y = point.clientY
      if (dragRef.current) {
        e.preventDefault()
        const el = document.elementFromPoint(x, y)
        const folderEl = el && el.closest('[data-folder-id]')
        const backEl = el && el.closest('[data-drop-back]')
        const hoverFolderId = folderEl ? folderEl.getAttribute('data-folder-id') : null
        const hoverBack = !!backEl
        setDrag(d => d && { ...d, x, y, hoverFolderId, hoverBack })
      } else if (pressRef.current) {
        const dx = Math.abs(x - pressRef.current.startX)
        const dy = Math.abs(y - pressRef.current.startY)
        if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) {
          clearTimeout(pressRef.current.timer)
          pressRef.current = null
        }
      }
    }
    const onUp = () => {
      if (pressRef.current) {
        clearTimeout(pressRef.current.timer)
        pressRef.current = null
      }
      if (dragRef.current) {
        const d = dragRef.current
        if (d.hoverBack && d.currentFolderId) {
          onAssignFolder(d.projectId, d.currentFolderId)
        } else if (d.hoverFolderId) {
          onAssignFolder(d.projectId, d.hoverFolderId)
        }
        suppressClickRef.current = true
        setDrag(null)
        setTimeout(() => { suppressClickRef.current = false }, 0)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [onAssignFolder])

  const startPress = (e, project, currentFolderId = null) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const startX = e.clientX
    const startY = e.clientY
    const rect = e.currentTarget.getBoundingClientRect()
    const timer = setTimeout(() => {
      pressRef.current = null
      setDrag({
        projectId: project.id,
        project,
        currentFolderId,
        x: startX,
        y: startY,
        offsetX: startX - rect.left,
        offsetY: startY - rect.top,
        width: rect.width,
        hoverFolderId: null,
        hoverBack: false,
      })
      if (navigator.vibrate) navigator.vibrate(30)
    }, LONG_PRESS_MS)
    pressRef.current = { timer, startX, startY }
  }

  const handleCreate = () => {
    const name = newFolderName.trim()
    if (name && !folders.find(f => f.name === name)) onAddFolder(name)
    setNewFolderName('')
    setShowNewFolder(false)
  }

  const liveProjects = projects.filter(p => p.status === 'active')
  const unfoldered = liveProjects.filter(p => !p.folder)
  const sorted = useMemo(() => {
    const list = [...unfoldered]
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'views') list.sort((a, b) => (b.views || 0) - (a.views || 0))
    return list
  }, [unfoldered, sortBy])

  const sortedFolders = useMemo(() => {
    const list = [...folders]
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'views') {
      list.sort((a, b) => {
        const aViews = liveProjects.filter(p => p.folder === a.id).reduce((s, p) => s + (p.views || 0), 0)
        const bViews = liveProjects.filter(p => p.folder === b.id).reduce((s, p) => s + (p.views || 0), 0)
        return bViews - aViews
      })
    }
    return list
  }, [folders, sortBy, liveProjects])

  const currentFolder = folders.find(f => f.id === openFolder)
  const folderProjects = openFolder ? liveProjects.filter(p => p.folder === openFolder) : []

  if (openFolder && currentFolder) {
    const backActive = drag && drag.hoverBack
    return (
      <div className="screen has-nav">
        <div className="screen-header">
          <button
            className={`back-btn ${backActive ? 'drop-hover' : ''}`}
            data-drop-back="1"
            aria-label="Back"
            onClick={() => { if (!drag) setOpenFolder(null) }}
          >‹</button>
          <div />
        </div>

        <div style={{ padding: '0 18px 16px' }}>
          <div className="title" style={{ fontSize: 22 }}>{currentFolder.name}</div>
          <div className="sub" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
            {folderProjects.length} tour{folderProjects.length !== 1 ? 's' : ''}
          </div>
        </div>

        {folderProjects.length === 0 ? (
          <div className="empty">
            <div className="ico"><Icon name="folder" size={26} /></div>
            <p><strong style={{ color: 'var(--ink)' }}>Empty folder</strong></p>
          </div>
        ) : (
          <div className="dash-list">
            {folderProjects.map(p => {
              const isDragging = drag && drag.projectId === p.id
              return (
              <div
                key={p.id}
                className={`dash-row tour-row ${menuFor === p.id ? 'menu-open' : ''} ${isDragging ? 'dragging-source' : ''}`}
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => { if (suppressClickRef.current) return; onOpen && onOpen(p.id) }}
                onPointerDown={(e) => startPress(e, p, openFolder)}
              >
                <div className={`dash-thumb ${p.thumb || 'img1'}`}>
                  {p.photo && <img className="thumb-img" src={p.photo} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
                </div>
                <div className="dash-info">
                  <div className="dash-name">{p.name}</div>
                  <div className="dash-addr">{p.address}</div>
                </div>
                <button className="more-btn" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === p.id ? null : p.id) }}>
                  <Icon name="more" size={16} />
                </button>

                {menuFor === p.id && (
                  <div className="folder-action-menu" onClick={e => e.stopPropagation()}>
                    <button className="folder-action-item" onClick={() => { onAssignFolder(p.id, openFolder); setMenuFor(null) }}>
                      <Icon name="close" size={14} /> Remove from {currentFolder.name}
                    </button>
                    {folders.filter(f => f.id !== openFolder).length > 0 && (
                      <div className="folder-action-title">Move to</div>
                    )}
                    {folders.filter(f => f.id !== openFolder).map(f => (
                      <button
                        key={f.id}
                        className="folder-action-item"
                        onClick={() => { onAssignFolder(p.id, f.id); setMenuFor(null) }}
                      >
                        <Icon name="folder" size={14} /> {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              )
            })}
          </div>
        )}

        {menuFor && (
          <div className="sheet-backdrop" onClick={() => setMenuFor(null)} style={{ zIndex: 35, background: 'transparent', backdropFilter: 'none' }} />
        )}

        {drag && createPortal(
          <div
            className="drag-ghost"
            style={{
              left: drag.x - drag.offsetX,
              top: drag.y - drag.offsetY,
              width: drag.width,
            }}
          >
            <div className={`dash-thumb ${drag.project.thumb || 'img1'}`}>
              {drag.project.photo && <img className="thumb-img" src={drag.project.photo} alt="" />}
            </div>
            <div className="dash-info">
              <div className="dash-name">{drag.project.name}</div>
              <div className="dash-addr">{drag.project.address}</div>
            </div>
          </div>,
          document.body,
        )}
      </div>
    )
  }

  const q = search.toLowerCase()
  const filteredFolders = q ? sortedFolders.filter(f => f.name.toLowerCase().includes(q)) : sortedFolders
  const filteredTours = q ? sorted.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)) : sorted

  return (
    <div className="screen has-nav">
      <div className="screen-header">
        <div className="title">Dashboard</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button className="sort-toggle" onClick={() => setShowSort(!showSort)}>
              <Icon name="arrowDown" size={12} />
              {SORT_OPTIONS.find(o => o.key === sortBy)?.label}
            </button>
            {showSort && (
              <div className="folder-action-menu" style={{ width: 180 }} onClick={e => e.stopPropagation()}>
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.key}
                    className={`folder-action-item ${sortBy === o.key ? 'active-sort' : ''}`}
                    onClick={() => { setSortBy(o.key); setShowSort(false) }}
                  >
                    {sortBy === o.key && <Icon name="check" size={12} />}
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="icon-btn" aria-label="New folder" onClick={() => setShowNewFolder(true)}>
            <Icon name="folderPlus" size={18} />
          </button>
        </div>
      </div>

      <div className="search-bar-wrap">
        <div className="search-bar">
          <Icon name="search" size={15} />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="search-clear" onClick={() => setSearch('')} style={{ visibility: search ? 'visible' : 'hidden' }}>
            <Icon name="close" size={10} />
          </button>
        </div>
      </div>

      <div className="dash-list" ref={listRef}>
        {filteredFolders.map(f => {
          const count = liveProjects.filter(p => p.folder === f.id).length
          const isHover = drag && drag.hoverFolderId === f.id
          return (
            <div
              key={f.id}
              data-folder-id={f.id}
              className={`dash-row ${folderMenuFor === f.id ? 'menu-open' : ''} ${isHover ? 'drop-hover' : ''}`}
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => { if (!drag) setOpenFolder(f.id) }}
            >
              <div className="folder-ico-sm">
                <Icon name="folder" size={20} />
              </div>
              <div className="dash-info">
                <div className="dash-name">{f.name}</div>
                <div className="dash-addr">{count} tour{count !== 1 ? 's' : ''}</div>
              </div>
              <button className="more-btn" onClick={(e) => { e.stopPropagation(); setFolderMenuFor(folderMenuFor === f.id ? null : f.id) }}>
                <Icon name="more" size={16} />
              </button>

              {folderMenuFor === f.id && (
                <div className="folder-action-menu" onClick={e => e.stopPropagation()}>
                  <button className="folder-action-item" onClick={() => {
                    setFolderMenuFor(null)
                    setRenameValue(f.name)
                    setRenaming(f.id)
                  }}>
                    <Icon name="edit" size={14} /> Rename
                  </button>
                  <button className="folder-action-item danger" onClick={() => {
                    setFolderMenuFor(null)
                    setConfirmDelete(f.id)
                  }}>
                    <Icon name="trash" size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {filteredTours.map(p => {
          const isDragging = drag && drag.projectId === p.id
          return (
          <div
            key={p.id}
            className={`dash-row tour-row ${menuFor === p.id ? 'menu-open' : ''} ${isDragging ? 'dragging-source' : ''}`}
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => { if (suppressClickRef.current) return; onOpen && onOpen(p.id) }}
            onPointerDown={(e) => startPress(e, p)}
          >
            <div className={`dash-thumb ${p.thumb || 'img1'}`}>
              {p.photo && <img className="thumb-img" src={p.photo} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
            </div>
            <div className="dash-info">
              <div className="dash-name">{p.name}</div>
              <div className="dash-addr">{p.address}</div>
            </div>
            <button className="more-btn" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === p.id ? null : p.id) }}>
              <Icon name="more" size={16} />
            </button>

            {menuFor === p.id && (
              <div className="folder-action-menu" onClick={e => e.stopPropagation()}>
                {p.folder && (
                  <button className="folder-action-item" onClick={() => { onAssignFolder(p.id, p.folder); setMenuFor(null) }}>
                    <Icon name="close" size={14} /> Remove from {folders.find(ff => ff.id === p.folder)?.name || 'folder'}
                  </button>
                )}
                {folders.filter(f => f.id !== p.folder).length > 0 && (
                  <div className="folder-action-title">Move to</div>
                )}
                {folders.filter(f => f.id !== p.folder).map(f => (
                  <button
                    key={f.id}
                    className="folder-action-item"
                    onClick={() => { onAssignFolder(p.id, f.id); setMenuFor(null) }}
                  >
                    <Icon name="folder" size={14} /> {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          )
        })}
      </div>

      {drag && createPortal(
        <div
          className="drag-ghost"
          style={{
            left: drag.x - drag.offsetX,
            top: drag.y - drag.offsetY,
            width: drag.width,
          }}
        >
          <div className={`dash-thumb ${drag.project.thumb || 'img1'}`}>
            {drag.project.photo && <img className="thumb-img" src={drag.project.photo} alt="" />}
          </div>
          <div className="dash-info">
            <div className="dash-name">{drag.project.name}</div>
            <div className="dash-addr">{drag.project.address}</div>
          </div>
        </div>,
        document.body,
      )}

      {(menuFor || folderMenuFor || showSort) && (
        <div className="sheet-backdrop" onClick={() => { setMenuFor(null); setFolderMenuFor(null); setShowSort(false) }} style={{ zIndex: 35, background: 'transparent', backdropFilter: 'none' }} />
      )}

      {renaming && (
        <>
          <div className="modal-backdrop" onClick={() => setRenaming(null)} />
          <div className="modal-dialog">
            <div className="modal-content">
              <h2>Rename Folder</h2>
              <div className="field">
                <label>Folder name</label>
                <input
                  type="text"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && renameValue.trim()) {
                      onRenameFolder(renaming, renameValue.trim())
                      setRenaming(null)
                    }
                  }}
                  autoFocus
                />
              </div>
              <button
                className="btn-primary"
                disabled={!renameValue.trim()}
                onClick={() => {
                  onRenameFolder(renaming, renameValue.trim())
                  setRenaming(null)
                }}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {showNewFolder && (
        <>
          <div className="modal-backdrop" onClick={() => setShowNewFolder(false)} />
          <div className="modal-dialog">
            <div className="modal-content">
              <h2>New Folder</h2>
              <p className="lede">Organize your tours into folders.</p>
              <div className="field">
                <label>Folder name</label>
                <input
                  type="text"
                  placeholder="e.g. Luxury, Downtown, Q2 Listings"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>
              <button
                className="btn-primary"
                disabled={!newFolderName.trim()}
                onClick={handleCreate}
              >
                Create folder
              </button>
            </div>
          </div>
        </>
      )}

      {confirmDelete && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDelete(null)} />
          <div className="modal-dialog">
            <div className="modal-body" style={{ paddingTop: 20 }}>
              Are you sure you want to delete the folder <strong>"{folders.find(f => f.id === confirmDelete)?.name}"</strong>?
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="modal-btn delete" onClick={() => {
                onDeleteFolder(confirmDelete)
                setConfirmDelete(null)
              }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
