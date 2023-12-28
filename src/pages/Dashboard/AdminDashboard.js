import React, { useState } from 'react';
import Questions from './adminPages/Questions';
import CreateExam from './adminPages/CreateExam';
import Users from './adminPages/Users';
import { toast } from 'react-toastify';
import { useAuth } from '../../contex/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FormOutlined,
    FileTextOutlined,
    LogoutOutlined,
    TeamOutlined,
    DashboardOutlined,
    DatabaseOutlined
} from '@ant-design/icons';

import { Layout, Menu, Button, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [selectedSection, setSelectedSection] = useState('1'); // Default to Dashboard

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = () => {
        // Dispatch the 'LOGOUT' action
        dispatch({
            type: 'LOGOUT',
        });

        toast.success('Logout successful!', {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

        // Redirects to the login page 
        navigate('/sign-in');
    };

    const DashboardSection = () => {
        return <div>Welcome Back, {state.firstName}</div>;
    };

    const renderSection = () => {
        switch (selectedSection) {
            case '1':
                return <DashboardSection />;
            case '2':
                return <Questions />;
            case '3':
                return <CreateExam />;
            case '4':
                return <Users />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ height: '100vh' }} >
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ overflow: 'hidden' }}>
                <Menu
                    theme="dark"
                    mode="inline"

                    style={{ fontSize: "15px", padding: "10px 5px" }}
                    defaultSelectedKeys={['1']}
                    onSelect={({ key }) => setSelectedSection(key)}
                >
                    <Button
                        type="text"
                        icon={collapsed
                            ?
                            <MenuUnfoldOutlined style={{ fontSize: '16px', color: 'white' }} theme="outlined" />
                            : <MenuFoldOutlined style={{ fontSize: '16px', color: 'white' }} theme="outlined" />}

                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '17px',
                            width: 34,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "4px 17px",
                            height: 24,
                            color: "white",
                            scrollBehavior: "smooth",


                        }}
                    />


                    <hr />

                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        Dashboard
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DatabaseOutlined />}>
                        Exam Data
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FormOutlined />}>
                        Exam
                    </Menu.Item>
                    <Menu.Item key="4" icon={<TeamOutlined />}>
                        Users
                    </Menu.Item>
                    <Menu.Item key="5" onClick={handleLogout} icon={<LogoutOutlined />}>
                        Logout
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>


                <Header
                    style={{
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: colorBgContainer,
                        overflow: 'hidden',
                    }}
                >

                    {/* <h4>CTPL Admin Dashboard</h4> */}

                </Header>


                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 'calc(100vh - 112px)',
                        fontSize: "18px",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflowY: 'auto',
                    }}
                >
                    {renderSection()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
