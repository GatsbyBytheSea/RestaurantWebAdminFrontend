import React, { useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Button } from 'antd'
import dayjs from 'dayjs'
import './CalendarStyle.css'


function disabledDate(current) {
    if (!current) return false

    const now = dayjs().startOf('day')
    const twoWeeks = dayjs().add(28, 'day').endOf('day')
    if (current.isBefore(now) || current.isAfter(twoWeeks)) {
        return true
    }

    const dayOfWeek = current.day()
    return dayOfWeek === 1 || dayOfWeek === 4;
}

function disabledTime(selectedMoment) {
    if (!selectedMoment) return {}

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
            title="Create Reservation"
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
                    label="Customer Name"
                    name="customerName"
                    rules={[{ required: true, message: 'Please enter the customer\'s name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Customer Phone"
                    name="customerPhone"
                    rules={[{ required: true, message: 'Please enter the customer\'s phone number' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Number of guests"
                    name="numberOfGuests"
                    rules={[{ required: true, message: 'Please enter the number of guests' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Reservation time"
                    name="reservationTime"
                    rules={[{ required: true, message: 'Reservation time' }]}
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
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
