import React, { useEffect, useState } from 'react'
import { Table, Button, message, Input, Space, Select, Tag } from 'antd'
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
    createReservation,
} from '../api/reservations.js'

import CreateReservationModal from '../components/reservation/CreateReservationModal'
import EditReservationModal from '../components/reservation/EditReservationModal'

export default function Reservations() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState(null)

    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [editRecord, setEditRecord] = useState(null)

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

    const fetchTodayReservations = async () => {
        setLoading(true)
        try {
            const res = await getTodayReservations()
            setData(res.data)
        } catch (err) {
            message.error('获取今日订单失败')
        }
        setLoading(false)
    }

    // 默认页面加载时拉取当天预订
    useEffect(() => {
        fetchTodayReservations()
    }, [])

    // 状态渲染
    const renderStatus = (status) => {
        let color = 'blue'
        if (status === 'CONFIRMED') color = 'green'
        if (status === 'CANCELLED') color = 'red'
        return <Tag color={color}>{status}</Tag>
    }

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: '顾客姓名', dataIndex: 'customerName' },
        { title: '电话', dataIndex: 'customerPhone' },
        { title: '用餐人数', dataIndex: 'numberOfGuests' },
        {
            title: '餐桌',
            dataIndex: 'tableName',
            render: (text) => text || '未分配',
        },
        {
            title: '预订时间',
            dataIndex: 'reservationTime',
            render: (time) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''),
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            defaultSortOrder: 'descend',
            sorter: (a, b) => dayjs(a.updateTime) - dayjs(b.updateTime),
            render: (time) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''),
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status) => renderStatus(status),
        },
        {
            title: '操作',
            render: (record) => (
                <Space>
                    <Button danger onClick={() => handleCancel(record.id)}>取消</Button>
                    <Button color="green" variant="outlined" onClick={() => handleConfirm(record.id)}>确认</Button>
                    <Button color="blue" variant="outlined" onClick={() => openEditModal(record.id)}>编辑</Button>
                </Space>
            ),
        },
    ]

    const openEditModal = async (id) => {
        try {
            setLoading(true)
            const res = await getReservationById(id)
            const r = res.data
            setEditRecord(r)
            setEditModalVisible(true)
        } catch (err) {
            message.error('获取预订详情失败')
        }
        setLoading(false)
    }

    const openCreateModal = () => {
        setCreateModalVisible(true)
    }

    // 取消预订
    const handleCancel = async (id) => {
        if (!window.confirm('确定要取消此预订吗？')) return
        try {
            await cancelReservation(id)
            message.success('取消成功')
            await fetchTodayReservations()
        } catch (err) {
            message.error('取消失败')
        }
    }

    // 确认预订
    const handleConfirm = async (id) => {
        if (!window.confirm('确认该预订吗？')) return
        try {
            await confirmReservation(id)
            message.success('已确认该预订')
            await fetchTodayReservations()
        } catch (err) {
            message.error('确认失败')
        }
    }

    // 根据状态筛选
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
            await fetchTodayReservations()
        }
    }

    // 按电话查询
    const handleSearchPhone = async () => {
        if (!query) return
        setLoading(true)
        try {
            const res = await getReservationsByPhone(query)
            setData(res.data)
        } catch (err) {
            message.error('搜索失败')
        }
        setLoading(false)
    }

    // 按姓名查询
    const handleSearchName = async () => {
        if (!query) return
        setLoading(true)
        try {
            const res = await getReservationsByName(query)
            setData(res.data)
        } catch (err) {
            message.error('搜索失败')
        }
        setLoading(false)
    }

    const handleCreate = async (payload, form) => {
        setLoading(true)
        try {
            await createReservation(payload)
            message.success('创建预订成功')
            setCreateModalVisible(false)
            form.resetFields()
            await fetchTodayReservations()
        } catch (err) {
            console.error(err)
            message.error('创建预订失败')
        }
        setLoading(false)
    }

    const handleUpdate = async (payload, form) => {
        if (!editRecord) return
        setLoading(true)
        try {
            await updateReservation(editRecord.id, payload)
            message.success('更新成功')
            setEditModalVisible(false)
            setEditRecord(null)
            form.resetFields()
            await fetchTodayReservations()
        } catch (err) {
            console.error(err)
            message.error('更新失败')
        }
        setLoading(false)
    }

    return (
        <div>
            <h2>预订管理</h2>
            <div style={{ display: 'flex', marginBottom: 16, gap: 8 }}>
                <Button type="primary" onClick={openCreateModal}>
                    创建预订
                </Button>
                <Button onClick={fetchTodayReservations}>今日预定</Button>
                <Input
                    placeholder="查询条件"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ width: 200 }}
                />
                <Button onClick={handleSearchPhone}>按电话查询</Button>
                <Button onClick={handleSearchName}>按姓名查询</Button>
                <Select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    style={{ width: 120 }}
                    placeholder="按状态查询"
                    allowClear
                >
                    <Select.Option value="CREATED">被创建</Select.Option>
                    <Select.Option value="CONFIRMED">确认</Select.Option>
                    <Select.Option value="CANCELLED">被取消</Select.Option>
                </Select>
                <Button onClick={fetchAll} style={{ marginLeft: 'auto' }}>
                    查看全部预定
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <CreateReservationModal
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onCreate={handleCreate}
                loading={loading}
            />

            <EditReservationModal
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false)
                    setEditRecord(null)
                }}
                record={editRecord}
                onUpdate={handleUpdate}
                loading={loading}
            />
        </div>
    )
}
