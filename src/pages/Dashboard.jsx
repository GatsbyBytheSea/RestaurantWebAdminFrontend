import React from 'react'
import {Card, Row, Col} from 'antd'

export default function Dashboard() {
    return (
        <div style={{ margin: '16px' }}>
            <h2>仪表盘</h2>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="今日预订" bordered={false}>
                        尚未扩展：展示今日预定信息。预定桌数、预定总人数
                        {/*todo: 展示今日预定信息。预定桌数、预定总人数*/}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="今日营业额" bordered={false}>
                        尚未扩展：显示当前营业额信息
                        {/*todo：显示当前营业额信息*/}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="其他统计" bordered={false}>
                        ...
                    </Card>
                </Col>
            </Row>
            <Row>
                <Card title={"营业额统计"} style={{width: '100%', marginTop: '16px' }} >
                    尚未扩展：展示统计图表
                    {/*todo：展示统计图表*/}
                </Card>
            </Row>
        </div>
    )
}
