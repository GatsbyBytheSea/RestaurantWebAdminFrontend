import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reservations from './pages/Reservations'
import Tables from './pages/Tables'
import ReservationDetail from './pages/ReservationDetail'
import AdminLayout from './components/AdminLayout'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Admin layout with sidebar */}
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="reservations" element={<Reservations />} />
                    <Route path="reservations/:id" element={<ReservationDetail />} />
                    <Route path="tables" element={<Tables />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
