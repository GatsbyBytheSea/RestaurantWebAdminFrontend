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

// 创建预订
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

// 查询今日订单 (假设后端写了 /api/v1/admin/reservations/today)
export function getTodayReservations() {
    return axios.get('/api/v1/admin/reservations/today')
}

export function confirmReservation(id) {
    // 如果后端实现是 `PUT /api/v1/admin/reservations/{id}/confirm`
    // return axios.put(`/api/v1/admin/reservations/${id}/confirm`)
    // 或者如果你只是 update status=CONFIRMED:
    return axios.put(`/api/v1/admin/reservations/${id}`, { status: 'CONFIRMED' })
}