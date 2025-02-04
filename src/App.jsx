import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import AdminLayout from './components/AdminLayout'
import Reservations from './pages/Reservations'
import Tables from './pages/Tables'
import Dashboard from './pages/Dashboard'
import DishManagement from "./pages/DishManagement.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import HistoryOrdersPage from "./pages/HistoryOrdersPage.jsx";
import TableLayoutEditor from "./pages/TableLayoutEditor.jsx";

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
                    <Route path="tables/edit-layout" element={<TableLayoutEditor />} />
                    <Route path="dishes" element={<DishManagement />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/history" element={<HistoryOrdersPage />} />
                    <Route path="orders/detail/:orderId" element={<OrderDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
