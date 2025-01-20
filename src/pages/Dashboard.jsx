import React from 'react'
import { Card, Row, Col } from 'antd'

export default function Dashboard() {
    return (
        <div>
            <h2>仪表盘</h2>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="今日预订" bordered={false}>
                        尚未拓展：比如从后端获取今日预订数
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="今日空闲餐桌" bordered={false}>
                        可对接后端统计
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="其他统计" bordered={false}>
                        ...
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
