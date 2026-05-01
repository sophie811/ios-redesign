import { useState, useMemo } from 'react'
import { NewProjectSheet } from './screens/NewProjectSheet.jsx'
import { BookProForm } from './screens/BookProForm.jsx'
import { DIYDetailsForm } from './screens/DIYDetailsForm.jsx'
import { ScanTutorial } from './screens/ScanTutorial.jsx'
import { PanoTutorial } from './screens/PanoTutorial.jsx'
import { UploadHub } from './screens/UploadHub.jsx'
import { ProcessingDetail } from './screens/ProcessingDetail.jsx'
import { TourDetail } from './screens/TourDetail.jsx'
import { Profile } from './screens/Profile.jsx'
import { DashboardPage } from './screens/DashboardPage.jsx'
import { Notifications } from './screens/Notifications.jsx'
import { BottomNav } from './screens/BottomNav.jsx'
import { initialProjects } from './data.js'

export default function App() {
  const [route, setRoute] = useState({ name: 'home' })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [projects, setProjects] = useState(initialProjects)
  const [folders, setFolders] = useState([
    { id: 'f1', name: 'Residential' },
    { id: 'f2', name: 'Commercial' },
  ])

  const go = (name, params = {}) => setRoute({ name, ...params })
  const openSheet = () => setSheetOpen(true)
  const closeSheet = () => setSheetOpen(false)

  const updateProject = (id, patch) => {
    setProjects(p => p.map(x => (x.id === id ? { ...x, ...patch } : x)))
  }
  const addProject = (project) => {
    setProjects(p => [project, ...p])
  }

  const current = useMemo(
    () => projects.find(p => p.id === route.id),
    [projects, route.id],
  )

  return (
    <div className="phone-wrap">
    <div className="phone">
        <div className="notch" />
        <div className="statusbar">
          <span>9:41</span>
          <span className="right">
            <Icon name="signal" /> <Icon name="wifi" /> <Icon name="battery" />
          </span>
        </div>

        {route.name === 'home' && (
          <DashboardPage
            projects={projects}
            folders={folders}
            onNotifications={() => go('notifications')}
            onNew={openSheet}
            onAddFolder={(name) => {
              setFolders(f => [...f, { id: 'f' + Date.now(), name }])
            }}
            onDeleteFolder={(id) => {
              setFolders(f => f.filter(x => x.id !== id))
              setProjects(p => p.map(x => x.folder === id ? { ...x, folder: null } : x))
            }}
            onRenameFolder={(id, name) => {
              setFolders(f => f.map(x => x.id === id ? { ...x, name } : x))
            }}
            onAssignFolder={(projectId, folderId) => {
              setProjects(p => p.map(x =>
                x.id === projectId ? { ...x, folder: x.folder === folderId ? null : folderId } : x
              ))
            }}
            onOpen={(id) => {
              const p = projects.find(x => x.id === id)
              if (!p) return
              if (p.status === 'processing' || p.status === 'pro-pending' || p.status === 'draft') {
                updateProject(id, { lastActiveAt: Date.now() })
              }
              if (p.status === 'processing' || p.status === 'pro-pending') go('processing', { id, from: 'home' })
              else if (p.status === 'draft') go('hub', { id, from: 'home' })
              else go('tour', { id, from: 'home' })
            }}
          />
        )}

        {route.name === 'profile' && (
          <Profile projects={projects} />
        )}

        {route.name === 'notifications' && (
          <Notifications onBack={() => go('home')} />
        )}

        {route.name === 'hub' && current && (
          <UploadHub
            project={current}
            onBack={() => go(route.from || 'home')}
            onUpdate={(patch) => updateProject(current.id, { ...patch, lastActiveAt: Date.now() })}
            onStartScan={() => go('scanTutorial', { id: current.id, from: 'hub' })}
            onStartPano={() => go('panoTutorial', { id: current.id, from: 'hub' })}
            onSubmit={() => {
              updateProject(current.id, { status: 'processing', submittedAt: Date.now(), lastActiveAt: Date.now() })
              go('processing', { id: current.id, from: route.from })
            }}
          />
        )}

        {route.name === 'scanTutorial' && current && (
          <ScanTutorial
            onClose={() => go('hub', { id: current.id, from: 'home' })}
            onComplete={() => {
              const newSteps = { ...(current.steps || {}), scan: 'complete' }
              const doneCount = Object.values(newSteps).filter(v => v === 'complete').length
              const total = Object.keys(newSteps).length
              updateProject(current.id, { steps: newSteps, progress: Math.round((doneCount / total) * 100), lastActiveAt: Date.now() })
              go('hub', { id: current.id, from: 'home' })
            }}
          />
        )}

        {route.name === 'panoTutorial' && current && (
          <PanoTutorial
            skipTutorial={!!(current.panoTutorialSeen || (current.panoImages && current.panoImages.length > 0))}
            existingPanos={current.panoImages || []}
            onClose={() => {
              if (!current.panoTutorialSeen) updateProject(current.id, { panoTutorialSeen: true })
              go('hub', { id: current.id, from: 'home' })
            }}
            onComplete={(panoImages) => {
              const list = Array.isArray(panoImages) ? panoImages : []
              const newSteps = { ...(current.steps || {}), pano: 'complete' }
              const doneCount = Object.values(newSteps).filter(v => v === 'complete').length
              const total = Object.keys(newSteps).length
              updateProject(current.id, {
                steps: newSteps,
                panoImages: list,
                panoCount: list.length,
                panoTutorialSeen: true,
                progress: Math.round((doneCount / total) * 100),
                lastActiveAt: Date.now(),
              })
              go('hub', { id: current.id, from: 'home' })
            }}
          />
        )}

        {route.name === 'bookPro' && (
          <BookProForm
            onBack={() => go('home')}
            onSubmit={(data) => {
              const id = 'p' + Date.now()
              addProject({
                id,
                name: data.address.split(',')[0] || 'New Property',
                address: data.address,
                status: 'pro-pending',
                type: 'pro',
                size: data.size,
                scheduledDate: data.date,
                progress: 10,
                lastActiveAt: Date.now(),
              })
              go('processing', { id })
            }}
          />
        )}

        {route.name === 'diyDetails' && (
          <DIYDetailsForm
            onBack={() => go('home')}
            onSubmit={(data) => {
              const id = 'p' + Date.now()
              addProject({
                id,
                name: data.name,
                address: data.address,
                status: 'draft',
                type: 'diy',
                progress: 0,
                steps: { scan: 'idle', pano: 'idle' },
                lastActiveAt: Date.now(),
              })
              go('hub', { id, from: 'home' })
            }}
          />
        )}

        {route.name === 'processing' && current && (
          <ProcessingDetail
            project={current}
            onBack={() => go(route.from || 'home')}
            onCancel={(id) => {
              setProjects(p => p.filter(x => x.id !== id))
              go(route.from || 'home')
            }}
          />
        )}

        {route.name === 'tour' && current && (
          <TourDetail
            project={current}
            onBack={() => go(route.from || 'home')}
            onRename={(id, name) => updateProject(id, { name })}
            onDelete={(id) => {
              setProjects(p => p.filter(x => x.id !== id))
              go(route.from || 'home')
            }}
          />
        )}

        {(route.name === 'home' || route.name === 'notifications' || route.name === 'profile') && (
          <BottomNav
            tab={route.name}
            onChange={(t) => go(t)}
          />
        )}

        {sheetOpen && (
          <NewProjectSheet
            onClose={closeSheet}
            onDIY={() => {
              closeSheet()
              go('diyDetails')
            }}
            onPro={() => {
              closeSheet()
              go('bookPro')
            }}
          />
        )}
    </div>
    </div>
  )
}

function Icon({ name }) {
  const common = { width: 16, height: 11, fill: 'currentColor' }
  if (name === 'signal') return <svg viewBox="0 0 18 12" {...common}><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="5" y="5" width="3" height="7" rx="0.5"/><rect x="10" y="2" width="3" height="10" rx="0.5"/><rect x="15" y="0" width="3" height="12" rx="0.5"/></svg>
  if (name === 'wifi') return <svg viewBox="0 0 16 12" {...common}><path d="M8 10.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM4.5 7.3A5 5 0 0 1 8 5.8a5 5 0 0 1 3.5 1.5l1.3-1.4A7 7 0 0 0 8 3.9a7 7 0 0 0-4.8 2zm-3-3A9.2 9.2 0 0 1 8 1.7a9.2 9.2 0 0 1 6.5 2.6L16 2.9A11.2 11.2 0 0 0 8 0 11.2 11.2 0 0 0 0 2.9z"/></svg>
  return <svg viewBox="0 0 25 12" width="24" height="11" fill="currentColor"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2" y="2" width="18" height="8" rx="1.5"/><rect x="22.5" y="4" width="1.5" height="4" rx="0.5"/></svg>
}
