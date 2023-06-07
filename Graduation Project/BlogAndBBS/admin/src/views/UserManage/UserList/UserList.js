import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, Upload, Icon, InputNumber } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import event from "../../../event";
import axios from "axios";
import userStyle from './UserList.module.scss';
import {connect} from "react-redux";
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
class UserList extends Component{

    state = {
        columns: [
            {title: '用户编号', dataIndex: 'id', width: '150px'},
            {title: '用户昵称', dataIndex: 'username', width: '100px'},
            {title: '用户头像', dataIndex: 'headPic', width: '100px', render: headPic => {
                const { serverUrl } = this.props;
                return ( <img style={{width: '90px', height: '60px'}} src={serverUrl + "/common/photo/view?filename=" + headPic} alt="" /> )
            }},
            {title: '手机号码', dataIndex: 'phone', width: '150px'},
            {title: '注册时间', dataIndex: 'registerTime', width: '200px'},
            {title: '性别', dataIndex: 'sex', width: '80px', render: text => {
                if(text === 1) {
                    return "男";
                } else if (text === 2) {
                    return "女";
                } else if (text === 3) {
                    return "未知";
                }
            }},
            {title: '用户角色',  dataIndex: 'roleId', width: '100px', render: text => {
                if(text === 1) {
                    return "普通用户";
                } else if (text === 2) {
                    return "管理员";
                }
            }},
            {title: '个人简介', dataIndex: 'info', width: '200px'}],
        tableData: [],
        paginationProps: {
            current: 1, //当前页码
            pageSize: 5, // 每页数据条数
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: function(total) {
                return `总共有 ${total} 条数据`;
            },
            total: 0, // 总条数
            onChange: current => this.handlePageChange(current),
            onShowSizeChange: (current, pageSize) => this.handleSizeChange(current, pageSize)
        },
        searchParams: {
            username: '',
            roleId: 0
        },
        modal: {
            visible: false,
            title: ""
        },
        loginUser: {},
        user: {
            id: "",
            username: "",
            password: "",
            headPic: "",
            phone: "",
            sex: 3,
            info: '',
            roleId: 1,
            token: ""
        },
        selectRows: []
    };


    checkLogin() {
        const _this = this;
        const { serverUrl } = _this.props;
        let token = global.tools.getLoginAdmin();
        if (global.tools.isEmpty(token)) {
            _this.props.history.push('/login');
        }else{
            // 后端token验证
            return axios.post(serverUrl+ '/admin/user/check_login',{token: token})
                .then(function (response) {
                    let resp = response.data;
                    if(resp.code === 0){
                        if (global.tools.isEmpty(resp.data.token)) {
                            _this.props.history.push('/login');
                        } else {
                            _this.setState({user: resp.data});
                        }
                    }else{
                        _this.props.history.push('/login');
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                _this.props.history.push('/login');
            })
        }
    }

    // 页码变化
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getUserList();
        });
    }

    // 每页条数变化
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getUserList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("用户管理/用户列表");
        changeSelectKey(["2-1"]);
        changeOpenKey(["2"]);
        await this.checkLogin();
        await this.getUserList();
    };

    getUserList() {
        const { serverUrl } = this.props;
        const { paginationProps, searchParams } = this.state;
        const data = {
            page: paginationProps.current,
            size: paginationProps.pageSize,
            param: {
                username: searchParams.username,
                roleId: searchParams.roleId
            }
        };
        const _this = this;
        return axios.post(serverUrl+ '/admin/user/list', data)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    let data = resp.data.list;
                    data.forEach((e, i) => {
                       e.key = i;
                    });
                    _this.setState({tableData: data});
                    // 获取分页数据
                    let page = {
                        current: resp.data.page,
                        pageSize: resp.data.size,
                        total: resp.data.total
                    };
                    _this.setState({paginationProps: page});
                }else{
                    message.error("获取用户数据失败~");
                }
            }).catch(function (error) {
            console.error(error);
            message.error("获取用户数据失败~");
        })
    }

    // 搜索内容双向绑定实现
    changeSearchInput(type, e){
        // type:对象成员  e:变化值
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.searchParams, {
            [type]: e
        });
        this.setState({
            searchParams: target
        })
    }

    // 搜索
    searchUserList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getUserList();
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.setState({selectRows: selectedRows})
        }
    };

    // 打开添加会话框
    openAddModal() {
        this.setState({user: {sex: 3, roleId: 1}, modal: {visible: true, title: "添加用户信息"}});
    }

    // 会话框表单内容双向绑定实现
    changeModalInput(type, e){
        // type:对象成员  e:变化值
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.user, {
            [type]: e
        });
        this.setState({
            user: target
        })
    }

    // 点击确定
    handleOk() {
        const { user } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/user/save', user)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    _this.setState({modal: {visible: false}, selectRows: []});
                    _this.rowSelection.selectedRowKeys = [];
                    _this.getUserList();
                    event.emit("refreshUser")
                }else{
                    message.error(resp.msg);
                }
            }).catch(function (error) {
            console.error(error);
            message.error("网络错误，保存用户信息失败~");
        })
    }


    // 删除用户信息
    deleteUser() {
        const { selectRows } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        if(selectRows.length === 0) {
            message.warning("请至少选择一条数据进行删除~");
            return false;
        }
        let selectIds = [];
        selectRows.forEach( e => {
            selectIds.push(e.id);
        });
        const ids = selectIds.join(",");
        confirm({
            title: '提示',
            content: '确定删除这' + selectRows.length + '条数据吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                axios.post(serverUrl+ '/admin/user/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchUserList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchUserList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("网络错误，删除用户信息失败~");
                })
            },
            onCancel() {
            }
        });

    }

    // 打开修改会话框
    openEditModal() {
        const { selectRows, user } = this.state;
        if(selectRows.length !== 1) {
            message.warning("请选择一条数据进行修改~")
            return false;
        }
        this.setState({user: {...selectRows[0], token: user.token }, modal: {visible: true, title: "修改用户信息"}});
    }



    render() {
        const { columns, tableData, paginationProps, searchParams, modal, user } = this.state;
        const { serverUrl } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const _this = this;
        const props = {
            name: 'photo',
            action: serverUrl + '/common/photo/upload_photo',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status === 'done') {
                    const response = info.fileList[info.fileList.length - 1].response;
                    if(response.code === 0) {
                        _this.setState({user: {...user, headPic: response.data}});
                        message.success(response.msg);
                    } else {
                        message.error(response.msg);
                    }
                }
                if (info.file.status === 'error') {
                    message.error("网络错误，上传图片失败！");
                }
            }
        };
        return (
            <React.Fragment>
                <Modal
                    title={modal.title}
                    visible={modal.visible}
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    onOk={this.handleOk.bind(this)}
                    onCancel={() => this.setState({modal: {visible: false}})}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="用户昵称">
                            <Input placeholder="请输入用户昵称" onChange={this.changeModalInput.bind(this, 'username')} defaultValue={user.username} value={user.username}/>
                        </Form.Item>
                        <Form.Item label="用户头像">
                            <img style={{width: '90px', height: '60px'}} src={user.headPic ? serverUrl + "/common/photo/view?filename=" + user.headPic : serverUrl + "/common/photo/view?filename=common/no_image.jpg"} alt="" />
                            <Upload {...props} showUploadList={false}>
                                <Button type="primary" style={{marginLeft: '10px'}}>
                                    <Icon type="upload" /> 上传头像
                                </Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label="用户密码">
                            <Input.Password placeholder="请输入用户密码" onChange={this.changeModalInput.bind(this, 'password')} defaultValue={user.password} value={user.password}/>
                        </Form.Item>
                        <Form.Item label="用户性别">
                            <Select defaultValue={3} value={user.sex} style={{width: '100%'}} onChange={this.changeModalInput.bind(this, 'sex')}>
                                <Option value={1}>男</Option>
                                <Option value={2}>女</Option>
                                <Option value={3}>未知</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="手机号码">
                            <InputNumber style={{width: '100%'}} min={0} placeholder="请输入手机号码" onChange={this.changeModalInput.bind(this, 'phone')} defaultValue={user.phone} value={user.phone}/>
                        </Form.Item>
                        <Form.Item label="所属角色">
                            <Select defaultValue={1} value={user.roleId} style={{width: '100%'}} onChange={this.changeModalInput.bind(this, 'roleId')}>
                                <Option value={1}>普通用户</Option>
                                <Option value={2}>管理员</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="个人简介">
                            <TextArea placeholder="请输入个人简介" onChange={this.changeModalInput.bind(this, 'info')} defaultValue={user.info} value={user.info} rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>
                <div className={userStyle.user_button} style={{width: '100%', height: '10%'}}>
                    <Button icon="plus" className={userStyle.add} onClick={this.openAddModal.bind(this)}>
                        添加
                    </Button>
                    <Button type="edit" icon="edit" className={userStyle.edit} onClick={this.openEditModal.bind(this)}>
                        修改
                    </Button>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteUser.bind(this)}>
                        删除
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'username')} defaultValue={searchParams.username} value={searchParams.username} placeholder="请输入用户昵称" style={{width: '200px', margin: '0 10px'}} />
                    <Select defaultValue={0} style={{width: '200px', margin: '0 10px'}} onChange={this.changeSearchInput.bind(this, 'roleId')}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>普通用户</Option>
                        <Option value={2}>管理员</Option>
                    </Select>
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchUserList.bind(this)}>
                        搜索
                    </Button>
                </div>
                <div style={{width: '100%', height: '90%'}}>
                    <ConfigProvider locale={zhCN}>
                        <Table scroll={{ x: '100%', y: 400}} rowSelection={this.rowSelection} columns={columns} dataSource={tableData} pagination={paginationProps}/>
                    </ConfigProvider>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    menuName: state.menuName,
    selectKey: state.selectKey,
    openKey: state.openKey,
    serverUrl: state.serverUrl
});

const mapDispatchToProps = dispatch => ({
    changeName: name => dispatch({type:"changeName", name}),
    changeSelectKey: selectKey => dispatch({type:"changeSelectKey", selectKey}),
    changeOpenKey: openKey => dispatch({type:"changeOpenKey", openKey})
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
