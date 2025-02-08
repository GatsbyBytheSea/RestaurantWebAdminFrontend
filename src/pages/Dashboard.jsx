import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, message, Statistic, Typography, Divider } from 'antd';
import { Line } from '@antv/g2plot';
import { getTodayReservations } from '../api/reservationsAPi.js';
import { getTodaySales } from '../api/ordersAPi.js';
import { getDailySales } from '../api/dailySalesApi.js';

const { Title, Text } = Typography;

export default function Dashboard() {
    const [reservationCount, setReservationCount] = useState(0);
    const [totalGuests, setTotalGuests] = useState(0);
    const [todaySales, setTodaySales] = useState(0);
    const [salesData, setSalesData] = useState([]);

    const chartRef = useRef(null);
    const lineChartRef = useRef(null);

    useEffect(() => {
        fetchTodayReservations();
        fetchTodaySales();
        fetchMonthlySales();
    }, []);

    const fetchTodayReservations = async () => {
        try {
            const res = await getTodayReservations();
            const reservations = res.data;
            setReservationCount(reservations.length);

            const total = reservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
            setTotalGuests(total);
        } catch (err) {
            message.error('获取今日预定失败');
        }
    };

    const fetchTodaySales = async () => {
        try {
            const res = await getTodaySales();
            const sales = res.data.sales;
            setTodaySales(sales);
        } catch (err) {
            message.error('获取今日营业额失败');
        }
    };

    const fetchMonthlySales = async () => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);

            const formatDate = (date) => date.toISOString().slice(0, 10);

            const res = await getDailySales(formatDate(startDate), formatDate(endDate));

            const formattedData = res.data.map((item) => ({
                date: item.date,
                sales: Number(item.totalSales) || 0,
            }));

            setSalesData(formattedData);
        } catch (err) {
            message.error('获取营业额统计数据失败');
        }
    };

    useEffect(() => {
        if (chartRef.current) {
            if (!lineChartRef.current) {
                lineChartRef.current = new Line(chartRef.current, {
                    data: salesData,
                    padding: 'auto',
                    xField: 'date',
                    yField: 'sales',
                    smooth: true,
                    xAxis: {
                        tickCount: 5,
                    },
                    yAxis: {
                        label: {
                            formatter: (v) => `€${v}`,
                        },
                    },
                    color: '#1890ff',
                    tooltip: {
                        formatter: (datum) => {
                            return { name: '销售额', value: `€${datum.sales}` };
                        },
                    },
                });
                lineChartRef.current.render();
            } else {
                lineChartRef.current.changeData(salesData);
                lineChartRef.current.render();
            }
        }
    }, [salesData]);

    return (
        <div style={{ margin: '24px' }}>
            <Row gutter={24}>
                <Col xs={24} sm={12} lg={8}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: 8, marginBottom: 24 }}
                        bodyStyle={{ padding: '16px 24px' }}
                    >
                        <Statistic
                            title="今日预定数"
                            value={reservationCount}
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <Statistic
                            title="总预定人数"
                            value={totalGuests}
                            valueStyle={{ color: '#2f54eb' }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: 8, marginBottom: 24 }}
                        bodyStyle={{ padding: '16px 24px' }}
                    >
                        <Statistic
                            title="今日营业额"
                            value={todaySales}
                            precision={2}
                            prefix="€"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title="最近一个月营业额趋势"
                bordered={false}
                style={{ borderRadius: 8 }}
                bodyStyle={{ padding: '16px 24px' }}
            >
                {salesData.length > 0 ? (
                    <Text type="secondary">
                        查看最近一个月（{salesData[0].date} ~ {salesData[salesData.length - 1].date}）的每日营业额
                    </Text>
                ) : (
                    <Text>暂无营业额数据</Text>
                )}
                <div ref={chartRef} style={{ height: 400, marginTop: 16 }} />
            </Card>
        </div>
    );
}
