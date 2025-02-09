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
} from '../api/reservationsAPi.js'
import { getAvailableTables} from "../api/tablesAPi.js";

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
            message.error('Failed to retrieve reservation list')
        }
        setLoading(false)
    }

    const fetchTodayReservations = async () => {
        setLoading(true)
        try {
            const res = await getTodayReservations()
            setData(res.data)
        } catch (err) {
            message.error('Failed to retrieve today\'s orders')
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
        { title: 'Customer Name', dataIndex: 'customerName' },
        { title: 'Phone', dataIndex: 'customerPhone' },
        { title: 'Number of guests', dataIndex: 'numberOfGuests' },
        {
            title: 'Table',
            dataIndex: ['table', 'tableName'],
            render: (text) =>
                text ?
                    <Tag color="green">{text}</Tag> :
                    <Tag color="red">Unassigned</Tag>,
        },
        {
            title: 'Reservation Time',
            dataIndex: 'reservationTime',
            render: (time) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''),
        },
        {
            title: 'Update Time',
            dataIndex: 'updateTime',
            defaultSortOrder: 'descend',
            sorter: (a, b) => dayjs(a.updateTime) - dayjs(b.updateTime),
            render: (time) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => renderStatus(status),
        },
        {
            title: 'Actions',
            render: (record) => (
                <Space>
                    <Button danger onClick={() => handleCancel(record.id)}>Cancel</Button>
                    <Button color="green" variant="outlined" onClick={() => handleConfirm(record.id)}>Confirm</Button>
                    <Button color="blue" variant="outlined" onClick={() => openEditModal(record.id)}>Edit</Button>
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
            message.error('Failed to get reservation details')
        }
        setLoading(false)
    }

    const openCreateModal = () => {
        setCreateModalVisible(true)
    }

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return
        try {
            await cancelReservation(id)
            message.success('Cancellation successful')
            await fetchTodayReservations()
        } catch (err) {
            message.error('Cancellation failed')
        }
    }

    const handleConfirm = async (id) => {
        try {
            setSelectedTableId(null);
            const tables = await getAvailableTables();
            if (tables.data.length === 0) {
                message.warning('No available tables');
                return;
            }

            let selectedId = null;

            Modal.confirm({
                title: 'Assign table',
                content: (
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a table to assign"
                        onChange={(value) => (selectedId = value)}
                    >
                        {tables.data.map(table => (
                            <Select.Option key={table.id} value={table.id}>
                                {table.tableName} (Capacity: {table.capacity})
                            </Select.Option>
                        ))}
                    </Select>
                ),
                onOk: async () => {
                    if (!selectedId) {
                        message.error('Please assign a table');
                        return;
                    }
                    try {
                        await confirmReservation(id, selectedId);
                        message.success('Confirmation successful');
                        await fetchTodayReservations();
                    } catch (err) {
                        message.error('Confirmation failed');
                    }
                }
            });
        } catch (err) {
            message.error('Failed to retrieve available tables');
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
                message.error('Search failed')
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
            message.error('Search failed')
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
            message.error('Search failed')
        }
        setLoading(false)
    }

    const handleCreate = async (payload, form) => {
        setLoading(true)
        try {
            await createReservation(payload)
            message.success('Reservation created successfully')
            setCreateModalVisible(false)
            form.resetFields()
            await fetchTodayReservations()
        } catch (err) {
            console.error(err)
            message.error('Reservation creation failed')
        }
        setLoading(false)
    }

    const handleUpdate = async (payload, form) => {
        if (!editRecord) return
        setLoading(true)
        try {
            await updateReservation(editRecord.id, payload)
            message.success('Update successful')
            setEditModalVisible(false)
            setEditRecord(null)
            form.resetFields()
            await fetchTodayReservations()
        } catch (err) {
            console.error(err)
            message.error('Update failed')
        }
        setLoading(false)
    }

    return (
        <div style={{ margin: '8px' }}>
            <Card title={'Reservation Management'}>
                <div style={{ display: 'flex', marginBottom: 16, gap: 8 }}>
                    <Button type="primary" onClick={openCreateModal}>
                        Create Reservation
                    </Button>
                    <Button onClick={fetchTodayReservations}>Today's Reservations</Button>
                    <Input
                        placeholder="Search Criteria"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Button onClick={handleSearchPhone}>Search by phone number</Button>
                    <Button onClick={handleSearchName}>Search by name</Button>
                    <Select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        style={{ width: 120 }}
                        placeholder="Search by status"
                        allowClear
                    >
                        <Select.Option value="CREATED">CREATED</Select.Option>
                        <Select.Option value="CONFIRMED">CONFIRMED</Select.Option>
                        <Select.Option value="CANCELLED">CANCELLED</Select.Option>
                    </Select>
                    <Button onClick={fetchAll} style={{ marginLeft: 'auto' }}>
                        View all reservations
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
