import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Divider, Form, Input, Modal, Popconfirm, Radio, Select, Skeleton, Table, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';
import ChecklistIcon from '@mui/icons-material/Checklist';
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
                        message.error('Validate Failed', [2]);
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
    const [selectedExams, setSelectedExams] = useState([]);
    const [selectAllVisible, setSelectAllVisible] = useState(false);

    const [checkboxColumnVisible, setCheckboxColumnVisible] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);



    const [subjects, setSubjects] = useState([]);


    const jwtToken = localStorage.getItem('token');



    const handleUpdate = (record) => {
        setSelectedExam(record);
        setOpen(true);
    };

    const handleDelete = async (examsToDelete) => {
        try {

            if (!examsToDelete || examsToDelete.length === 0) {
                message.error('No users selected for deletion.');
                return;
            }
            const idList = Array.isArray(examsToDelete) ? examsToDelete.map(user => user.id) : [examsToDelete];



            const response = await axios.delete('http://localhost:8080/exam/delete', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                data: {
                    idList: idList,
                },
            });

            if (response.status === 200) {
                message.success(`${response.data.message}`, [1.5])
                await fetchData();
                setExamData(prevExamData => prevExamData.filter(exam => !idList.includes(exam.id)));

                setSelectedExams([]);
                setSelectAllVisible(false);

            } else {
                message.error(`${response.data.message}`, [1.5], response.statusText);
            }
        } catch (error) {
            console.error(`${error.response.data.message}`, error);
        }
    };

    const changeExamStatus = async (examsToChangeStatus, status) => {
        try {

            if (!examsToChangeStatus || examsToChangeStatus.length === 0) {
                message.error('No exams selected for update.');
                return;
            }
            const idList = Array.isArray(examsToChangeStatus) ? examsToChangeStatus.map(exam => exam.id) : [examsToChangeStatus];


            const response = await axios.post('http://localhost:8080/exam/changeStatus', {
                idList: idList,
                status: status,
            }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200) {
                message.success(`${response.data.message}`, [1.5]);

                await fetchData();
                setSelectedExams([]);
                setSelectAllVisible(false);
            } else {
                message.error('Failed to change exam status:', [2]);
            }
        } catch (error) {
            message.error('Error changing exam status:', [2]);
        }
    };



    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:8080/question/subjects', {
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
            const response = await axios.get('http://localhost:8080/exam/getAll', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200) {
                setExamData(response.data);
            } else {
                message.error('Failed to fetch data from the API', [2]);
            }
        } catch (error) {
            console.log('Error fetching active exams', [2]);
        } finally {
            setLoading(false);
        }
    };

    const onCreate = async (values) => {
        try {
            values.status = values.status === 'active';
            values.questionCount = Number(values.questionCount, 10);
            values.easyQuestions = Number(values.easyQuestions, 0);
            values.mediumQuestions = Number(values.mediumQuestions, 0);
            values.hardQuestions = Number(values.hardQuestions, 0);

            const response = await axios.post('http://localhost:8080/exam/create', values, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });


            if (response.status === 200) {
                // Successful response
                message.success(`Exam Created Successfully`, [1.5]);
                await fetchData();
                setOpen(false);
            } else {
                // Unsuccessful response
                message.error(`${response.data.message}`, [3]);
            }
        } catch (error) {
            // Handle other errors, e.g., network issues
            message.error(`${error.response.data.message}`, [3]);
        }
    };



    const onUpdate = async (updatedValues) => {
        try {

            updatedValues.status = updatedValues.status === 'active';


            const response = await axios.put(`http://localhost:8080/exam/update/${selectedExam.id}`, updatedValues, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200) {
                message.success('Exam updated successfully:', [2]);
                await fetchData();
            } else {
                message.error('Failed to update exam:', [2]);
            }
        } catch (error) {
            message.error('Error updating exam:', [2]);
        } finally {
            setOpen(false);
            setSelectedExam(null);
        }
    };

    useEffect(() => {
        const fetchDataOnMount = async () => {
            await fetchData();
        };

        fetchDataOnMount();
    }, []);

    const onSelectAllClick = () => {
        setSelectAllVisible((prevVisible) => checkboxColumnVisible && !prevVisible);

        setSelectedExams((prevSelectedExams) =>
            prevSelectedExams.length === examData.length ? [] : [...examData]
        );
    };

    const onExamSelectChange = (record) => {
        setSelectedExams((prevSelectedExams) => {
            const isSelected = prevSelectedExams.some((exam) => exam.id === record.id);
            return isSelected
                ? prevSelectedExams.filter((exam) => exam.id !== record.id)
                : [...prevSelectedExams, record];
        });
    };

    const clearSelectedExams = () => {
        setSelectedExams([]);
    };

    const toggleCheckboxColumn = () => {
        setCheckboxColumnVisible((prevVisible) => !prevVisible);

        setIsDeleteVisible(!isDeleteVisible);
        clearSelectedExams(); // Clear selected users when toggling checkbox column visibility
    };


    const columns = [
        checkboxColumnVisible
            ? {
                title: (
                    <Checkbox
                        indeterminate={selectedExams.length > 0 && selectedExams.length < examData.length}
                        checked={selectedExams.length === examData.length}
                        onChange={onSelectAllClick}
                    />
                ),
                key: 'select',
                responsive: ['md'],
                render: (_, record) => (
                    <Checkbox
                        checked={selectedExams.some((exam) => exam.id === record.id)}
                        onChange={() => onExamSelectChange(record)}

                    />
                ),
            }
            : null,
        { title: 'Name', dataIndex: 'examName', key: 'examName' },
        { title: 'Sub', dataIndex: 'subject', key: 'subject' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <span style={{ color: record.status === true ? "#4BB543" : "#FF0000" }}>
                    {record.status === true ? 'Active' : 'Inactive'}
                </span>
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
        // { title: 'Easy Questions', dataIndex: 'easyQuestions', key: 'easyQuestions' },
        // { title: 'Medium Questions', dataIndex: 'mediumQuestions', key: 'mediumQuestions' },
        // { title: 'Hard Questions', dataIndex: 'hardQuestions', key: 'hardQuestions' },
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
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" className='deleteInTable' icon={<DeleteOutlined />}
                        />
                    </Popconfirm>

                </span>
            ),
        },
    ];

    return (
        <div>

            <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "15px" }}>


                <Button
                    onClick={() => {
                        setSelectedExam(null);
                        setOpen(true);
                    }}

                    icon={<FormOutlined />}
                >
                    Create
                </Button>

                <Button className='toggleForSelect' onClick={toggleCheckboxColumn}>

                    <ChecklistIcon />

                </Button>

                {isDeleteVisible && (
                    <>

                        <Popconfirm
                            title="Are you sure you want to delete the selected exams?"
                            onConfirm={() => handleDelete(selectedExams)}

                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" icon={<DeleteOutlined />} className='checkDelete'  >
                                Delete
                            </Button>


                        </Popconfirm>

                        <Button type="link" icon={<CheckCircleOutlined />} className='checkActivate' onClick={() => changeExamStatus(selectedExams, true)} >
                            Activate
                        </Button>

                        <Button type="link" icon={<CloseCircleOutlined />} className='checkDelete' onClick={() => changeExamStatus(selectedExams, false)}>
                            Dectivate
                        </Button>
                    </>
                )}



            </div>







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
                    columns={columns.filter(Boolean)}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default CreateExam;
