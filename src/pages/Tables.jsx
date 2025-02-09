import React, { useEffect, useState } from 'react'
import {Button, message, Card} from 'antd'
import { getAllTables } from '../api/tablesAPi.js'
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
            message.error('Failed to retrieve tables')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchTables()
    }, [])
    return (
        <div style={{ margin: '8px' }}>
            <Card title={'Table Management'} style={{ padding: '0px', height: '100%' }} >
                <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/tables/edit-layout')}>
                    Edit tables
                </Button>
                <TableVisualization tables={data} />
            </Card>
        </div>
    )
}
