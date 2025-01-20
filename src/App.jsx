import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import AdminLayout from './components/AdminLayout'
import Reservations from './pages/Reservations'
import Tables from './pages/Tables'
import Dashboard from './pages/Dashboard'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/"
                       element={
                           <PrivateRoute>
                               <AdminLayout />
                           </PrivateRoute>
                       }>
                    <Route index element={<Dashboard />} />
                    <Route path="reservations" element={<Reservations />} />
                    <Route path="tables" element={<Tables />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
