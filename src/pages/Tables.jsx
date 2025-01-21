import React, { useEffect, useState } from 'react'
import { Table, Button, message, Modal, Form, Input, Tag } from 'antd'
import { getAllTables, updateTableStatus, addTable, deleteTable, updateTable } from '../api/tables.js'
import TableVisualization from '../components/TableVisualization'

export default function Tables() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [editModal, setEditModal] = useState({visible:false, record:null})
    const [addModal, setAddModal] = useState(false)

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

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: '桌名', dataIndex: 'tableName' },
        { title: '容量', dataIndex: 'capacity' },
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
                    <Button onClick={() => setEditModal({visible:true, record})} style={{marginRight:8}}>编辑</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>删除</Button>
                </>
            )
        }
    ]

    const handleDelete = async (id) => {
        if(!window.confirm('确认删除此餐桌？')) return
        try {
            await deleteTable(id)
            message.success('删除成功')
            fetchTables()
        } catch (err) {
            message.error('删除失败')
        }
    }

    const handleEditSave = async (values) => {
        try {
            await updateTable(editModal.record.id, values)
            message.success('更新成功')
            setEditModal({visible:false, record:null})
            fetchTables()
        } catch (err) {
            message.error('更新失败')
        }
    }

    const handleAddSave = async (values) => {
        try {
            await addTable(values)
            message.success('添加成功')
            setAddModal(false)
            fetchTables()
        } catch (err) {
            message.error('添加失败')
        }
    }

    return (
        <div>
            <h2>餐桌管理</h2>
            <Button type="primary" onClick={() => setAddModal(true)} style={{marginBottom:16}}>
                添加餐桌
            </Button>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
            />

            <TableVisualization tables={data} />

            {/* 编辑弹窗 */}
            <Modal
                title="编辑餐桌"
                open={editModal.visible}
                onCancel={() => setEditModal({visible:false, record:null})}
                footer={null}
            >
                <Form
                    layout="vertical"
                    initialValues={editModal.record}
                    onFinish={handleEditSave}
                >
                    <Form.Item label="桌名" name="tableName" rules={[{required:true}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="容量" name="capacity" rules={[{required:true}]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="状态" name="status" rules={[{required:true}]}>
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form>
            </Modal>

            {/* 新增弹窗 */}
            <Modal
                title="添加餐桌"
                open={addModal}
                onCancel={() => setAddModal(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleAddSave}>
                    <Form.Item label="桌名" name="tableName" rules={[{required:true}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="容量" name="capacity" rules={[{required:true}]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="状态" name="status" initialValue="AVAILABLE">
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">添加</Button>
                </Form>
            </Modal>
        </div>
    )
}
