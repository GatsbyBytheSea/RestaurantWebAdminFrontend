// src/pages/DishManagement.jsx
import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
    getAllDishes,
    createDish,
    updateDish,
    deleteDish,
} from '../api/dishes'

import DishVisualization from '../components/dish/DishVisualization'
import AddDishModal from '../components/dish/AddDishModal'
import EditDishModal from '../components/dish/EditDishModal'

export default function DishManagement() {
    const [dishes, setDishes] = useState([])
    const [loading, setLoading] = useState(false)

    const [addVisible, setAddVisible] = useState(false)
    const [editModal, setEditModal] = useState({ visible: false, record: null })

    const fetchDishes = async () => {
        setLoading(true)
        try {
            const res = await getAllDishes()
            setDishes(res.data)
        } catch (err) {
            message.error('获取菜品列表失败')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDishes()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('确认删除此菜品？')) return
        try {
            await deleteDish(id)
            message.success('删除成功')
            fetchDishes()
        } catch (err) {
            message.error('删除失败')
        }
    }

    const handleEdit = (dish) => {
        setEditModal({ visible: true, record: dish })
    }

    const handleAddFinish = async (values) => {
        try {
            await createDish(values)
            message.success('添加成功')
            setAddVisible(false) // 关闭弹窗
            fetchDishes()
        } catch (err) {
            message.error('添加失败')
            throw err
        }
    }

    const handleEditFinish = async (values) => {
        if (!editModal.record) return
        const id = editModal.record.id
        try {
            await updateDish(id, values)
            message.success('更新成功')
            setEditModal({ visible: false, record: null })
            fetchDishes()
        } catch (err) {
            message.error('更新失败')
            throw err
        }
    }

    return (
        <div>
            <h2>菜品管理</h2>

            <Button type="primary" onClick={() => setAddVisible(true)}>
                <PlusOutlined /> 添加菜品
            </Button>

            <DishVisualization
                dishes={dishes}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AddDishModal
                visible={addVisible}
                onCancel={() => setAddVisible(false)}
                onFinish={handleAddFinish}  // 点击提交后执行
            />

            <EditDishModal
                visible={editModal.visible}
                record={editModal.record}
                onCancel={() => setEditModal({ visible: false, record: null })}
                onFinish={handleEditFinish}
            />
        </div>
    )
}
