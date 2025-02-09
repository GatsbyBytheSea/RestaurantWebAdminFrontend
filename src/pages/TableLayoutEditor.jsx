import React, { useState, useEffect } from 'react';
import {message, Row, Col, Space, Button} from 'antd';
import { useNavigate } from 'react-router-dom';
import TableFormModal from '../components/table/TableFormModal';
import { getAllTables, updateTable, addTable, deleteTable } from '../api/tablesAPi.js';
import TableGridEditor from '../components/table/TableGridEditor';
import TableGroupList from '../components/table/TableGroupList';

const GRID_COLS = 8;
const GRID_ROWS = 8;
const CELL_WIDTH = 75;
const CELL_HEIGHT = 75;
const LOCATIONS = ['TERRACE', 'HALL_EAST', 'HALL_WEST', 'MAIN_HALL'];

export default function TableLayoutEditor() {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newTableGrid, setNewTableGrid] = useState(null);
    const [currentTable, setCurrentTable] = useState(null);

    const fetchTables = async () => {
        try {
            const res = await getAllTables();
            setTables(res.data);
        } catch (err) {
            message.error('Failed to retrieve tables');
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleDragStop = async (e, data, table) => {
        const newGridX = Math.round(data.x / CELL_WIDTH);
        const newGridY = Math.round(data.y / CELL_HEIGHT);

        if (
            newGridX < 0 ||
            newGridY < 0 ||
            newGridX + table.gridWidth > GRID_COLS ||
            newGridY + table.gridHeight > GRID_ROWS
        ) {
            message.error('Table out of bounds');
            fetchTables();
            return;
        }

        try {
            await updateTable(table.id, { ...table, gridX: newGridX, gridY: newGridY });
            message.success('Updated successfully');
            fetchTables();
        } catch (err) {
            message.error('Update failed');
        }
    };

    const handleGridClick = (e) => {
        if (e.target !== e.currentTarget) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const gridX = Math.floor(clickX / CELL_WIDTH);
        const gridY = Math.floor(clickY / CELL_HEIGHT);

        const occupied = tables.find(table =>
            gridX >= table.gridX && gridX < table.gridX + table.gridWidth &&
            gridY >= table.gridY && gridY < table.gridY + table.gridHeight
        );
        if (occupied) return;

        setNewTableGrid({ gridX, gridY });
        setModalVisible(true);
    };

    const handleModalFinish = async (values) => {
        const newTable = {
            ...values,
            gridX: newTableGrid ? newTableGrid.gridX : values.gridX,
            gridY: newTableGrid ? newTableGrid.gridY : values.gridY,
            gridWidth: values.gridWidth || 1,
            gridHeight: values.gridHeight || 1,
            status: 'AVAILABLE'
        };
        try {
            await addTable(newTable);
            message.success('Added successfully');
            setModalVisible(false);
            fetchTables();
        } catch (err) {
            message.error('Addition failed');
        }
    };

    const handleEdit = (record) => {
        setCurrentTable(record);
        setEditModalVisible(true);
    };

    const handleEditModalFinish = async (values) => {
        try {
            await updateTable(currentTable.id, { ...currentTable, ...values });
            message.success('Updated successfully');
            setEditModalVisible(false);
            setCurrentTable(null);
            fetchTables();
        } catch (err) {
            message.error('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this table?')) return;
        try {
            await deleteTable(id);
            message.success('Deleted successfully');
            fetchTables();
        } catch (err) {
            message.error('Deletion failed');
        }
    };

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{background: '#001529', padding: '16px'}}>
                <Space style={{width: '100%', justifyContent: 'space-between'}}>
                    <Button type="default" onClick={() => navigate('/tables')}>
                        Back to table list
                    </Button>
                    <h2 style={{margin: 0, color: '#fff'}}>Edit tables</h2>
                </Space>
            </div>

            <div style={{flex: 1, overflow: 'auto'}}>
                <Row style={{height: '100%'}} gutter={0}>
                    <Col span={12} style={{ padding: '16px'}}>
                        <TableGridEditor
                            tables={tables}
                            onGridClick={handleGridClick}
                            onDragStop={handleDragStop}
                            gridCols={GRID_COLS}
                            gridRows={GRID_ROWS}
                            cellWidth={CELL_WIDTH}
                            cellHeight={CELL_HEIGHT}
                        />
                    </Col>
                    <Col span={12} style={{  display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                        <TableGroupList
                            tables={tables}
                            locations={LOCATIONS}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </Col>
                </Row>
            </div>

            {modalVisible && (
                <TableFormModal
                    open={modalVisible}
                    title="Add table"
                    initialValues={
                        newTableGrid
                            ? {gridX: newTableGrid.gridX, gridY: newTableGrid.gridY, gridWidth: 1, gridHeight: 1}
                            : {}
                    }
                    onCancel={() => setModalVisible(false)}
                    onFinish={handleModalFinish}
                />
            )}

            {editModalVisible && (
                <TableFormModal
                    open={editModalVisible}
                    title="Edit table"
                    initialValues={currentTable}
                    onCancel={() => {
                        setEditModalVisible(false);
                        setCurrentTable(null);
                    }}
                    onFinish={handleEditModalFinish}
                />
            )}
        </div>
    );
}
