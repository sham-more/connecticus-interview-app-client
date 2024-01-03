import React, { useState, useEffect } from 'react';
import { Table, Skeleton, Popconfirm, Button, Checkbox, message } from 'antd';
import axios from 'axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ChecklistIcon from '@mui/icons-material/Checklist';
import "./Users.css"

const Users = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAllVisible, setSelectAllVisible] = useState(false);
    const [checkboxColumnVisible, setCheckboxColumnVisible] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);

    const jwtToken = localStorage.getItem('token');



    const handleDelete = async (usersToDelete) => {
        try {
            if (!usersToDelete || usersToDelete.length === 0) {
                message.error('No users selected for deletion.');
                return;
            }


            const idList = Array.isArray(usersToDelete) ? usersToDelete.map(user => user.id) : [usersToDelete];

            const response = await axios.delete('http://localhost:8080/user/delete', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                data: {
                    idList: idList,
                },
            });

            if (response.status === 200) {
                message.success('Users deleted successfully:', [1.5]);
                await fetchUsers();
                setSelectedUsers([]);
                setSelectAllVisible(false);
            } else {
                message.error('Failed to delete users:', [1.5]);
            }
        } catch (error) {
            message.error('Error deleting users:', error);
        }

    };



    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/user/get', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200 || response.data.length > 0) {
                setUserData(response.data)

            } else {
                message.error('Failed to fetch users from the API:', response.statusText);
            }
        } catch (error) {
            message.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();


    }, []);

    const onSelectAllClick = () => {
        setSelectAllVisible((prevVisible) => checkboxColumnVisible && !prevVisible);
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.length === userData.length ? [] : [...userData]
        );

    };

    const onUserSelectChange = (record) => {
        setSelectedUsers((prevSelectedUsers) => {
            const isSelected = prevSelectedUsers.some((user) => user.id === record.id);
            return isSelected
                ? prevSelectedUsers.filter((user) => user.id !== record.id)
                : [...prevSelectedUsers, record];
        });
    };

    const clearSelectedUsers = () => {
        setSelectedUsers([]);
    };

    const toggleCheckboxColumn = () => {
        setCheckboxColumnVisible((prevVisible) => !prevVisible);

        setIsDeleteVisible(!isDeleteVisible);
        clearSelectedUsers(); // Clear selected users when toggling checkbox column visibility
    };

    const columns = [
        checkboxColumnVisible
            ? {
                title: (
                    <Checkbox
                        indeterminate={selectedUsers.length > 0 && selectedUsers.length < userData.length}
                        checked={selectedUsers.length === userData.length}
                        onChange={onSelectAllClick}
                    />
                ),
                key: 'select',
                render: (_, record) => (
                    <Checkbox
                        checked={selectedUsers.some((user) => user.id === record.id)}
                        onChange={() => onUserSelectChange(record)}

                    />
                ),
            }
            : null,
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" icon={<DeleteOutlined />} className='deleteInTable' />
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <div>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "left",
                    alignItems: "center",
                    margin: "10px 0px"
                }}
                className="tableActions"
            >
                <Button className='toggleForSelect' onClick={toggleCheckboxColumn}>

                    <ChecklistIcon />

                </Button>

                {isDeleteVisible && (
                    <>

                        <Popconfirm
                            title="Are you sure you want to delete the selected users?"
                            onConfirm={() => handleDelete(selectedUsers)}

                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" icon={<DeleteOutlined />} className='checkDelete'  >
                                Delete
                            </Button>
                        </Popconfirm>
                    </>
                )}

            </div>






            {loading ? (
                <Skeleton active />
            ) : (
                <Table
                    dataSource={userData}
                    columns={columns.filter(Boolean)} // Filter out null or undefined columns
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default Users;
