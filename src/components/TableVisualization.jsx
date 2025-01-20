import React from 'react'
import { Card } from 'antd'

export default function TableVisualization({ tables }) {
    // tables: [{id, tableName, capacity, status}, ...]
    // 颜色映射
    const getColorByStatus = (status) => {
        switch(status) {
            case 'IN_USE': return '#f50'    // red
            case 'RESERVED': return '#108ee9' // blue
            default: return '#87d068'     // green for AVAILABLE
        }
    }

    return (
        <div style={{ marginTop: 20 }}>
            <h3>餐桌可视化</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tables.map(table => (
                    <Card
                        key={table.id}
                        style={{ width: 100, background: getColorByStatus(table.status), color: '#fff' }}
                    >
                        <div>{table.tableName}</div>
                        <div>容量: {table.capacity}</div>
                        <div>{table.status}</div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
