import React from 'react'
import { Card, Tabs, List } from 'antd'

export default function AddDishPanel({ dishesByCategory, onDishClick }) {
    return (
        <Card
            title="添加菜品到当前订单"
            style={{ height: '100%' }}
            bodyStyle={{ padding: '0 16px 16px' }}
        >
            <Tabs
                defaultActiveKey="0"
                items={dishesByCategory.map((catInfo, index) => ({
                    key: String(index),
                    label: catInfo.category,
                    children: (
                        <List
                            grid={{ gutter: 16, column: 6 }}
                            dataSource={catInfo.dishes}
                            renderItem={dish => (
                                <List.Item>
                                    <Card
                                        hoverable
                                        style={{
                                            width: '100%',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                        cover={
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    paddingBottom: '100%', // 利用 padding 形成正方形容器
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <img
                                                    src={dish.imageUrl}
                                                    alt={dish.name}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        padding: '4px',
                                                        color: '#fff',
                                                        background: 'rgba(0,0,0,0.3)'
                                                    }}
                                                >
                                                    <div style={{ fontSize: '14px' }}>
                                                        {dish.name} - €{dish.price}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        bodyStyle={{ display: 'none' }}
                                        onClick={() => onDishClick(dish)}
                                    >
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )
                }))}
            />
        </Card>
    )
}
