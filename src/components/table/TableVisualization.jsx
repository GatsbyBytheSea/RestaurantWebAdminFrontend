import React from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../api/orders.js';

export default function TableVisualization({ tables }) {
    const navigate = useNavigate();

    const getColorByStatus = (status) => {
        switch (status) {
            case 'RESERVED': return '#108ee9';
            case 'IN_USE': return '#f50';
            default: return '#87d068'; // AVAILABLE
        }
    };

    const grouped = tables.reduce((acc, table) => {
        const loc = table.location || '未指定区域';
        if (!acc[loc]) {
            acc[loc] = [];
        }
        acc[loc].push(table);
        return acc;
    }, {});

    const handleTableClick = async (table) => {
        if (table.status === 'AVAILABLE' || table.status === 'RESERVED') {
            try {
                const res = await createOrder({ tableId: table.id });
                const order = res.data;
                navigate(`/orders/detail/${order.id}`);
            } catch (error) {
                message.error('创建订单失败，请稍后重试');
            }
        } else if (table.status === 'IN_USE') {
            if (table.currentOrderId) {
                navigate(`/orders/detail/${table.currentOrderId}`);
            } else {
                message.error('无法获取当前订单信息');
            }
        }
    };

    return (
        <div>
            {Object.keys(grouped).map((loc) => (
                <div key={loc} style={{ marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: 8 }}>{loc}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {grouped[loc].map(table => (
                            <Card
                                hoverable
                                key={table.id}
                                style={{
                                    width: 150,
                                    height: 120,
                                    background: getColorByStatus(table.status),
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleTableClick(table)}
                            >
                                <div>{table.tableName}</div>
                                <div>容量: {table.capacity}</div>
                                <div>{table.status}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
