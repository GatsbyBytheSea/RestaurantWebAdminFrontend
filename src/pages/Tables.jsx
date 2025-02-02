import React, { useEffect, useState } from 'react'
import {Table, Button, message, Divider, Tag, Card} from 'antd'
import { getAllTables, updateTable, addTable, deleteTable } from '../api/tables.js'
import TableVisualization from '../components/table/TableVisualization.jsx'
import TableFormModal from '../components/table/TableFormModal.jsx'

export default function Tables() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)


    const [modalState, setModalState] = useState({
        visible: false,
        isEdit: false,
        record: null
    })

    const fetchTables = async () => {
        setLoading(true)
        try {
            const res = await getAllTables()
            setData(res.data)
        } catch (err) {
            message.error('获取餐桌失败')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchTables()
    }, [])

    const handleEdit = (record) => {
        setModalState({
            visible: true,
            isEdit: true,
            record
        })
    }

    const handleAdd = () => {
        setModalState({
            visible: true,
            isEdit: false,
            record: null
        })
    }

    const handleModalCancel = () => {
        setModalState({
            visible: false,
            isEdit: false,
            record: null
        })
    }

    const handleModalFinish = async (values) => {
        try {
            if (modalState.isEdit && modalState.record) {
                await updateTable(modalState.record.id, values)
                message.success('更新成功')
            } else {
                await addTable(values)
                message.success('添加成功')
            }
            handleModalCancel()
            fetchTables()
        } catch (err) {
            message.error(modalState.isEdit ? '更新失败' : '添加失败')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('确认删除此餐桌？')) return
        try {
            await deleteTable(id)
            message.success('删除成功')
            fetchTables()
        } catch (err) {
            message.error('删除失败')
        }
    }

    const columns = [
        { title: '桌名', dataIndex: 'tableName' },
        { title: '容量', dataIndex: 'capacity' },
        { title: '位置', dataIndex: 'location' },
        {
            title: '状态',
            dataIndex: 'status',
            render: (text) => {
                let color = 'green'
                if (text === 'IN_USE') color = 'red'
                if (text === 'RESERVED') color = 'blue'
                return <Tag color={color}>{text}</Tag>
            }
        },
        {
            title: '操作',
            render: (record) => (
                <>
                    <Button
                        color="blue" variant="outlined"
                        style={{ marginRight: 8 }}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        删除
                    </Button>
                </>
            )
        }
    ]

    return (
        <div style={{ margin: '8px' }}>
            <Card title={'餐桌管理'} style={{  padding: '0px' }}>
                <TableVisualization tables={data} />

                <Divider style={{ margin: '32px 0' }} />

                <Button
                    type="primary"
                    onClick={handleAdd}
                    style={{ marginBottom: 16 }}
                >
                    添加餐桌
                </Button>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                />

                <TableFormModal
                    open={modalState.visible}
                    title={modalState.isEdit ? '编辑餐桌' : '添加餐桌'}
                    initialValues={modalState.record || {}}
                    onCancel={handleModalCancel}
                    onFinish={handleModalFinish}
                />
            </Card>
        </div>
    )
}
