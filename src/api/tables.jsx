import axios from 'axios'

// GET /api/v1/admin/tables
export function getAllTables() {
    return axios.get('/api/v1/admin/tables')
}

// PUT /api/v1/admin/tables/{id}/status
export function updateTableStatus(id, status) {
    return axios.put(`/api/v1/admin/tables/${id}/status`, { status })
}

// POST /api/v1/admin/tables
export function addTable(data) {
    return axios.post('/api/v1/admin/tables', data)
}

// DELETE /api/v1/admin/tables/{id}
export function deleteTable(id) {
    return axios.delete(`/api/v1/admin/tables/${id}`)
}

// PUT /api/v1/admin/tables/{id}
export function updateTable(id, data) {
    return axios.put(`/api/v1/admin/tables/${id}`, data)
}
