import React from 'react'
import { Card, List, Button } from 'antd'

export default function OrderItemsPanel({ orderItems, loading, onRemoveItem }) {
    return (
        <Card loading={loading} bodyStyle={{ padding: '0' }}>
            <List
                dataSource={orderItems}
                renderItem={item => (
                    <List.Item
                        style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}
                        actions={[
                            <Button
                                danger
                                type="text"
                                onClick={() => onRemoveItem(item.id)}
                            >
                                Delete
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={`${item.dish.name} × ${item.quantity}`}
                            description={`Price: €${item.price} | Subtotal: €${(item.price * item.quantity).toFixed(2)}`}
                        />
                    </List.Item>
                )}
            />
        </Card>
    )
}
