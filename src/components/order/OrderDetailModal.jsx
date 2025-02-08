import React, { useEffect, useState } from 'react';
import { Modal, Table, message } from 'antd';
import { getOrderItems } from '../../api/ordersAPi.js';

const OrderDetailModal = ({ visible, order, onCancel }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && order) {
            fetchOrderItems();
        }
    }, [visible, order]);

    const fetchOrderItems = async () => {
        try {
            setLoading(true);
            const res = await getOrderItems(order.id);
            setOrderItems(res.data);
        } catch (error) {
            message.error('加载订单详情失败');
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const columns = [
        {
            title: '菜品名称',
            dataIndex: ['dish', 'name'],
            key: 'name',
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            render: (val) => `€ ${val}`,
        },
        {
            title: '小计',
            key: 'subtotal',
            render: (_, record) => `€ ${(record.price * record.quantity).toFixed(2)}`
        }
    ];

    return (
        <Modal
            visible={visible}
            title={`订单 ${order ? order.id : ''} 详情`}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <Table
                dataSource={orderItems}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
                footer={() => (
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        总金额: € {totalAmount.toFixed(2)}
                    </div>
                )}
            />
        </Modal>
    );
};

export default OrderDetailModal;
