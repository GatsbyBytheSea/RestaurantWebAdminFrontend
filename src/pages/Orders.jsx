import React, { useEffect, useState } from 'react';
import { Table, Button, Form, message, Card, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAvailableTables } from '../api/tablesAPi.js';
import { getOrders, createOrder, closeOrder, getTodayClosedOrders, getTodaySales } from '../api/ordersAPi.js';
import CloseOrderModal from '../components/order/CloseOrderModal';
import CreateOrderModal from "../components/order/CreateOrderModal.jsx";
import OrderDetailModal from "../components/order/OrderDetailModal.jsx";
import HistoryOrderQueryModal from "../components/order/HistoryOrderQueryModal.jsx";

export default function Orders() {
    const [openOrders, setOpenOrders] = useState([]);
    const [closedOrders, setClosedOrders] = useState([]);
    const [todaySales, setTodaySales] = useState(0);
    const [loading, setLoading] = useState(false);
    const [closedOrdersLoading, setClosedOrdersLoading] = useState(false);

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [availableTables, setAvailableTables] = useState([]);
    const [form] = Form.useForm();

    const [closeModalVisible, setCloseModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedClosedOrder, setSelectedClosedOrder] = useState(null);

    const [historyModalVisible, setHistoryModalVisible] = useState(false);

    const navigate = useNavigate();

    const fetchOpenOrders = async () => {
        try {
            setLoading(true);
            const res = await getOrders('OPEN', 0, 10);
            setOpenOrders(res.data.content || []);
        } catch (error) {
            message.error('加载订单失败');
        } finally {
            setLoading(false);
        }
    };

    const fetchClosedOrders = async () => {
        try {
            setClosedOrdersLoading(true);
            const res = await getTodayClosedOrders();
            setClosedOrders(res.data || []);
        } catch (error) {
            message.error('加载今日已结算订单失败');
        } finally {
            setClosedOrdersLoading(false);
        }
    };

    const fetchTodaySales = async () => {
        try {
            const res = await getTodaySales();
            setTodaySales(res.data.sales);
        } catch (error) {
            message.error('获取今日营业额失败');
        }
    };

    useEffect(() => {
        fetchOpenOrders();
        fetchClosedOrders();
        fetchTodaySales();
    }, []);

    const handleCloseOrder = (orderRecord) => {
        setSelectedOrder(orderRecord);
        setCloseModalVisible(true);
    };

    const handleConfirmClose = async () => {
        if (!selectedOrder) return;
        try {
            await closeOrder(selectedOrder.id, {});
            message.success(`订单 ${selectedOrder.id} 已结算`);
            setCloseModalVisible(false);
            fetchOpenOrders();
            fetchClosedOrders();
            fetchTodaySales();
        } catch (e) {
            message.error(e.response?.data?.error || '结算失败');
        }
    };

    const handleCreateOrder = () => {
        getAvailableTables().then(res => {
            setAvailableTables(res.data);
            setCreateModalVisible(true);
        }).catch(() => message.error('获取可用餐桌失败'));
    };

    const onCreateOrderFinish = async (values) => {
        try {
            await createOrder({ tableId: values.tableId });
            message.success('订单创建成功');
            setCreateModalVisible(false);
            form.resetFields();
            fetchOpenOrders();
        } catch (e) {
            message.error(e.response?.data?.error || '创建订单失败');
        }
    };

    const handleShowHistoryModal = () => {
        setHistoryModalVisible(true);
    };

    const handleHistorySearch = (date) => {
        setHistoryModalVisible(false);
        navigate(`/orders/history?date=${date}`);
    };

    const openColumns = [
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
            render: (val) => (
                <span style={{ fontWeight: 'bold' }}>
                    € {val || 0}
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button color="blue" variant="outlined" onClick={() => navigate(`/orders/detail/${record.id}`)}>
                        查看
                    </Button>
                    <Button color="green" variant="outlined" onClick={() => handleCloseOrder(record)}>
                        结算
                    </Button>
                </Space>
            )
        }
    ];

    const closedColumns = [
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
            render: (val) => (
                <span style={{ fontWeight: 'bold' }}>
                    € {val || 0}
                </span>
            ),
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
                    setSelectedClosedOrder(record);
                    setViewModalVisible(true);
                }}>
                    查看
                </Button>
            )
        }
    ];

    return (
        <div style={{ margin: '8px' }}>
            <Card title="订单管理" bodyStyle={{ padding: '16px' }}>
                <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={handleCreateOrder}>
                        创建新订单
                    </Button>
                    <Button type="default" onClick={handleShowHistoryModal}>
                        查看历史订单
                    </Button>
                </Space>

                <Table
                    dataSource={openOrders}
                    columns={openColumns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Card title="今日已结算订单" style={{ marginTop: '16px' }}>
                <Table
                    dataSource={closedOrders}
                    columns={closedColumns}
                    rowKey="id"
                    loading={closedOrdersLoading}
                    pagination={false}
                    footer={() => (
                        <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            今日营业额: € {todaySales}
                        </div>
                    )}
                />
            </Card>

            <CreateOrderModal
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onFinish={onCreateOrderFinish}
                form={form}
                availableTables={availableTables}
            />

            <CloseOrderModal
                open={closeModalVisible}
                onCancel={() => setCloseModalVisible(false)}
                onConfirm={handleConfirmClose}
                order={selectedOrder}
            />

            <OrderDetailModal
                visible={viewModalVisible}
                order={selectedClosedOrder}
                onCancel={() => setViewModalVisible(false)}
            />

            <HistoryOrderQueryModal
                visible={historyModalVisible}
                onCancel={() => setHistoryModalVisible(false)}
                onSearch={handleHistorySearch}
            />
        </div>
    );
}
