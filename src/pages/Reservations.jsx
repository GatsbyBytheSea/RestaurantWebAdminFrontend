import React, { useEffect, useState } from 'react'
import {Table, Button, message, Input, Space, Select, Tag, Modal, Card} from 'antd'
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
import { getAvailableTables} from "../api/tables.js";

import CreateReservationModal from '../components/reservation/CreateReservationModal'
import EditReservationModal from '../components/reservation/EditReservationModal'

export default function Reservations() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState(null)
    const [selectedTableId, setSelectedTableId] = useState(null);

    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [editRecord, setEditRecord] = useState(null)

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
    useEffect(() => {
        fetchTodayReservations()
    }, [])

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
            dataIndex: ['table', 'tableName'],
            render: (text) =>
                text ?
                    <Tag color="green">{text}</Tag> :
                    <Tag color="red">未分配</Tag>,
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

    const handleConfirm = async (id) => {
        try {
            setSelectedTableId(null);
            const tables = await getAvailableTables();
            if (tables.data.length === 0) {
                message.warning('暂无可用餐桌');
                return;
            }

            let selectedId = null;

            Modal.confirm({
                title: '分配餐桌',
                content: (
                    <Select
                        style={{ width: '100%' }}
                        placeholder="选择要分配的餐桌"
                        onChange={(value) => (selectedId = value)}
                    >
                        {tables.data.map(table => (
                            <Select.Option key={table.id} value={table.id}>
                                {table.tableName} (容量: {table.capacity})
                            </Select.Option>
                        ))}
                    </Select>
                ),
                onOk: async () => {
                    if (!selectedId) {
                        message.error('请分配餐桌');
                        return;
                    }
                    try {
                        await confirmReservation(id, selectedId); // 使用局部变量
                        message.success('已确认该预订');
                        await fetchTodayReservations();
                    } catch (err) {
                        message.error('确认失败');
                    }
                }
            });
        } catch (err) {
            message.error('获取可用餐桌失败');
        }
    };


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
        <div style={{ margin: '8px' }}>
            <Card title={'预定管理'}>
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
            </Card>

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
