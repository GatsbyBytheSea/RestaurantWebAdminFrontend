import axios from 'axios'

const BASE_URL = '/api/v1/admin/orders'

export function getOrders(status, page = 0, size = 10) {
    let url = `${BASE_URL}?page=${page}&size=${size}`
    if (status) {
        url += `&status=${status}`
    }
    return axios.get(url)
}

export function getOrderById(orderId) {
    return axios.get(`${BASE_URL}/${orderId}`)
}

export function getOrderItems(orderId) {
    return axios.get(`${BASE_URL}/${orderId}/items`)
}

export function createOrder(payload) {
    return axios.post(BASE_URL, payload)
}

export function addItemsToOrder(orderId, items) {
    return axios.post(`${BASE_URL}/${orderId}/items`, items)
}

export function closeOrder(orderId, payload) {
    return axios.put(`${BASE_URL}/${orderId}/close`, payload)
}

export function removeOrderItem(orderId, itemId) {
    return axios.delete(`${BASE_URL}/${orderId}/items/${itemId}`)
}

export function getTodayClosedOrders() {
    return axios.get(`/api/v1/admin/orders/closed/today`);
}

export function getTodaySales() {
    return axios.get(`/api/v1/admin/orders/closed/today/sales`);
}

export function getHistoricalClosedOrders(date) {
    return axios.get(`/api/v1/admin/orders/closed/history`, { params: { date } });
}

export function getHistoricalSales(date) {
    return axios.get(`/api/v1/admin/orders/closed/history/sales`, { params: { date } });
}