import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

export default function PrivateRoute({ children }) {
    const [loggedIn, setLoggedIn] = useState(null)

    useEffect(() => {
        axios.get('/api/v1/admin/auth/status', { withCredentials: true })
            .then(res => {
                setLoggedIn(true)
            })
            .catch(err => {
                setLoggedIn(false)
            })
    }, [])

    if (loggedIn === null) {
        return <div>Checking login status...</div>
    }
    if (!loggedIn) {
        return <Navigate to="/login" replace />
    }
    return children
}
