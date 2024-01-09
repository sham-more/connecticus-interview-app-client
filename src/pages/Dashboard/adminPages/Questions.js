import React, { useState, useEffect } from 'react';
import { UploadOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, message, Upload, Table, Skeleton, Popconfirm, Checkbox } from 'antd';
import ChecklistIcon from '@mui/icons-material/Checklist';

import axios from 'axios';

const Questions = () => {
    const [tableData, setTableData] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectAllVisible, setSelectAllVisible] = useState(false);
    const [checkboxColumnVisible, setCheckboxColumnVisible] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const jwtToken = localStorage.getItem('token');

    const fetchTotalQuestions = async () => {
        try {
            const response = await axios.post('http://localhost:8080/question/all/0/20', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });
            setTotalQuestions(response.data.totalElements);

        } catch (error) {
            console.error('Error fetching total questions:', error);
        }
    };




    const handleDelete = async (questionsToDelete) => {
        try {
            if (!questionsToDelete || questionsToDelete.length === 0) {
                message.error('No questions selected for deletion.');
                return;
            }


            const idList = Array.isArray(questionsToDelete) ? questionsToDelete.map(question => question.id) : [questionsToDelete];

            const response = await axios.delete('http://localhost:8080/question/delete', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                data: {
                    idList: idList,
                },
            });

            if (response.status === 200) {
                message.success(`${response.data.message}`, [1.5]);
                await fetchData();
                setSelectedQuestions([]);
                setSelectAllVisible(false);
            } else {
                message.error(`${response.data.message}`, [1.5]);
            }
        } catch (error) {
            message.error('Error deleting questions', [1.5]);
        }

    };

    const fetchData = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/question/all/0/${totalQuestions}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            const formattedData = response.data.content.map(item => ({
                id: item.id,
                question: item.question,
                subject: item.subject,
                difficulty: item.difficulty,
                answer: item.answer,
            }));
            setTableData(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {

            setLoading(false);
        }
    };







    useEffect(() => {
        const fetchDataOnMount = async () => {
            // Set loading to true initially
            setLoading(true);


            await fetchTotalQuestions();

            await new Promise(resolve => setTimeout(resolve, 1000));

            await fetchData();

            setLoading(false);

        };

        fetchDataOnMount();
    }, [totalQuestions]);



    const onSelectAllClick = () => {
        setSelectAllVisible((prevVisible) => checkboxColumnVisible && !prevVisible);
        setSelectedQuestions((prevSelectedQuestions) =>
            prevSelectedQuestions.length === tableData.length ? [] : [...tableData]
        );

    };

    const onQuestionSelectChange = (record) => {
        setSelectedQuestions((prevSelectedQuestions) => {
            const isSelected = prevSelectedQuestions.some((question) => question.id === record.id);
            return isSelected
                ? prevSelectedQuestions.filter((question) => question.id !== record.id)
                : [...prevSelectedQuestions, record];
        });
    };

    const clearSelectedQuestions = () => {
        setSelectedQuestions([]);
    };

    const toggleCheckboxColumn = () => {
        setCheckboxColumnVisible((prevVisible) => !prevVisible);

        setIsDeleteVisible(!isDeleteVisible);
        clearSelectedQuestions(); // Clear selected question when toggling checkbox column visibility
    };


    const props = {
        name: 'file',
        listType: 'picture',
        action: 'http://localhost:8080/question/upload',
        headers: {
            authorization: `Bearer ${jwtToken}`,
        },

        showUploadList: false,
        onChange(info) {
            if (info.file.status === 'done') {
                fetchTotalQuestions().then((as) => {
                    setLoading(true);

                    fetchData();
                    setLoading(false);
                    message.success(`${info.file.response.message}`, [4]);



                })




            } else if (info.file.status === 'error') {
                message.error(`${info.file.response.message}`, [4]);

            }
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
        },

    };

    const columns = [

        checkboxColumnVisible
            ? {
                title: (
                    <Checkbox
                        indeterminate={selectedQuestions.length > 0 && selectedQuestions.length < tableData.length}
                        checked={selectedQuestions.length === tableData.length}
                        onChange={onSelectAllClick}
                    />
                ),
                key: 'select',
                render: (_, record) => (
                    <Checkbox
                        checked={selectedQuestions.some((question) => question.id === record.id)}
                        onChange={() => onQuestionSelectChange(record)}

                    />
                ),
            }
            : null,

        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <Popconfirm
                        title="Are you sure you want to delete this question?"
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
            <div style={{ top: 10, marginBottom: '20px', display: "flex", gap: "10px", alignItems: "center" }}>
                <Upload className="upload-list-inline"

                    {...props} >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>

                <Button className='toggleForSelect' onClick={toggleCheckboxColumn}>

                    <ChecklistIcon />

                </Button>

                {isDeleteVisible && (
                    <>

                        <Popconfirm
                            title="Are you sure you want to delete the selected questions?"
                            onConfirm={() => handleDelete(selectedQuestions)}

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


            {loading ? ( // Renders Skeleton while loading

                <Skeleton active={!tableData.length} />
            ) : (
                <Table
                    dataSource={tableData}
                    columns={columns.filter(Boolean)}
                    rowKey="id" />
            )}
        </div>
    );
};

export default Questions;
