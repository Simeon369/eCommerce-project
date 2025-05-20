// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Shop from './shop' // customer view
import Admin from './admin' // admin panel
import React from 'react'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
