import React from 'react';
import Draggable from 'react-draggable';

const TableGridEditor = ({ tables, onGridClick, onDragStop, gridCols, gridRows, cellWidth, cellHeight }) => {
    return (
        <div>
            <div
                style={{
                    position: 'relative',
                    width: gridCols * cellWidth,
                    height: gridRows * cellHeight,
                    border: '2px solid #ddd',
                    borderRadius: '4px',
                    background: '#f7f7f7',
                    backgroundImage:
                        'linear-gradient(90deg, #e0e0e0 1px, transparent 1px), linear-gradient(180deg, #e0e0e0 1px, transparent 1px)',
                    backgroundSize: `${cellWidth}px ${cellHeight}px`
                }}
                onClick={onGridClick}
            >
                {tables.map(table => (
                    <Draggable
                        key={table.id}
                        grid={[cellWidth, cellHeight]}
                        defaultPosition={{ x: table.gridX * cellWidth, y: table.gridY * cellHeight }}
                        onStop={(e, data) => onDragStop(e, data, table)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute',
                                width: table.gridWidth * cellWidth,
                                height: table.gridHeight * cellHeight,
                                background:
                                    table.status === 'AVAILABLE'
                                        ? '#10b981'
                                        : table.status === 'RESERVED'
                                            ? '#3b82f6'
                                            : '#ef4444',
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
