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
            message.error('获取餐桌失败');
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
            message.error('餐桌超出边界');
            fetchTables();
            return;
        }

        try {
            await updateTable(table.id, { ...table, gridX: newGridX, gridY: newGridY });
            message.success('更新成功');
            fetchTables();
        } catch (err) {
            message.error('更新失败');
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
            message.success('添加成功');
            setModalVisible(false);
            fetchTables();
        } catch (err) {
            message.error('添加失败');
        }
    };

    const handleEdit = (record) => {
        setCurrentTable(record);
        setEditModalVisible(true);
    };

    const handleEditModalFinish = async (values) => {
        try {
            await updateTable(currentTable.id, { ...currentTable, ...values });
            message.success('更新成功');
            setEditModalVisible(false);
            setCurrentTable(null);
            fetchTables();
        } catch (err) {
            message.error('更新失败');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('确认删除此餐桌？')) return;
        try {
            await deleteTable(id);
            message.success('删除成功');
            fetchTables();
        } catch (err) {
            message.error('删除失败');
        }
    };

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{background: '#001529', padding: '16px'}}>
                <Space style={{width: '100%', justifyContent: 'space-between'}}>
                    <Button type="default" onClick={() => navigate('/tables')}>
                        返回餐桌管理
                    </Button>
                    <h2 style={{margin: 0, color: '#fff'}}>编辑餐桌</h2>
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
                    title="添加餐桌"
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
                    title="编辑餐桌"
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
