import React, { useEffect, useState } from 'react'
import { Table, Button, message, Input, Space } from 'antd'
import { getAllReservations, getReservationsByPhone, getReservationsByName, getReservationsByStatus, cancelReservation } from '../api/reservations'
import { useNavigate } from 'react-router-dom'

export default function Reservations() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('') // phone/name/status
    const navigate = useNavigate()

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

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: '顾客姓名', dataIndex: 'customerName' },
        { title: '电话', dataIndex: 'customerPhone' },
        { title: '预订时间', dataIndex: 'reservationTime' },
        { title: '状态', dataIndex: 'status' },
        {
            title: '操作',
            render: (record) => (
                <Space>
                    <Button onClick={() => navigate(`/reservations/${record.id}`)}>编辑</Button>
                    <Button danger onClick={() => handleCancel(record.id)}>取消</Button>
                </Space>
            )
        }
    ]

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

    const handleSearchStatus = async () => {
        if(!query) return
        setLoading(true)
        try {
            const res = await getReservationsByStatus(query)
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
                <Input
                    placeholder="查询条件"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                />
                <Button onClick={handleSearchPhone}>按电话查询</Button>
                <Button onClick={handleSearchName}>按姓名查询</Button>
                <Button onClick={handleSearchStatus}>按状态查询</Button>
                <Button type="link" onClick={fetchAll}>重置</Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
            />
        </div>
    )
}
