import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

const TableGridEditor = ({ tables, onGridClick, onDragStop, gridCols, gridRows }) => {

    const containerRef = useRef(null);
    const [cellSize, setCellSize] = useState(60);

    const updateCellSize = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const newCellSize = containerWidth / gridCols;
            setCellSize(newCellSize);
        }
    };

    useEffect(() => {
        updateCellSize();
        window.addEventListener('resize', updateCellSize);
        return () => {
            window.removeEventListener('resize', updateCellSize);
        };
    }, [gridCols]);

    return (
        <div style={{ margin: '8px' }} >
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: gridRows * cellSize,
                    border: '2px solid #ddd',
                    borderRadius: '4px',
                    background: '#f7f7f7',
                    backgroundImage:
                        'linear-gradient(90deg, #e0e0e0 1px, transparent 1px), linear-gradient(180deg, #e0e0e0 1px, transparent 1px)',
                    backgroundSize: `${cellSize}px ${cellSize}px`
                }}
                onClick={onGridClick}
            >
                {tables.map(table => (
                    <Draggable
                        key={table.id}
                        grid={[cellSize, cellSize]}
                        defaultPosition={{ x: table.gridX * cellSize, y: table.gridY * cellSize }}
                        onStop={(e, data) => onDragStop(e, data, table)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute',
                                width: table.gridWidth * cellSize,
                                height: table.gridHeight * cellSize,
                                background:
                                    table.status === 'AVAILABLE'
                                        ? '#87d068'
                                        : table.status === 'RESERVED'
                                            ? '#108ee9'
                                            : '#f50',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                cursor: 'move',
                                userSelect: 'none',
                                transition: 'transform 0.2s'
                            }}
                        >
                            {table.tableName}
                        </div>
                    </Draggable>
                ))}
            </div>
        </div>
    );
};

export default TableGridEditor;
