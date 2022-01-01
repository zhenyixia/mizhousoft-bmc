import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import FormFlex from '@/constants/flex';

const FormItem = Form.Item;

export default function ViewSecurityLog({ securityLog }) {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <a onClick={() => setVisible(true)}>{securityLog.detail}</a>

            {visible && (
                <Modal
                    title='查看安全日志'
                    visible
                    width='600px'
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    closable={false}
                    destroyOnClose
                    centered
                    className='mz-modal'
                >
                    <Form className='mz-view-form' labelAlign='left' {...FormFlex.w100_lg5_required}>
                        <FormItem label='操作名称'>{securityLog.operation}</FormItem>
                        <FormItem label='级别'>{securityLog.logLevel}</FormItem>
                        <FormItem label='操作帐号'>{securityLog.accountName}</FormItem>
                        <FormItem label='操作时间'>{securityLog.creationTimeStr}</FormItem>
                        <FormItem label='操作终端'>{securityLog.terminal}</FormItem>
                        <FormItem label='操作结果'>{securityLog.resultStr}</FormItem>
                        <FormItem label='详细信息'>{securityLog.detail}</FormItem>
                        <FormItem label='附加信息'>{securityLog.addInfo}</FormItem>
                    </Form>
                </Modal>
            )}
        </>
    );
}
