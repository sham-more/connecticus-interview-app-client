import React, { useState, useEffect } from 'react';
import { Button, Divider, Form, Input, Modal, Popconfirm, Radio, Select, Skeleton, Table } from 'antd';
import { DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';
import axios from 'axios';

// for validating all fields
const validateRequired = (rule, value, callback) => {
    if (value < 0) {
        callback(`Value must be greater than 0 for ${rule.field}`);
    } else if (!value || value.trim() === '') {
        callback(`Please input ${rule.field}`);
    } else {
        callback();
    }
};

// validation to cheeck easy + medium + hard = toatl
const validateQuestions = (rule, value, dependencies) => {
    const form = dependencies[0];
    const questionCount = form.getFieldValue('questionCount');
    const easyQuestions = form.getFieldValue('easyQuestions');
    const mediumQuestions = form.getFieldValue('mediumQuestions');
    const hardQuestions = form.getFieldValue('hardQuestions');

    if (value && value < 0) {
        return Promise.reject(`Value must be greater than 0 for ${rule.field}`);
    } else if (Number(easyQuestions) + Number(mediumQuestions) + Number(hardQuestions) !== Number(questionCount)) {

        // Clears the fields if there was an error and they are currently showing an error
        form.setFields([
            { name: 'easyQuestions', errors: [] },
            { name: 'mediumQuestions', errors: [] },
            { name: 'hardQuestions', errors: [] },
        ]);

        return Promise.reject(`Sum of easy, medium, and hard questions must equal to  ${questionCount}`);
    } else {

        // Resets the fields to clear any previous errors
        form.setFields([
            { name: 'easyQuestions', errors: [] },
            { name: 'mediumQuestions', errors: [] },
            { name: 'hardQuestions', errors: [] },
        ]);

        return Promise.resolve();

    }
};


const CollectionCreateForm = ({ open, onCreate, onUpdate, onCancel, initialValues, subjects }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);

    return (
        <Modal
            style={{ marginTop: "-110px", padding: "30px" }}
            visible={open}
            title={initialValues ? "Update Exam" : "Create Exam"}
            okText={initialValues ? "Update Exam" : "Create Exam"}
            cancelText="Cancel"
            onCancel={() => {
                form.resetFields();  // Reset form fields when the modal is canceled
                onCancel();
            }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        if (initialValues) {
                            onUpdate({ ...initialValues, ...values });
                        } else {
                            onCreate(values);
                        }
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    paddingLeft: '5px',
                    paddingRight: '20px',
                    paddingTop: "10px",
                    paddingBottom: "10px"
                }}
                initialValues={{
                    modifier: 'public',
                }}

            >
                <Form.Item
                    name="examName"
                    label="Title"
                    rules={[
                        {
                            required: true,
                            validator: validateRequired
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="questionCount"
                    label="Total Questions"
                    rules={[
                        {
                            required: true,
                            validator: validateRequired,

                        },
                    ]}
                >
                    <Input type="number" onChange={() => form.validateFields(['easyQuestions', 'mediumQuestions', 'hardQuestions'])} />
                </Form.Item>

                <Form.Item
                    name="easyQuestions"
                    label="Number of Easy Questions"
                    rules={[
                        {
                            required: true,
                            validator: (rule, value) => validateQuestions(rule, value, [form]),


                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="mediumQuestions"
                    label="Number of Medium Questions"
                    rules={[
                        {
                            required: true,
                            validator: (rule, value) => validateQuestions(rule, value, [form]),
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="hardQuestions"
                    label="Number of Hard Questions"
                    rules={[
                        {

                            required: true,
                            validator: (rule, value) => validateQuestions(rule, value, [form]),
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[
                        {
                            required: true,
                            validator: validateRequired
                        },
                    ]}
                >
                    <Select>
                        {subjects.map(subject => (
                            <Select.Option key={subject} value={subject.name}>
                                {subject.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="marksPerQuestion"
                    label="Marks Per Question"
                    rules={[
                        {
                            required: true,
                            validator: validateRequired,
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="timeUnit"
                    label="Time Unit"
                    rules={[
                        {
                            required: true,
                            validator: validateRequired
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value="hours">Hours</Radio>
                        <Radio value="minutes">Minutes</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="duration"
                    label="Duration"
                    rules={[
                        {
                            required: true,
                            validator: validateRequired
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                        {
                            required: true,
                            validator: validateRequired
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value="active">Active</Radio>
                        <Radio value="inactive">Inactive</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>

        </Modal>
    );
};

const CreateExam = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [examData, setExamData] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [subjects, setSubjects] = useState([]);

    const jwtToken = localStorage.getItem('token');



    const handleUpdate = (record) => {
        setSelectedExam(record);
        setOpen(true);
    };
    const handleDelete = (record) => {
        setSelectedExam(record);

    };

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:9090/question/subjects', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                if (response.status === 200) {
                    setSubjects(response.data);
                } else {
                    console.error('Failed to fetch subjects from the API:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);


    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:9090/exam/getActive', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200) {
                setExamData(response.data);
            } else {
                console.error('Failed to fetch data from the API:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching active exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const onCreate = async (values) => {
        try {

            values.status = values.status === 'active';
            values.questionCount = Number(values.questionCount, 10);
            values.easyQuestions = Number(values.easyQuestions, 10);
            values.mediumQuestions = Number(values.mediumQuestions, 10);
            values.hardQuestions = Number(values.hardQuestions, 10);

            const response = await axios.post('http://localhost:9090/exam/create', values, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            await fetchData();
            setOpen(false);
        } catch (error) {
            console.error('Error creating exam:', error);
        }
    };


    const onUpdate = async (updatedValues) => {
        try {

            updatedValues.status = updatedValues.status === 'active';


            const response = await axios.put(`http://localhost:9090/exam/update/${selectedExam.id}`, updatedValues, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200) {
                console.log('Exam updated successfully:', response.data);
                await fetchData();
            } else {
                console.error('Failed to update exam:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating exam:', error);
        } finally {
            setOpen(false);
            setSelectedExam(null);
        }
    };


    const onDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:9090/exam/delete/${selectedExam.id}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200) {
                console.log('Exam deleted successfully:', response.data);
                await fetchData();
            } else {
                console.error('Failed to delete exam:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting exam:', error);
        }
    };


    useEffect(() => {
        const fetchDataOnMount = async () => {
            await fetchData();
        };

        fetchDataOnMount();
    }, []);


    const columns = [
        { title: 'Id', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'examName', key: 'examName' },
        { title: 'Sub', dataIndex: 'subject', key: 'subject' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: () => (
                <span style={{ color: "#4BB543" }}>Active</span>
            ),
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (text, record) => (
                <span>{`${record.duration} ${record.timeUnit}`}</span>
            ),
        },
        { title: 'Total Questions', dataIndex: 'questionCount', key: 'questionCount' },
        { title: 'Easy Questions', dataIndex: 'easyQuestions', key: 'easyQuestions' },
        { title: 'Medium Questions', dataIndex: 'mediumQuestions', key: 'mediumQuestions' },
        { title: 'Hard Questions', dataIndex: 'hardQuestions', key: 'hardQuestions' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleUpdate(record)}
                    />
                    <Divider type="vertical" />

                    <Popconfirm
                        title="Are you sure you want to delete this exam?"
                        onConfirm={() => onDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            onClick={() => handleDelete(record)}
                            icon={<DeleteOutlined />}
                            style={{ color: 'red' }}
                        />
                    </Popconfirm>

                </span>
            ),
        },
    ];

    return (
        <div>
            <Button
                onClick={() => {
                    setSelectedExam(null);
                    setOpen(true);
                }}
                style={{ marginBottom: "20px" }}
                icon={<FormOutlined />}
            >
                Create
            </Button>

            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onUpdate={onUpdate}

                onCancel={() => {
                    setOpen(false);
                    setSelectedExam(null);
                }}
                initialValues={selectedExam}
                subjects={subjects}
            />

            {loading ? (
                <Skeleton active />
            ) : (
                <Table
                    dataSource={examData}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default CreateExam;
