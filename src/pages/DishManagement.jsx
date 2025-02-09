import React, { useEffect, useState } from 'react'
import {Button, Card, message} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
    getAllDishes,
    createDish,
    updateDish,
    deleteDish,
} from '../api/dishesAPi.js'

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
            message.error('Failed to retrieve dish list')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDishes()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return
        try {
            await deleteDish(id)
            message.success('Deleted successfully')
            fetchDishes()
        } catch (err) {
            message.error('Deletion failed')
        }
    }

    const handleEdit = (dish) => {
        setEditModal({ visible: true, record: dish })
    }

    const handleAddFinish = async (values) => {
        try {
            await createDish(values)
            message.success('Added successfully')
            setAddVisible(false)
            fetchDishes()
        } catch (err) {
            message.error('Addition failed')
            throw err
        }
    }

    const handleEditFinish = async (values) => {
        if (!editModal.record) return
        const id = editModal.record.id
        try {
            await updateDish(id, values)
            message.success('Updated successfully')
            setEditModal({ visible: false, record: null })
            fetchDishes()
        } catch (err) {
            message.error('Update failed')
            throw err
        }
    }

    return (
        <div style={{ margin: '8px' }}>
            <Card title={'Menu Management'} loading={loading}>
                <Button type="primary" onClick={() => setAddVisible(true)}>
                    <PlusOutlined /> Add Dish
                </Button>

                <DishVisualization
                    dishes={dishes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Card>

            <AddDishModal
                visible={addVisible}
                onCancel={() => setAddVisible(false)}
                onFinish={handleAddFinish}
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
