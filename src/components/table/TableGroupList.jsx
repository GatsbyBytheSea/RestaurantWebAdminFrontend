import React from 'react';
import { Card, Table, Space, Tag, Button } from 'antd';

const TableGroupList = ({ tables, locations, onEdit, onDelete }) => {
    const groupedTables = {};
    locations.forEach(loc => {
        groupedTables[loc] = tables.filter(table => table.location === loc);
    });

    const columns = [
        {
            title: 'Table Name',
            dataIndex: 'tableName',
            render: (tableName) => <Tag color="green">{tableName}</Tag>
        },
        { title: 'Capacity', dataIndex: 'capacity' },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text) => {
                let color = 'green';
                if (text === 'IN_USE') color = 'red';
                if (text === 'RESERVED') color = 'blue';
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Actions',
            render: (record) => (
                <Space>
                    <Button color="blue" variant="outlined" onClick={() => onEdit(record)}>Edit</Button>
                    <Button danger onClick={() => onDelete(record.id)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            {locations.map(loc => (
                <Card title={loc} style={{ flex: 1, margin: '8px' }} key={loc}>
                    <Table
                        columns={columns}
                        dataSource={groupedTables[loc]}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </Card>
            ))}
        </div>
    );
};

export default TableGroupList;
