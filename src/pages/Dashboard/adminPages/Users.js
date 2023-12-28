import React, { useState, useEffect } from 'react'
import { Table, Skeleton } from 'antd';
import axios from 'axios';


const Users = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const jwtToken = localStorage.getItem('token');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:9090/user/get', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200) {
                setUserData(response.data);
            } else {
                console.error('Failed to fetch users from the API:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
    ];

    return (
        <div>
            {loading ? (
                <Skeleton active />
            ) : (
                <Table
                    dataSource={userData}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 10 }}

                />
            )}
        </div>
    );
};

export default Users;