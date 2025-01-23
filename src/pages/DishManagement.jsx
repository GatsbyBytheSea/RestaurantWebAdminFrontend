import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Select, message, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getAllDishes, createDish, updateDish, deleteDish, uploadDishImage } from '../api/dishes'

export default function DishManagement() {
    const [dishes, setDishes] = useState([])
    const [loading, setLoading] = useState(false)

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState({ visible: false, record: null })

    const [addForm] = Form.useForm()
    const [editForm] = Form.useForm()

    // 获取菜品列表
    const fetchDishes = async () => {
        setLoading(true)
        try {
            const res = await getAllDishes()
            setDishes(res.data)
        } catch (err) {
            message.error('获取菜品列表失败')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDishes()
    }, [])

    // 当点击编辑时，给编辑表单赋值
    useEffect(() => {
        if (editModal.visible && editModal.record) {
            editForm.setFieldsValue(editModal.record)
        } else {
            editForm.resetFields()
        }
    }, [editModal, editForm])

    // 删除菜品
    const handleDelete = async (id) => {
        if (!window.confirm('确认删除此菜品？')) return
        try {
            await deleteDish(id)
            message.success('删除成功')
            fetchDishes()
        } catch (err) {
            message.error('删除失败')
        }
    }

    // 处理添加菜品
    const handleAddFinish = async (values) => {
        try {
            await createDish(values)
            message.success('添加成功')
            setAddModal(false)
            fetchDishes()
        } catch (err) {
            message.error('添加失败')
        }
    }

    // 处理编辑菜品
    const handleEditFinish = async (values) => {
        try {
            await updateDish(editModal.record.id, values)
            message.success('更新成功')
            setEditModal({ visible: false, record: null })
            fetchDishes()
        } catch (err) {
            message.error('更新失败')
        }
    }

    // 上传图片
    // 后端返回图片地址，前端将地址赋值给表单字段
    const handleUpload = async (file, callback) => {
        try {
            const res = await uploadDishImage(file)
            callback(res.data)  // res.data为后端返回的imageUrl
        } catch (err) {
            message.error('图片上传失败')
        }
    }

    return (
        <div>
            <h2>菜品管理</h2>
            <Button type="primary" onClick={() => {
                addForm.resetFields()
                setAddModal(true)
            }}>
                添加菜品
            </Button>

            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {dishes.map(dish => (
                    <div
                        key={dish.id}
                        style={{
                            width: 200,
                            height: 300,
                            backgroundImage: `url(${dish.imageUrl || ''})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: 8,
                            position: 'relative',
                            color: '#fff'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            padding: '8px'
                        }}>
                            <h4 style={{ margin: 0 }}>{dish.name}</h4>
                            <p style={{ margin: 0 }}>￥{dish.price}</p>

                            <div style={{ marginTop: 8, display: 'flex', gap: '8px' }}>
                                <Button
                                    size="small"
                                    onClick={() => setEditModal({ visible: true, record: dish })}
                                >
                                    编辑
                                </Button>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => handleDelete(dish.id)}
                                >
                                    删除
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                title="添加菜品"
                open={addModal}
                onCancel={() => setAddModal(false)}
                footer={null}
            >
                <Form layout="vertical" form={addForm} onFinish={handleAddFinish}>
                    <Form.Item label="菜名" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="分类" name="category" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="前菜">前菜</Select.Option>
                            <Select.Option value="主菜">主菜</Select.Option>
                            <Select.Option value="甜点">甜点</Select.Option>
                            <Select.Option value="主食">主食</Select.Option>
                            <Select.Option value="酒水饮料">酒水饮料</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="价格" name="price" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="原材料" name="ingredients">
                        <Input placeholder="如: 花生,青菜,豆腐" />
                    </Form.Item>
                    <Form.Item label="描述" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="图片" name="imageUrl">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false} // 阻止AntD自动上传, 我们手动处理
                            onChange={async info => {
                                if (info.file && info.file.originFileObj) {
                                    const file = info.file.originFileObj
                                    handleUpload(file, (url) => {
                                        // 将返回的url赋值给表单字段imageUrl
                                        addForm.setFieldValue('imageUrl', url)
                                        message.success('图片上传成功')
                                    })
                                }
                            }}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>上传图片</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form>
            </Modal>

            <Modal
                title="编辑菜品"
                open={editModal.visible}
                onCancel={() => setEditModal({ visible: false, record: null })}
                footer={null}
            >
                <Form layout="vertical" form={editForm} onFinish={handleEditFinish}>
                    <Form.Item label="菜名" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="分类" name="category" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="前菜">前菜</Select.Option>
                            <Select.Option value="主菜">主菜</Select.Option>
                            <Select.Option value="甜点">甜点</Select.Option>
                            <Select.Option value="主食">主食</Select.Option>
                            <Select.Option value="酒水饮料">酒水饮料</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="价格" name="price" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="原材料" name="ingredients">
                        <Input placeholder="如: 花生,青菜,豆腐" />
                    </Form.Item>
                    <Form.Item label="描述" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="图片" name="imageUrl">
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={async info => {
                                if (info.file && info.file.originFileObj) {
                                    const file = info.file.originFileObj
                                    handleUpload(file, (url) => {
                                        editForm.setFieldValue('imageUrl', url)
                                        message.success('图片上传成功')
                                    })
                                }
                            }}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>上传图片</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">保存</Button>
                </Form>
            </Modal>
        </div>
    )
}
