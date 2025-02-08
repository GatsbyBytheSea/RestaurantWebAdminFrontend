import axios from 'axios'

// 获取所有预订
export function getAllReservations() {
    return axios.get('/api/v1/admin/reservations')
}

// 根据id查询
export function getReservationById(id) {
    return axios.get(`/api/v1/admin/reservations/${id}`)
}

// 根据phone查询
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

// 取消预订
export function cancelReservation(id) {
    return axios.delete(`/api/v1/admin/reservations/${id}`)
}

// 查询今日订单
export function getTodayReservations() {
    return axios.get('/api/v1/admin/reservations/today')
}

// 确认预订
export function confirmReservation(id, tableId) {
    return axios.put(`/api/v1/admin/reservations/${id}/confirm`, { tableId })
}