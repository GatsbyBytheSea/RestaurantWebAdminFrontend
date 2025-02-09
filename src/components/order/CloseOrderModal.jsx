import React from 'react'
import { Modal, Button } from 'antd'

export default function CloseOrderModal({ open, onCancel, onConfirm, order }) {
    return (
        <Modal
            title={`Confirm checkout #${order?.id || ''}`}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <p>Are you sure you want to settle the current order?</p>

            <div style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 8 }} onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="primary" onClick={onConfirm}>
                    Confirm
                </Button>
            </div>
        </Modal>
    )
}
