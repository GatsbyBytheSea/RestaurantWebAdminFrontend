import axios from 'axios'

// POST /api/v1/admin/auth/login
export function adminLogin(username, password) {
    return axios.post('/api/v1/admin/auth/login', { username, password })
}
