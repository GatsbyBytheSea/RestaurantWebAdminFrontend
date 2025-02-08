import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../api/ordersAPi.js';

const TableVisualization = ({ tables }) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [cellSize, setCellSize] = useState(60);

    const GRID_COLS = 8;
    const GRID_ROWS = 8;

    const updateCellSize = () => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            const newSize = Math.min(width / GRID_COLS, height * 1.3 / GRID_ROWS);
            setCellSize(newSize);
        }
    };

    useEffect(() => {
        updateCellSize();
        window.addEventListener('resize', updateCellSize);
        return () => window.removeEventListener('resize', updateCellSize);
    }, [GRID_COLS, GRID_ROWS]);

    const getColorByStatus = (status) => {
        switch (status) {
            case 'RESERVED': return '#3b82f6';
            case 'IN_USE': return '#ef4444';
            default: return '#10b981'; // AVAILABLE
        }
    };

    const handleTableClick = async (table) => {
        if (table.status === 'AVAILABLE' || table.status === 'RESERVED') {
            try {
                const res = await createOrder({ tableId: table.id });
                const order = res.data;
                navigate(`/orders/detail/${order.id}`);
            } catch (error) {
                message.error('创建订单失败，请稍后重试');
            }
        } else if (table.status === 'IN_USE') {
            if (table.currentOrderId) {
                navigate(`/orders/detail/${table.currentOrderId}`);
            } else {
                message.error('无法获取当前订单信息');
            }
        }
    };

    const gridWidth = GRID_COLS * cellSize;
    const gridHeight = GRID_ROWS * cellSize;

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: gridWidth,
                    height: gridHeight,
                    background: 'transparent'
                }}
            >
                {tables.map(table => (
                    <div
                        key={table.id}
                        onClick={() => handleTableClick(table)}
                        style={{
                            position: 'absolute',
                            left: table.gridX * cellSize,
                            top: table.gridY * cellSize,
                            width: table.gridWidth * cellSize,
                            height: table.gridHeight * cellSize,
                            background: getColorByStatus(table.status),
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'transform 0.2s'
                        }}
                    >
                        <div>{table.tableName}</div>
                        <div>容量: {table.capacity}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableVisualization;
