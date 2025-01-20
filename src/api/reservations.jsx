import axios from 'axios'

// GET /api/v1/admin/reservations
export function getAllReservations() {
    return axios.get('/api/v1/admin/reservations')
}

// GET /api/v1/admin/reservations/{id}
export function getReservationById(id) {
    return axios.get(`/api/v1/admin/reservations/${id}`)
}

// 依据phone查询
export function getReservationsByPhone(phone) {
    return axios.get(`/api/v1/admin/reservations/phone/${phone}`)
}

// 依据姓名查询
export function getReservationsByName(name) {
    return axios.get(`/api/v1/admin/reservations/name/${name}`)
}

// 依据状态查询
export function getReservationsByStatus(status) {
    return axios.get(`/api/v1/admin/reservations/status/${status}`)
}

// 创建预订 - 管理员
export function createReservation(data) {
    return axios.post('/api/v1/admin/reservations', data)
}

// 更新预订
export function updateReservation(id, data) {
    return axios.put(`/api/v1/admin/reservations/${id}`, data)
}

// 取消/删除预订
export function cancelReservation(id) {
    return axios.delete(`/api/v1/admin/reservations/${id}`)
}
