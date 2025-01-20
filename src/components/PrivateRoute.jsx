import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

export default function PrivateRoute({ children }) {
    const [loggedIn, setLoggedIn] = useState(null)

    useEffect(() => {
        // 调用后端检查登录接口
        // 需要 withCredentials:true
        axios.get('/api/v1/admin/auth/status', { withCredentials: true })
            .then(res => {
                // 如果成功，就认为 loggedIn
                setLoggedIn(true)
            })
            .catch(err => {
                // 如果返回401/403，则表示未登录
                setLoggedIn(false)
            })
    }, [])

    if (loggedIn === null) {
        // 正在检查中，可显示加载中
        return <div>检查登录状态...</div>
    }
    if (!loggedIn) {
        return <Navigate to="/login" replace />
    }
    return children
}
