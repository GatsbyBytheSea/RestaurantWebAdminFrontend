import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Button, message, Space, Form } from 'antd'
import { getOrderById, getOrderItems, addItemsToOrder, removeOrderItem, closeOrder } from '../api/ordersAPi.js'
import { getAllDishes } from '../api/dishesAPi.js'
import CloseOrderModal from '../components/order/CloseOrderModal'
import AddDishModal from '../components/order/AddDishModal'
import OrderItemsPanel from "../components/order/OrderItemsPanel.jsx";
import AddDishPanel from "../components/order/AddDishPanel.jsx";

export default function OrderDetail() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [orderItems, setOrderItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [allDishes, setAllDishes] = useState([])
    const [currentDish, setCurrentDish] = useState(null)
    const [addItemModalVisible, setAddItemModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [closeModalVisible, setCloseModalVisible] = useState(false) //

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const res = await getOrderById(orderId)
            setOrder(res.data)
        } catch (e) {
            message.error('Failed to retrieve order details')
        } finally {
            setLoading(false)
        }
    }

    const fetchOrderItems = async () => {
        try {
            setLoading(true)
            const res = await getOrderItems(orderId)
            setOrderItems(res.data)
        } catch (e) {
            message.error('Failed to retrieve order details')
        } finally {
            setLoading(false)
        }
    }

    const fetchDishes = async () => {
        try {
            const res = await getAllDishes()
            setAllDishes(res.data)
        } catch (e) {
            message.error('Failed to retrieve dishes')
        }
    }

    useEffect(() => {
        fetchOrder()
        fetchOrderItems()
        fetchDishes()
    }, [orderId])

    const handleDishClick = (dish) => {
        setCurrentDish(dish)
        setAddItemModalVisible(true)
    }
    const onAddItemFinish = async (values) => {
        try {
            await addItemsToOrder(orderId, [{
                dishId: currentDish.id,
                quantity: values.quantity
            }])
            message.success('Item added successfully')
            setAddItemModalVisible(false)
            form.resetFields()
            fetchOrder()
            fetchOrderItems()
        } catch (e) {
            message.error(e.response?.data?.error || 'Failed to add item')
        }
    }
    const handleRemoveItem = async (itemId) => {
        try {
            await removeOrderItem(orderId, itemId)
            message.success('Deleted successfully')
            fetchOrder()
            fetchOrderItems()
        } catch (e) {
            message.error(e.response?.data?.error || 'Deletion failed')
        }
    }
    const handleClickCloseOrder = () => {
        setCloseModalVisible(true)
    }
    const handleConfirmClose = async () => {
        try {
            await closeOrder(orderId, {})
            message.success(`Order ${orderId} closed successfully`)
            setCloseModalVisible(false)
            navigate('/orders')
        } catch (e) {
            message.error(e.response?.data?.error || 'Failed to close order')
        }
    }

    const categories = ['Appetizer','MainCourse','StapleFood','Dessert','Beverages']
    const dishesByCategory = categories.map(cat => ({
        category: cat,
        dishes: allDishes.filter(d => d.category === cat)
    }))

    const totalAmount = order?.totalAmount || 0
    const tableName = order?.table?.tableName || ''

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#001529', borderBottom: '1px solid #ddd', padding: '16px' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Button type="default" onClick={() => navigate('/orders')}>
                        Back to order list
                    </Button>
                    <h2 style={{ margin: 0, color: '#fff' }}>Order details</h2>
                </Space>
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Row style={{ height: '100%', margin: 0 }} gutter={0}>
                    <Col
                        span={16}
                        style={{
                            borderRight: '1px solid #ddd',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}
                    >
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <AddDishPanel
                                dishesByCategory={dishesByCategory}
                                onDishClick={handleDishClick}
                            />
                        </div>
                    </Col>

                    <Col
                        span={8}
                        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                        <div style={{
                            borderBottom: '1px solid #ddd',
                            padding: '16px',
                            background: '#fff'
                        }}>
                            <h3 style={{ margin: 0 }}>Table: {tableName || 'Not specified'}</h3>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                            <OrderItemsPanel
                                orderItems={orderItems}
                                loading={loading}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>

                        <div style={{
                            borderTop: '1px solid #ddd',
                            padding: '16px',
                            background: '#fff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0 }}>Total amount: € {totalAmount}</h3>
                            <Button type="primary" onClick={handleClickCloseOrder}>
                                Checkout
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>

            <AddDishModal
                open={addItemModalVisible}
                onCancel={() => setAddItemModalVisible(false)}
                onFinish={onAddItemFinish}
                currentDish={currentDish}
                form={form}
            />

            <CloseOrderModal
                open={closeModalVisible}
                onCancel={() => setCloseModalVisible(false)}
                onConfirm={handleConfirmClose}
                order={order}
            />
        </div>
    )
}