import axios from 'axios'

// 获取所有桌子
export function getAllTables() {
    return axios.get('/api/v1/admin/tables')
}

// 更新桌子状态
export function updateTableStatus(id, status) {
    return axios.put(`/api/v1/admin/tables/${id}/status`, { status })
}

// 增加桌子
export function addTable(data) {
    return axios.post('/api/v1/admin/tables', data)
}

// 删除桌子
export function deleteTable(id) {
    return axios.delete(`/api/v1/admin/tables/${id}`)
}

// 更新桌子信息
export function updateTable(id, data) {
    return axios.put(`/api/v1/admin/tables/${id}`, data)
}

export function getAvailableTables() {
    return axios.get('/api/v1/admin/tables/available')
}
