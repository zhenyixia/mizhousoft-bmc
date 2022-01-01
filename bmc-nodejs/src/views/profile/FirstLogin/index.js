import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Form, Input, Button, Alert, message } from 'antd';
import FormFlex from '@/constants/flex';
import { logout } from '@/session/sessionService';
import { CONTEXT_LOGIN_PATH } from '@/config/application';
import { modifyFirstLoginPassword } from '../profileService';

const FormItem = Form.Item;

export default function FirstLogin() {
    const [form] = Form.useForm();
    const timeoutRef = useRef();

    const [confirmLoading, setConfirmLoading] = useState(false);

    const checkNewPassword = (rule, value) => {
        if (value) {
            if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value) || !/[!#$%&()*+=@^_~-]/.test(value)) {
                return Promise.reject(
                    new Error(
                        '密码至少包括一个大写字符(A-Z)，一个小写字母(a-z)，一个数字字符，一个特殊字符~!@#$%^&*()_-+=。'
                    )
                );
            }
        }

        return Promise.resolve();
    };

    const checkConfirmPassword = (rule, value) => {
        if (value && value !== form.getFieldValue('newPassword')) {
            return Promise.reject(new Error('新密码和确认新密码不一样。'));
        }
        return Promise.resolve();
    };

    const onFinish = (values) => {
        setConfirmLoading(true);

        const body = {
            password: values.password,
            newPassword: values.newPassword,
            confirmNewPassword: values.confirmPassword,
        };

        modifyFirstLoginPassword(body).then(({ fetchStatus }) => {
            setConfirmLoading(false);

            if (fetchStatus.okey) {
                message.success('修改密码成功，2秒后自动跳转到登录界面重新登录。');

                const timeoutId = setTimeout(() => {
                    window.location.href = CONTEXT_LOGIN_PATH;
                }, 2000);
                timeoutRef.current = timeoutId;
            } else {
                message.error(fetchStatus.message);
            }
        });
    };

    const onLogout = () => {
        logout().then(({ fetchStatus }) => {
            if (fetchStatus.okey) {
                window.location.href = CONTEXT_LOGIN_PATH;
            } else {
                message.error(fetchStatus.message);
            }
        });
    };

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    const content =
        '第一次登录系统，为保证你的帐号安全，请你修改初始密码。修改密码成功，2秒后自动跳转到登录界面重新登录。';

    return (
        <Row style={{ marginTop: '120px' }}>
            <Col span={4} />
            <Col span={16}>
                <Form
                    onFinish={onFinish}
                    form={form}
                    labelAlign='left'
                    style={{ backgroundColor: 'white', padding: '25px' }}
                >
                    <Alert message={content} type='info' showIcon style={{ marginBottom: '20px' }} />

                    <FormItem
                        name='password'
                        {...FormFlex.w100_lg5_required}
                        label='老密码'
                        rules={[
                            {
                                required: true,
                                message: '请输入你的老密码。',
                            },
                            {
                                min: 8,
                                message: '密码最小长度是8。',
                            },
                        ]}
                    >
                        <Input type='password' maxLength='32' autoComplete='off' />
                    </FormItem>
                    <FormItem
                        name='newPassword'
                        {...FormFlex.w100_lg5_required}
                        label='新密码'
                        validateFirst
                        rules={[
                            {
                                required: true,
                                message: '请输入你的新密码。',
                            },
                            {
                                min: 8,
                                message: '密码最小长度是8。',
                            },
                            {
                                validator: checkNewPassword,
                            },
                        ]}
                    >
                        <Input type='password' maxLength='32' autoComplete='off' />
                    </FormItem>
                    <FormItem
                        name='confirmPassword'
                        {...FormFlex.w100_lg5_required}
                        label='确认新密码'
                        validateFirst
                        dependencies={['newPassword']}
                        rules={[
                            {
                                required: true,
                                message: '请输入你的确认新密码。',
                            },
                            {
                                min: 8,
                                message: '密码最小长度是8。',
                            },
                            {
                                validator: checkConfirmPassword,
                            },
                        ]}
                    >
                        <Input type='password' maxLength='32' autoComplete='off' />
                    </FormItem>
                    <div className='mz-button-group center'>
                        <Button type='primary' htmlType='submit' loading={confirmLoading}>
                            确定
                        </Button>
                        <Button onClick={onLogout}>退出</Button>
                    </div>
                </Form>
            </Col>
            <Col span={4} />
        </Row>
    );
}
