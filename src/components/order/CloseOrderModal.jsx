import React from 'react'
import { Modal, Button } from 'antd'

export default function CloseOrderModal({ open, onCancel, onConfirm, order }) {
    return (
        <Modal
            title={`确认结算订单 #${order?.id || ''}`}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <p>是否确认结算当前订单？</p>

            <div style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 8 }} onClick={onCancel}>
                    取消
                </Button>
                <Button type="primary" onClick={onConfirm}>
                    确认
                </Button>
            </div>
        </Modal>
    )
}
