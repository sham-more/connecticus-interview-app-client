import React, { useState, useEffect } from 'react';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, message, Upload, Table, Skeleton } from 'antd';
import axios from 'axios';

const Questions = () => {
    const [tableData, setTableData] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [loading, setLoading] = useState(true);
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
    ];

    return (
        <div>
            <div style={{ top: 10, marginBottom: '20px' }}>
                <Upload className="upload-list-inline"

                    {...props} >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </div>
            {loading ? ( // Renders Skeleton while loading

                <Skeleton active={!tableData.length} />
            ) : (
                <Table dataSource={tableData} columns={columns} />
            )}
        </div>
    );
};

export default Questions;
