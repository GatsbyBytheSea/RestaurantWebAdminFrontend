import axios from 'axios'

// 获取所有菜品
export function getAllDishes() {
    return axios.get('/api/v1/admin/dishes')
}

// 新建菜品
export function createDish(data) {
    return axios.post('/api/v1/admin/dishes', data)
}

// 更新菜品
export function updateDish(id, data) {
    return axios.put(`/api/v1/admin/dishes/${id}`, data)
}

// 删除菜品
export function deleteDish(id) {
    return axios.delete(`/api/v1/admin/dishes/${id}`)
}

// 上传图片
export function uploadDishImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post('/api/v1/admin/dishes/uploadImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}
