import React, { useEffect, useState } from 'react'
import {Button, message, Card} from 'antd'
import { getAllTables } from '../api/tables.js'
import TableVisualization from '../components/table/TableVisualization.jsx'
import { useNavigate } from 'react-router-dom';

export default function Tables() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const fetchTables = async () => {
        setLoading(true)
        try {
            const res = await getAllTables()
            setData(res.data)
        } catch (err) {
            message.error('获取餐桌失败')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchTables()
    }, [])
    return (
        <div style={{ margin: '8px' }}>
            <Card title={'餐桌管理'} style={{  padding: '0px' }}>
                <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/tables/edit-layout')}>
                    编辑餐桌
                </Button>
                <TableVisualization tables={data} />
            </Card>
        </div>
    )
}
