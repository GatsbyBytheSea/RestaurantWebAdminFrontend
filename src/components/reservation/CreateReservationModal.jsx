import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Button } from 'antd'
import dayjs from 'dayjs'
import './CalendarStyle.css'


function disabledDate(current) {
    if (!current) return false

    // 最多提前两周预订
    const now = dayjs().startOf('day')
    const twoWeeks = dayjs().add(28, 'day').endOf('day')
    if (current.isBefore(now) || current.isAfter(twoWeeks)) {
        return true
    }

    // 周一周四放假
    const dayOfWeek = current.day()
    return dayOfWeek === 1 || dayOfWeek === 4;
}

function disabledTime(selectedMoment) {
    if (!selectedMoment) return {}

    // 营业时间：12:00-14:00 和 19:00-22:00
    const allowedHours = [12, 13, 14, 19, 20, 21, 22]
    const allHours = Array.from({ length: 24 }, (_, i) => i)
    const disabledHours = allHours.filter((h) => !allowedHours.includes(h))

    return {
        disabledHours: () => disabledHours,
        disabledMinutes: (hour) => {
            if (hour === 22 || hour === 14) {
                return Array.from({ length: 60 }, (_, i) => i).filter((m) => m !== 0)
            }
            return Array.from({ length: 60 }, (_, i) => i).filter(
                (m) => m !== 0 && m !== 30
            )
        },
    }
}


export default function CreateReservationModal({
                                                   open,
                                                   onCancel,
                                                   onCreate,
                                                   loading,
                                               }) {
    const [form] = Form.useForm()

    const handleFinish = async (values) => {
        const payload = {
            ...values,
            reservationTime: values.reservationTime.format('YYYY-MM-DDTHH:mm:ss'),
        }
        onCreate(payload, form)
    }

    useEffect(() => {
        if (open) {
            form.resetFields()
        }
    }, [open, form])

    return (
        <Modal
            title="创建预订"
            open={open}
            onCancel={() => {
                form.resetFields()
                onCancel()
            }}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="顾客姓名"
                    name="customerName"
                    rules={[{ required: true, message: '请输入顾客姓名' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="顾客电话"
                    name="customerPhone"
                    rules={[{ required: true, message: '请输入顾客电话' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="用餐人数"
                    name="numberOfGuests"
                    rules={[{ required: true, message: '请输入用餐人数' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="预订时间"
                    name="reservationTime"
                    rules={[{ required: true, message: '请选择合法的预订时间' }]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        showTime={{
                            format: 'HH:mm',
                            minuteStep: 30,
                            hideDisabledOptions: true,
                        }}
                        format="YYYY-MM-DD HH:mm"
                        minDate={dayjs()}
                        maxDate={dayjs().add(28, 'day')}
                        disabledDate={disabledDate}
                        disabledTime={disabledTime}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
