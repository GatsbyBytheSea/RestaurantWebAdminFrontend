import React from 'react'
import { Button } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

/**
 * @param {Array}   dishes
 * @param {Function} onEdit
 * @param {Function} onDelete
 */
function DishVisualization({ dishes, onEdit, onDelete }) {

    const categories = ['前菜', '主菜', '主食', '甜点', '酒水饮料']

    return (
        <div style={{ marginTop: 16 }}>
            {categories.map((cat) => {
                // 过滤出当前分类的菜品
                const catDishes = dishes.filter((dish) => dish.category === cat)
                if (catDishes.length === 0) {
                    return null
                }

                return (
                    <div key={cat} style={{ marginBottom: 24 }}>
                        <h3 style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>
                            {cat}
                        </h3>

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}
                        >
                            {catDishes.map((dish) => (
                                <div
                                    key={dish.id}
                                    style={{
                                        width: 150,
                                        height: 200,
                                        backgroundImage: `url(${dish.imageUrl || ''})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: 8,
                                        position: 'relative',
                                        color: '#fff',
                                        overflow: 'hidden' // 避免子元素超出
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            width: '100%',
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            padding: '8px'
                                        }}
                                    >
                                        <h4 style={{ margin: '0 0 4px 0' }}>{dish.name}</h4>
                                        <p style={{ margin: 0 }}>€{dish.price}</p>

                                        <div style={{ marginTop: 8, display: 'flex', gap: '8px' }}>
                                            {/* 编辑按钮 */}
                                            <Button
                                                type="primary"
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() => onEdit(dish)}
                                            >
                                                编辑
                                            </Button>

                                            {/* 删除按钮 */}
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                onClick={() => onDelete(dish.id)}
                                            >
                                                删除
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default DishVisualization
