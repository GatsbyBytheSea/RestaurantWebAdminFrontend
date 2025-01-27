import React from 'react'
import { Card } from 'antd'

export default function TableVisualization({ tables }) {
    // tables: [{id, tableName, capacity, status}, ...]

    const getColorByStatus = (status) => {
        switch(status) {
            case 'RESERVED': return '#108ee9'   // blue
            case 'IN_USE': return '#f50'  // red
            default: return '#87d068'     // green for AVAILABLE
        }
    }

    const grouped = tables.reduce((acc, table) => {
        const loc = table.location || '未指定区域'
        if (!acc[loc]) {
            acc[loc] = []
        }
        acc[loc].push(table)
        return acc
    }, {})

    return (
        <div style={{ marginTop: 20 }}>
            {Object.keys(grouped).map((loc) => (
                <div key={loc} style={{ marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: 8 }}>{loc}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {grouped[loc].map(table => (
                            <Card
                                key={table.id}
                                style={{ width: 150,height: 120, background: getColorByStatus(table.status), color: '#fff' }}
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
    )
}
