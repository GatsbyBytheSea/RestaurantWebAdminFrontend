import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Tag, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { getHistoricalClosedOrders, getHistoricalSales } from '../api/ordersAPi.js';
import OrderDetailModal from '../components/order/OrderDetailModal';

const HistoryOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [sales, setSales] = useState(0);
    const [loading, setLoading] = useState(false);
    const [salesLoading, setSalesLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { date } = queryString.parse(location.search);

    useEffect(() => {
        if (!date) {
            message.error("Missing date parameter");
            navigate("/orders");
            return;
        }
        fetchOrders();
        fetchSales();
    }, [date]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await getHistoricalClosedOrders(date);
            setOrders(res.data || []);
        } catch (err) {
            message.error("Failed to load historical orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchSales = async () => {
        try {
            setSalesLoading(true);
            const res = await getHistoricalSales(date);
            setSales(res.data.sales);
        } catch (err) {
            message.error("Failed to load revenue");
        } finally {
            setSalesLoading(false);
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Table Name',
            dataIndex: ['table', 'tableName'],
            render: (text) => <Tag color="green">{text}</Tag>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val) => `€ ${val || 0}`,
        },
        {
            title: 'Close Time',
            dataIndex: 'closeTime',
            key: 'closeTime',
            render: (text) => text ? new Date(text).toLocaleString() : ''
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Button color="blue" variant="outlined" onClick={() => {
                    setSelectedOrder(record);
                    setViewModalVisible(true);
                }}>
                    View
                </Button>
            )
        }
    ];

    return (
        <div>
            <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
                <div style={{background: '#001529', borderBottom: '1px solid #ddd', padding: '16px'}}>
                    <Button type="default" onClick={() => navigate('/orders')}>
                        Back
                    </Button>
                </div>
                <Card title={`Historical Orders - ${date}`} style={{margin: '8px'}}>
                    <Table
                        dataSource={orders}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                        footer={() => (
                            <div style={{textAlign: 'right', fontWeight: 'bold'}}>
                                Revenue: € {sales}
                            </div>
                        )}
                    />
                </Card>
                <OrderDetailModal
                    visible={viewModalVisible}
                    order={selectedOrder}
                    onCancel={() => setViewModalVisible(false)}
                />
            </div>
        </div>
    );
};

export default HistoryOrdersPage;
