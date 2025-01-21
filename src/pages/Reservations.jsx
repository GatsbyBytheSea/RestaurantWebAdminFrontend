import React, { useEffect, useState } from 'react'
import { Table, Button, message, Input, Space, Modal, Form, DatePicker, Select, Tag } from 'antd'
import dayjs from 'dayjs'
import {
    getAllReservations,
    getReservationsByPhone,
    getReservationsByName,
    getReservationsByStatus,
    getTodayReservations,
    cancelReservation,
    confirmReservation,
    getReservationById,
    updateReservation,
    createReservation
} from '../api/reservations.js'

export default function Reservations() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')

    const [statusFilter, setStatusFilter] = useState(null)

    // 管理“编辑预订”弹窗
    const [editModal, setEditModal] = useState({ visible: false, record: null })
    const [form] = Form.useForm()

    // 管理“新增预订”弹窗
    const [addModal, setAddModal] = useState(false)
    const [addForm] = Form.useForm()


    // 拉取全部预订列表
    const fetchAll = async () => {
        setLoading(true)
        try {
            const res = await getAllReservations()
            setData(res.data)
        } catch (err) {
            message.error('获取预订列表失败')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchAll()
    }, [])

    // 状态渲染
    const renderStatus = (status) => {
        // “被创建”为蓝色(CREATED)，“确认”为绿色(CONFIRMED)，“被取消”为红色(CANCELLED)
        let color = 'blue'
        if (status === 'CONFIRMED') color = 'green'
        if (status === 'CANCELLED') color = 'red'
        return <Tag color={color}>{status}</Tag>
    }

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: '顾客姓名', dataIndex: 'customerName' },
        { title: '电话', dataIndex: 'customerPhone' },
        {
            title: '餐桌',
            dataIndex: 'tableName',
            // todo: 需要后端在 Reservation 返回 tableName
            render: (text) => text || '未分配'
        },
        {
            title: '预订时间',
            dataIndex: 'reservationTime',
            render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status) => renderStatus(status)
        },
        {
            title: '操作',
            render: (record) => (
                <Space>
                    <Button danger onClick={() => handleCancel(record.id)}>取消</Button>
                    <Button onClick={() => handleConfirm(record.id)}>确认</Button>
                    <Button onClick={() => openEditModal(record.id)}>编辑</Button>
                </Space>
            )
        }
    ]

    const openEditModal = async (id) => {
        try {
            setLoading(true)
            const res = await getReservationById(id)  // 后端拉取该预订详情
            const r = res.data

            form.setFieldsValue({
                customerName: r.customerName,
                customerPhone: r.customerPhone,
                numberOfGuests: r.numberOfGuests,
                reservationTime: dayjs(r.reservationTime),
                status: r.status
            })

            setEditModal({ visible: true, record: r })
        } catch (err) {
            message.error('获取预订详情失败')
        }
        setLoading(false)
    }

    const openAddModal = () => {
        addForm.resetFields()
        setAddModal(true)
    }

    // “查询今日订单”
    const handleTodayOrders = async () => {
        setLoading(true)
        try {
            const res = await getTodayReservations()
            setData(res.data)
        } catch (err) {
            message.error('获取今日订单失败')
        }
        setLoading(false)
    }

    // 状态下拉菜单选择后，进行按状态查询
    const handleStatusChange = async (value) => {
        setStatusFilter(value)
        if (value) {
            setLoading(true)
            try {
                const res = await getReservationsByStatus(value)
                setData(res.data)
            } catch (err) {
                message.error('搜索失败')
            }
            setLoading(false)
        } else {
            fetchAll()
        }
    }

    // 确认预订
    const handleConfirm = async (id) => {
        if (!window.confirm('确认该预订吗？')) return
        try {
            await confirmReservation(id)
            message.success('已确认该预订')
            fetchAll()
        } catch (err) {
            message.error('确认失败')
        }
    }

    const handleAddSave = async (values) => {
        try {
            // 格式化日期
            const payload = {
                ...values,
                reservationTime: values.reservationTime.format('YYYY-MM-DD HH:mm:ss')
            }
            await createReservation(payload)
            message.success('创建预订成功')
            setAddModal(false)
            fetchAll()
        } catch (err) {
            console.error(err)
            message.error('创建预订失败')
        }
    }

    const handleEditSave = async (values) => {
        try {
            const payload = {
                ...values,
                reservationTime: values.reservationTime.format('YYYY-MM-DD HH:mm:ss')
            }
            await updateReservation(editModal.record.id, payload)
            message.success('更新成功')
            setEditModal({ visible: false, record: null })
            fetchAll()
        } catch (err) {
            console.error(err)
            message.error('更新失败')
        }
    }

    const handleCancel = async (id) => {
        if (!window.confirm('确定要取消此预订吗？')) return
        try {
            await cancelReservation(id)
            message.success('取消成功')
            fetchAll()
        } catch (err) {
            message.error('取消失败')
        }
    }

    const handleSearchPhone = async () => {
        if(!query) return
        setLoading(true)
        try {
            const res = await getReservationsByPhone(query)
            setData(res.data)
        } catch (err) {
            message.error('搜索失败')
        }
        setLoading(false)
    }

    const handleSearchName = async () => {
        if(!query) return
        setLoading(true)
        try {
            const res = await getReservationsByName(query)
            setData(res.data)
        } catch (err) {
            message.error('搜索失败')
        }
        setLoading(false)
    }

    return (
        <div>
            <h2>预订管理</h2>

            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={openAddModal} style={{ marginRight: 16 }}>创建预订</Button>
                <Button type="primary" onClick={handleTodayOrders} style={{ marginRight: 16 }}>查询今日订单</Button>

                <Input
                    placeholder="查询条件"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                />
                <Button onClick={handleSearchPhone}>按电话查询</Button>
                <Button onClick={handleSearchName}>按姓名查询</Button>
                <Select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    style={{ width: 120, marginLeft: 8 }}
                    placeholder="按状态查询"
                    allowClear
                >
                    <Select.Option value="CREATED">被创建</Select.Option>
                    <Select.Option value="CONFIRMED">确认</Select.Option>
                    <Select.Option value="CANCELLED">被取消</Select.Option>
                </Select>
                <Button type="link" onClick={fetchAll} style={{ marginLeft: 8 }}>重置</Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title="创建预订"
                open={addModal}
                onCancel={() => setAddModal(false)}
                footer={null}
            >
                <Form layout="vertical" form={addForm} onFinish={handleAddSave}>
                    <Form.Item label="顾客姓名" name="customerName" rules={[{required:true}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="顾客电话" name="customerPhone" rules={[{required:true}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="用餐人数" name="numberOfGuests" rules={[{required:true}]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="预订时间" name="reservationTime" rules={[{required:true}]}>
                        <DatePicker showTime style={{ width:'100%' }}/>
                    </Form.Item>
                    {/* 也可以增加一个隐藏状态字段 defaultValue = 'CREATED' */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="编辑预订"
                open={editModal.visible}
                onCancel={() => setEditModal({ visible: false, record: null })}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditSave}
                >
                    <Form.Item label="顾客姓名" name="customerName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="顾客电话" name="customerPhone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="用餐人数" name="numberOfGuests" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="预订时间" name="reservationTime" rules={[{ required: true }]}>
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="状态" name="status" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}
