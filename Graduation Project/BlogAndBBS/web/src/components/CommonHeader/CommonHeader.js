import { Input, Tabs, Modal, Form, Radio, message, InputNumber, Menu, Dropdown, Avatar, Button } from 'antd';
import commonHeaderStyle from './CommonHeader.module.scss'
import logoImg from "../../assets/logo.jpg";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import CommonContext from '../../context/CommonContext';
import { useState, useContext, useEffect } from "react";
import event from "../../event";
const { TabPane } = Tabs;
const { TextArea } = Input;

const CommonHeader = (props) => {

    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const [searchContent, setSearchContent] = useState("");
    const [loginUser, setLoginUser] = useState({});
    const { getFieldDecorator, validateFields } = props.form;
    const commonContext = useContext(CommonContext);
    const history = useHistory();


    useEffect(() => {
        event.addListener('refreshUser',
            () => {
                checkLogin();
            }
        );
        // 检查是否登录
        checkLogin();
        return () => {
        }
    }, []);

    // 检查是否登录
    const checkLogin = () => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/check_login', { token: token })
            .then(function (response) {
                let resp = response.data;
                if (resp.code === 0) {
                    if (global.tools.isNotEmpty(resp.data.token)) {
                        setLoginUser(resp.data);
                    }
                }
            })
            .catch(function (error) {
            })
    };


    // 注册操作
    const submitRegister = () => {
        validateFields((err, values) => {
            if (err) {
                const errs = Object.keys(err);
                if (errs.includes('username')) {
                    message.warn("请输入用户昵称！");
                    return
                }
                if (errs.includes('password')) {
                    message.warn("请输入用户密码！");
                    return
                }
                if (errs.includes('phone')) {
                    message.warn("请输入手机号码！");
                    return
                }
            }
            axios.post(commonContext.serverUrl + '/web/user/register', values)
                .then(function (response) {
                    let resp = response.data;
                    if (resp.code === 0) {
                        message.success(resp.msg);
                        setRegisterVisible(false)
                    } else {
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                    console.error(error);
                    message.error("网络错误，注册用户信息失败~");
                })
        });
    };

    // 登录操作
    const submitLogin = () => {
        validateFields((err, values) => {
            if (err) {
                const errs = Object.keys(err);
                if (errs.includes('username')) {
                    message.warn("请输入用户昵称！");
                    return
                }
                if (errs.includes('password')) {
                    message.warn("请输入用户密码！");
                    return
                }
            }
            axios.post(commonContext.serverUrl + '/web/user/login', values)
                .then(function (response) {
                    let resp = response.data;
                    if (resp.code === 0) {
                        message.success(resp.msg);
                        global.tools.setLoginUser(resp.data.token);
                        setLoginUser(resp.data);
                        setLoginVisible(false);
                        window.location.reload();
                    } else {
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                    console.error(error);
                    message.error("网络错误，登录失败~");
                })
        });
    };

    // 退出登录操作
    const logoutUser = () => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/logout', { token: token })
            .then(function (response) {
                let resp = response.data;
                if (resp.code === 0) {
                    global.tools.setLoginUser("");
                    setLoginUser({});
                    message.success(resp.msg);
                    window.location.reload();
                }
            }).catch(function (error) {
                message.error('网络错误，退出登录失败！');
            })
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 20 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const dropdownMenu = (
        <Menu>
            <Menu.Item>
                <div style={{ cursor: 'pointer' }} onClick={() => history.push("/user/" + loginUser.id)}>
                    个人信息
                </div>
            </Menu.Item>
            <Menu.Item>
                <div style={{ cursor: 'pointer' }} onClick={() => logoutUser()}>
                    退出登录
                </div>
            </Menu.Item>
        </Menu>
    );



    return (
        <>
            <div className={commonHeaderStyle.header}>
                <div className={commonHeaderStyle.title} onClick={() => history.push("/index")}>
                    <div style={{ marginRight: '1rem' }}>
                        <img src={logoImg} alt='' width='30' height='30' />
                    </div>
                    <div style={{ marginTop: '0.1rem' }}>
                        博客
                    </div>
                </div>
                <div className={commonHeaderStyle.menu}>
                    <Tabs defaultActiveKey={props.tabKey} activeKey={props.tabKey} onChange={(e) => {
                        if (e === "1") {
                            history.push("/index");
                        } else if (e === "2") {
                            history.push("/forum");
                        }
                    }} >
                        <TabPane tab="博客文章" key="1">
                        </TabPane>
                        <TabPane tab="问答论坛" key="2">
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{ width: '15%' }}></div>
                <div className={commonHeaderStyle.user}>
                    {
                        props.showSearch &&
                        <>
                            <div style={{ marginRight: '1rem', marginTop: '0.2rem' }}>
                                <Input defaultValue={searchContent} value={searchContent} onChange={(e) => setSearchContent(e.target.value)} placeholder="请输入你想搜索的内容" />
                            </div>
                            <div>
                                <Button style={{ marginTop: '0.2rem', marginRight: '1rem' }} type="primary" onClick={() => {
                                    event.emit("searchArticle", searchContent);
                                }}>搜索</Button>
                            </div>
                        </>
                    }
                    {
                        loginUser.id ? (
                            <Dropdown overlay={dropdownMenu}>
                                <div className={commonHeaderStyle.loginUser}>
                                    <div>
                                        <Avatar style={{ marginTop: '0.2rem' }} src={commonContext.serverUrl + '/common/photo/view?filename=' + loginUser.headPic} />
                                    </div>
                                    <div className={commonHeaderStyle.name}>
                                        <span>{loginUser.username || ''}</span>
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            <>
                                <div onClick={() => setLoginVisible(true)} className={commonHeaderStyle.button}>登录</div>
                                <div onClick={() => setRegisterVisible(true)} className={commonHeaderStyle.button}>注册</div>
                            </>
                        )
                    }

                </div>
            </div>
            <Modal
                destroyOnClose={true}
                maskClosable={false}
                title="登录"
                okText="确定"
                onOk={() => submitLogin()}
                onCancel={() => setLoginVisible(false)}
                cancelText="取消"
                visible={loginVisible}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="用户昵称">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户昵称！',
                                }
                            ],
                        })(<Input placeholder="请输入用户昵称" />)}
                    </Form.Item>
                    <Form.Item label="用户密码">
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户密码！',
                                }
                            ],
                        })(<Input type="password" placeholder="请输入用户密码" />)}
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                destroyOnClose={true}
                maskClosable={false}
                title="注册"
                okText="确定"
                onOk={() => submitRegister()}
                cancelText="取消"
                onCancel={() => setRegisterVisible(false)}
                visible={registerVisible}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="用户昵称">
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户昵称！',
                                }
                            ],
                        })(<Input placeholder="请输入用户昵称" />)}
                    </Form.Item>
                    <Form.Item label="用户密码">
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户密码！',
                                }
                            ],
                        })(<Input type="password" placeholder="请输入用户密码" />)}
                    </Form.Item>
                    <Form.Item label="手机号码">
                        {getFieldDecorator('phone', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入手机号码！',
                                }
                            ],
                        })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入手机号码" />)}
                    </Form.Item>
                    <Form.Item label="用户性别">
                        {getFieldDecorator('sex', {
                            initialValue: 3
                        })(
                            <Radio.Group>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                                <Radio value={3}>未知</Radio>
                            </Radio.Group>)}
                    </Form.Item>
                    <Form.Item label="个人简介">
                        {getFieldDecorator('info', {
                            initialValue: ''
                        })(
                            <TextArea rows={4} />)}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )

};

export default Form.create()(CommonHeader);
