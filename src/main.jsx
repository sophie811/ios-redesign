import React from 'react'
import ReactDOM from 'react-dom/client'
import AppV3 from './v3/App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="stage">
      <AppV3 />
    </div>
  </React.StrictMode>,
)
