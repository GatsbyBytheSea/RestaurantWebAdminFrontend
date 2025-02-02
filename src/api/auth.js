import axios from 'axios'

export async function adminLogin(username, password) {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    return axios.post('/api/v1/admin/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    })
}
