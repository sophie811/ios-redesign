import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppV2 from './v2/App.jsx'
import AppV3 from './v3/App.jsx'
import './styles.css'

function Showcase() {
  const [variation, setVariation] = useState(1)
  return (
    <div className="stage">
      <div className="variation-switcher">
        {[1, 2, 3].map(n => (
          <button
            key={n}
            className={variation === n ? 'active' : ''}
            onClick={() => setVariation(n)}
          >
            Variation {n}
          </button>
        ))}
      </div>
      {variation === 1 && <AppV2 />}
      {variation === 2 && <App />}
      {variation === 3 && <AppV3 />}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Showcase />
  </React.StrictMode>,
)
