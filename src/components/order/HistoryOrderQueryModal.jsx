import React, { useState } from 'react';
import { Modal, DatePicker, Button, Form } from 'antd';
import dayjs from "dayjs";

const HistoryOrderQueryModal = ({ visible, onCancel, onSearch }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleSearch = () => {
        if (selectedDate) {
            onSearch(selectedDate.format('YYYY-MM-DD'));
        }
    };

    return (
        <Modal
            visible={visible}
            title="查询历史营业情况"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    取消
                </Button>,
                <Button key="search" type="primary" onClick={handleSearch} disabled={!selectedDate}>
                    查询
                </Button>,
            ]}
        >
            <Form layout="vertical">
                <Form.Item label="选择日期">
                    <DatePicker
                        value={selectedDate}
                        maxDate={dayjs()}
                        minDate={dayjs('2025-01-01')}
                        onChange={(date) => setSelectedDate(date)} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default HistoryOrderQueryModal;
