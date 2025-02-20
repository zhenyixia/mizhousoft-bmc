import React, { useState } from 'react';
import { Form, Modal } from 'antd';

const FormItem = Form.Item;

export default function ViewSystemLog({ systemLog }) {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <a onClick={() => setVisible(true)}>{systemLog.detail}</a>

            {visible && (
                <Modal
                    title='查看系统日志'
                    width='600px'
                    open
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    closable={false}
                    centered
                    className='mz-modal'
                >
                    <Form preserve={false} className='mz-view-form' labelAlign='left' labelCol={{ flex: '90px' }}>
                        <FormItem label='基本信息'>{systemLog.baseInfo}</FormItem>
                        <FormItem label='级别'>{systemLog.logLevel}</FormItem>
                        <FormItem label='操作时间'>{systemLog.creationTimeStr}</FormItem>
                        <FormItem label='来源'>{systemLog.source}</FormItem>
                        <FormItem label='操作结果'>{systemLog.resultStr}</FormItem>
                        <FormItem label='详细信息'>{systemLog.detail}</FormItem>
                        <FormItem label='附加信息'>{systemLog.addInfo}</FormItem>
                    </Form>
                </Modal>
            )}
        </>
    );
}
