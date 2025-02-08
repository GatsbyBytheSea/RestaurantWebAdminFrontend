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
            message.error('获取订单详情失败')
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
            message.error('获取订单明细失败')
        } finally {
            setLoading(false)
        }
    }

    const fetchDishes = async () => {
        try {
            const res = await getAllDishes()
            setAllDishes(res.data)
        } catch (e) {
            message.error('获取菜品失败')
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
            message.success('添加菜品成功')
            setAddItemModalVisible(false)
            form.resetFields()
            fetchOrder()
            fetchOrderItems()
        } catch (e) {
            message.error(e.response?.data?.error || '添加菜品失败')
        }
    }
    const handleRemoveItem = async (itemId) => {
        try {
            await removeOrderItem(orderId, itemId)
            message.success('删除成功')
            fetchOrder()
            fetchOrderItems()
        } catch (e) {
            message.error(e.response?.data?.error || '删除失败')
        }
    }
    const handleClickCloseOrder = () => {
        setCloseModalVisible(true)
    }
    const handleConfirmClose = async () => {
        try {
            await closeOrder(orderId, {})
            message.success(`订单 ${orderId} 已结算`)
            setCloseModalVisible(false)
            navigate('/orders')
        } catch (e) {
            message.error(e.response?.data?.error || '结算失败')
        }
    }

    const categories = ['前菜','主菜','主食','酒水饮料','甜点']
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
                        返回订单列表
                    </Button>
                    <h2 style={{ margin: 0, color: '#fff' }}>订单详情</h2>
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
                            <h3 style={{ margin: 0 }}>餐桌：{tableName || '未指定'}</h3>
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
                            <h3 style={{ margin: 0 }}>总金额：€ {totalAmount}</h3>
                            <Button type="primary" onClick={handleClickCloseOrder}>
                                结算
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