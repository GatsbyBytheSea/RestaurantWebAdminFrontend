import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Button, message, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { getReservationById, updateReservation } from '../api/reservations'

export default function ReservationDetail() {
    const { id } = useParams()
    const [form] = Form.useForm()
    const navigate = useNavigate()

    useEffect(() => {
        fetchDetail()
    }, [])

    const fetchDetail = async () => {
        try {
            const res = await getReservationById(id)
            const r = res.data
            form.setFieldsValue({
                customerName: r.customerName,
                customerPhone: r.customerPhone,
                reservationTime: dayjs(r.reservationTime),
                numberOfGuests: r.numberOfGuests,
                status: r.status
            })
        } catch (err) {
            message.error('获取详情失败')
        }
    }

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                reservationTime: values.reservationTime.format('YYYY-MM-DDTHH:mm:ss')
            }
            await updateReservation(id, payload)
            message.success('更新成功')
            navigate('/reservations')
        } catch (err) {
            message.error('更新失败')
        }
    }

    return (
        <div>
            <h2>预订详情编辑</h2>
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 400 }}>
                <Form.Item label="顾客姓名" name="customerName" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item label="顾客电话" name="customerPhone" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item label="预订时间" name="reservationTime" rules={[{required: true}]}>
                    <DatePicker showTime />
                </Form.Item>
                <Form.Item label="用餐人数" name="numberOfGuests" rules={[{required: true}]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="状态" name="status">
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                    保存
                </Button>
                <Button onClick={() => navigate('/reservations')}>返回</Button>
            </Form>
        </div>
    )
}
