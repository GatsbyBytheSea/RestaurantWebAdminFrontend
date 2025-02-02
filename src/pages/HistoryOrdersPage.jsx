import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, Tag, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { getHistoricalClosedOrders, getHistoricalSales } from '../api/orders';
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
            message.error("缺少日期参数");
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
            message.error("加载历史订单失败");
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
            message.error("加载营业额失败");
        } finally {
            setSalesLoading(false);
        }
    };

    const columns = [
        {
            title: '订单ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '餐桌名称',
            dataIndex: ['table', 'tableName'],
            render: (text) => <Tag color="green">{text}</Tag>,
        },
        {
            title: '总金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val) => `€ ${val || 0}`,
        },
        {
            title: '结算时间',
            dataIndex: 'closeTime',
            key: 'closeTime',
            render: (text) => text ? new Date(text).toLocaleString() : ''
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button color="blue" variant="outlined" onClick={() => {
                    setSelectedOrder(record);
                    setViewModalVisible(true);
                }}>
                    查看
                </Button>
            )
        }
    ];

    return (
        <div>
            <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
                <div style={{background: '#000', borderBottom: '1px solid #ddd', padding: '16px'}}>
                    <Button type="default" onClick={() => navigate('/orders')}>
                        返回
                    </Button>
                </div>
                <Card title={`历史营业情况 - ${date}`} style={{margin: '8px'}}>
                    <Table
                        dataSource={orders}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                        footer={() => (
                            <div style={{textAlign: 'right', fontWeight: 'bold'}}>
                                营业额: € {sales}
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
