// src/api/auth.js
import axios from 'axios'

/**
 * 使用Form-Data或x-www-form-urlencoded方式提交
 * 以便与Spring Security formLogin()兼容
 */
export async function adminLogin(username, password) {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    return axios.post('/api/v1/admin/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        // 关键：允许跨域带cookie（session）
        withCredentials: true
    })
}
