import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Tree, Form, Button } from 'antd';
import { LOADING_FETCH_STATUS } from '@/constants/common';
import { PageLoading, PageException, PageComponent } from '@/components/UIComponent';
import { fetchRoleInfo } from '../redux/roleService';

const FormItem = Form.Item;

export default function RoleInfo() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [uFetchStatus, setFetchStatus] = useState(LOADING_FETCH_STATUS);
    const [uRole, setRole] = useState(undefined);
    const [uTreeData, setTreeData] = useState(undefined);

    const gotoList = () => {
        navigate('/role/list');
    };

    useEffect(() => {
        const body = {
            id,
        };

        fetchRoleInfo(body).then(({ fetchStatus, role, treeData }) => {
            setRole(role);
            setTreeData(treeData);
            setFetchStatus(fetchStatus);
        });
    }, []);

    const breadcrumbs = [
        <Link key='list' to='/role/list'>
            角色
        </Link>,
        '查看角色',
    ];

    if (uFetchStatus.loading) {
        return <PageLoading breadcrumbs={breadcrumbs} />;
    }
    if (!uFetchStatus.okey) {
        return <PageException breadcrumbs={breadcrumbs} fetchStatus={uFetchStatus} goBack={gotoList} />;
    }

    const treeDataList = JSON.parse(uTreeData);

    return (
        <PageComponent breadcrumbs={breadcrumbs}>
            <Form labelAlign='left' labelCol={{ flex: '80px' }}>
                <FormItem label='角色名'>{uRole.displayNameCN}</FormItem>
                <FormItem label='描述'>{uRole.descriptionCN}</FormItem>
                <div>角色权限：</div>
                <div className='mz_permission_tree'>
                    <Tree showLine defaultExpandAll blockNode treeData={treeDataList} />
                </div>
                <div>
                    <Button type='primary' onClick={gotoList}>
                        返回
                    </Button>
                </div>
            </Form>
        </PageComponent>
    );
}
