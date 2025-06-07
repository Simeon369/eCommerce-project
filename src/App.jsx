// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Shop from './shop' // customer view
import Admin from './admin/admin' // admin panel
import React from 'react'
import LogIn from "./auth/login";
import SignUp from "./auth/signup";
import StoreSetup from './auth/storeSetup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/:storeSlug" element={<Shop />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/store-setup" element={<StoreSetup />} />
      </Routes>
    </Router>
  )
}

export default App
