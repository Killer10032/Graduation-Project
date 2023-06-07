import userStyle from './User.module.scss'
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import CommonFooter from "../../components/CommonFooter/CommonFooter";
import ArticleList from "../../components/ArticleList/ArticleList";
import {
    Card,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Radio,
    Upload,
    Skeleton,
    Avatar,
    List,
    Empty,
    Icon,
    Button,
    ConfigProvider,
    Pagination
} from "antd";
import {default as React, useContext, useEffect, useState} from "react";
import CommonContext from "../../context/CommonContext";
import {useHistory} from "react-router-dom";
import axios from "axios";
import zhCN from "antd/es/locale/zh_CN";
import event from "../../event";
const { confirm } = Modal;
const { TextArea } = Input;


const User = (props) => {

    const [attention, setAttention] = useState(false);
    const [loginUser, setLoginUser] = useState({headPic: 'common/no_image.jpg'});
    const [user, setUser] = useState({headPic: 'common/no_image.jpg'});
    const [searchContent, setSearchContent] = useState("");
    const [editUser, setEditUser] = useState({headPic: 'common/no_mage.jpg'});
    const [pagination, setPagination] = useState({page: 1, size: 5, total: 0});
    const [paginationChange, setPaginationChange] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [attentionList, setAttentionList] = useState([]);
    const [gapAttentionList, setGapAttentionList] = useState([]);
    const [allAttentionList, setAllAttentionList] = useState([]);
    const [viewList, setViewList] = useState([]);
    const [attentionTotal, setAttentionTotal] = useState(0);
    const [fanList, setFanList] = useState([]);
    const [gapFanList, setGapFanList] = useState([]);
    const [allFanList, setAllFanList] = useState([]);
    const [fanTotal, setFanTotal] = useState(0);
    const [checkQueryType, setCheckQueryType] = useState(1);
    const commonContext = useContext(CommonContext);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [articleList, setArticleList] = useState([]);
    const { getFieldDecorator, validateFields } = props.form;
    const history = useHistory();


    useEffect( () => {
        const { match: { params = '' } } = props;
        event.addListener('searchArticle',
            (data) => {
                setSearchContent(data);
            }
        );
        // 检查是否登录
        checkLogin();
        // 获取用户信息
        getUser(params.params);
        // 获取关注列表
        getAttentionList({page: 1, size: 8, param: {fromId: params.params}});
        // 获取粉丝列表
        getFanList({page: 1, size: 8, param: {toId: params.params}});
        // 获取全部关注列表
        getAllAttentionList({fromId: params.params});
        // 获取全部粉丝列表
        getAllFanList({toId: params.params});
        return () => { // 页面销毁时触发
        }
    }, [props.location.pathname, modalVisible, attention]);

    useEffect( () => {
        const { match: { params = '' } } = props;
        if(loginUser.id) {
            judgeAttention({fromId: loginUser.id, toId: params.params});
        }
        return () => { // 页面销毁时触发
        }
    }, [loginUser, props.location.pathname, modalVisible, attention]);

    useEffect( () => {
        if(modalTitle === '关注列表') {
            setViewList(allAttentionList);
        } else if (modalTitle === '粉丝列表') {
            setViewList(allFanList);
        }
        return () => { // 页面销毁时触发
        }
    }, [allAttentionList, allFanList]);


    useEffect( () => {
        const { match: { params = '' } } = props;
        // 获取文章数据
        getArticleList(params.params);
        return () => { // 页面销毁时触发
        }
    }, [paginationChange, searchContent, checkQueryType, props.location.pathname, modalVisible, attention, loginUser]);


    // 判断是否关注作者
    const judgeAttention = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/judge', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAttention(resp.data);
                } else {
                    setAttention(false);
                }
            })
            .catch(function (error) {
                message.error('网络错误，判断是否关注作者失败！');
            })
    };

    // 获取关注列表
    const getAttentionList = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/list', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAttentionList(resp.data.list);
                    let list = resp.data.list;
                    let gapList = [];
                    let gapNum = 0;
                    if(list.length % 4 != 0) {
                        gapNum = 4 - list.length % 4;
                    }
                    for(let i=0; i<gapNum; i++) {
                        gapList.push({});
                    }
                    setGapAttentionList(gapList);
                    setAttentionTotal(resp.data.total);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取关注列表失败！');
            })
    };

    // 获取全部关注列表
    const getAllAttentionList = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/all', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAllAttentionList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取全部关注列表失败！');
            })
    };

    // 获取全部粉丝列表
    const getAllFanList = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/all', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAllFanList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取全部粉丝列表失败！');
            })
    };

    // 获取粉丝列表
    const getFanList = (params) => {
        axios.post(commonContext.serverUrl + '/web/attention/list', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setFanList(resp.data.list);
                    let list = resp.data.list;
                    let gapList = [];
                    let gapNum = 0;
                    if(list.length % 4 != 0) {
                        gapNum = 4 - list.length % 4;
                    }
                    for(let i=0; i<gapNum; i++) {
                        gapList.push({});
                    }
                    setGapFanList(gapList);
                    setFanTotal(resp.data.total);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取粉丝列表失败！');
            })
    };

    // 获取文章数据
    const getArticleList = (userId) => {
        let data;
        if(loginUser.id === userId) {
            if(checkQueryType >=6 && checkQueryType <= 11) {
                data = {...pagination, param: {userId: userId, state: checkQueryType-5, title: searchContent, queryType: checkQueryType}};
            } else {
                data = {...pagination, param: {userId: userId, state: 0, title: searchContent, queryType: checkQueryType}};
            }
        } else {
            data = {...pagination, param: {userId: userId, title: searchContent, queryType: checkQueryType}};
        }

        axios.post(commonContext.serverUrl + '/web/article/list', data)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setArticleList(resp.data.list);
                    setPagination({...pagination, total: resp.data.total});
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取文章数据失败！');
            })
    };


    // 检查是否登录
    const checkLogin = () => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/check_login',{token: token})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if (global.tools.isNotEmpty(resp.data.token)) {
                        setLoginUser(resp.data);
                    }
                }
            })
            .catch(function (error) {
            })
    };

    // 修改个人信息
    const submitEditUser = () => {
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
            axios.post(commonContext.serverUrl+ '/web/user/update', {...values, headPic: editUser.headPic, id: editUser.id, token: loginUser.token})
                .then(function (response) {
                    let resp = response.data;
                    if(resp.code === 0){
                        message.success(resp.msg);
                        setUser(resp.data);
                        setEditModalVisible(false)
                        event.emit("refreshUser");
                    }else{
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                console.error(error);
                message.error("网络错误，修改个人信息失败~");
            })
        });
    };

    // 获取用户信息
    const getUser = (id) => {
        axios.post(commonContext.serverUrl + '/web/user/get',{id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setUser(resp.data);
                    setEditUser(resp.data)
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
            })
    };

    // 关注作者
    const attentionAuthor = () => {
        axios.post(commonContext.serverUrl + '/web/attention/add', {fromId: loginUser.id, toId: user.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    judgeAttention({fromId: loginUser.id, toId: user.id});
                    message.success(resp.msg);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，关注作者失败！');
            })
    };

    // 取消关注作者
    const removeAttentionAuthor = () => {
        axios.post(commonContext.serverUrl + '/web/attention/remove', {fromId: loginUser.id, toId: user.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    judgeAttention({fromId: loginUser.id, toId: user.id});
                    message.success(resp.msg);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，取消关注作者失败！');
            })
    };


    // 移除粉丝或关注
    const removeAttention = (params) => {
        confirm({
            title: '提示',
            content: '确定要移除这位用户吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                axios.post(commonContext.serverUrl + '/web/attention/remove', params)
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            setAttention(!attention); // 为了刷新
                            message.success("移除成功");
                        } else {
                            message.error(resp.msg);
                        }
                    })
                    .catch(function (error) {
                        message.error('网络错误，移除失败！');
                    })
            },
            onCancel() {
            },
        });

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

    // 上传图片
    const uploadProps = {
        name: 'photo',
        action: commonContext.serverUrl + '/common/photo/upload_photo',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                const response = info.fileList[info.fileList.length - 1].response;
                if(response.code === 0) {
                    setEditUser({...user, headPic: response.data});
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
        <>
            <Modal
                title={modalTitle}
                visible={modalVisible}
                okText="确定"
                onCancel={() => setModalVisible(false)}
                width={700}
                cancelButtonProps={{ style: { display: 'none' } }}
                maskClosable={false}
                onOk={() => setModalVisible(false)}
            >
                <ConfigProvider locale={zhCN}>
                    <List
                        style={{maxHeight: '25rem', overflow: 'auto'}}
                        itemLayout="horizontal"
                        dataSource={viewList}
                        renderItem={item => (
                            <>
                                {
                                    modalTitle === '粉丝列表' &&
                                    <List.Item
                                        actions={
                                            user.id === loginUser.id &&
                                            [<span style={{color: 'red'}} onClick={() => removeAttention({fromId: item.fromId, toId: loginUser.id})} key="list-loadmore-edit">移除</span>]
                                        }
                                    >
                                        <Skeleton loading={false} avatar title={false}  active>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar src={commonContext.serverUrl + '/common/photo/view?filename=' + item.fromUserDTO.headPic} />
                                                }
                                                title={<span style={{cursor: 'pointer'}} onClick={() => {
                                                    setModalVisible(false);
                                                    history.push("/user/" + item.fromId);
                                                }}>{item.fromUserDTO.username}</span>}
                                                description={"关注时间：" + item.createTime}
                                            />
                                        </Skeleton>
                                    </List.Item>
                                }
                                {
                                    modalTitle === '关注列表' &&
                                    <List.Item
                                        actions={
                                            user.id === loginUser.id &&
                                            [<span style={{color: 'red'}} onClick={() => removeAttention({fromId: loginUser.id, toId: item.toId})} key="list-loadmore-edit">移除</span>]
                                        }
                                    >
                                        <Skeleton loading={false} avatar title={false}  active>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar src={commonContext.serverUrl + '/common/photo/view?filename=' + item.toUserDTO.headPic} />
                                                }
                                                title={<span style={{cursor: 'pointer'}} onClick={() => {
                                                    setModalVisible(false);
                                                    history.push("/user/" + item.toId);
                                                }}>{item.toUserDTO.username}</span>}
                                                description={"关注时间：" + item.createTime}
                                            />
                                        </Skeleton>
                                    </List.Item>
                                }
                            </>
                        )}
                    />
                </ConfigProvider>
            </Modal>
            <CommonHeader tabKey="0" showSearch={true} />
            <div className={userStyle.top}>
                <div className={userStyle.left}></div>
                <div className={userStyle.content}>
                    <div className={userStyle.user}>
                        <div className={userStyle.summary}>
                            <div style={{width: '100%'}}>
                                <img src={commonContext.serverUrl + '/common/photo/view?filename=' + user.headPic} className={userStyle.image} alt="" />
                            </div>
                            <div className={userStyle.name}>
                                {user.username}
                            </div>

                            {
                                loginUser.id === user.id ? (
                                    <div className={userStyle.edit} onClick={() => {
                                        setEditModalVisible(true);
                                    }}>编辑</div>
                                ) : (
                                    <>
                                        {
                                            attention ? (
                                                <div onClick={() => removeAttentionAuthor()} className={userStyle.notAttention}>取消关注</div>
                                            ) : (
                                                <div onClick={() => attentionAuthor()} className={userStyle.attention}>关注TA</div>
                                            )
                                        }
                                    </>
                                )
                            }

                        </div>
                        <div className={userStyle.info}>
                            <div className={userStyle.first}>
                                <div>注册日期：{user.registerTime}</div>
                                {user.sex === 1 && <div>性别：男</div>}
                                {user.sex === 2 && <div>性别：女</div>}
                                {user.sex === 3 && <div>性别：未知</div>}
                                <div>手机号：{user.phone}</div>
                            </div>
                            <div className={userStyle.second}>
                                <div>个人简介</div>
                                <div style={{marginTop: '0.3rem', fontSize: '0.9rem'}}>{user.info}</div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={userStyle.right}></div>
            </div>
            <div className={userStyle.main}>
                <div className={userStyle.left}></div>
                <div className={userStyle.detail}>
                    <div className={userStyle.article}>
                        <div className={userStyle.category}>
                            <div onClick={() => setCheckQueryType(1)} className={checkQueryType === 1 ? userStyle.selectItem : userStyle.item}>全部文章</div>
                            <div onClick={() => setCheckQueryType(2)} className={checkQueryType === 2 ? userStyle.selectItem : userStyle.item}>博客文章</div>
                            <div onClick={() => setCheckQueryType(3)} className={checkQueryType === 3 ? userStyle.selectItem : userStyle.item}>问答文章</div>
                            <div onClick={() => setCheckQueryType(4)} className={checkQueryType === 4 ? userStyle.selectItem : userStyle.item}>点赞文章</div>
                            <div onClick={() => setCheckQueryType(5)} className={checkQueryType === 5 ? userStyle.selectItem : userStyle.item}>收藏文章</div>
                            {
                                loginUser.id === user.id &&
                                    <>
                                        <div onClick={() => setCheckQueryType(6)} className={checkQueryType === 6 ? userStyle.selectItem : userStyle.item}>待审核</div>
                                        <div onClick={() => setCheckQueryType(7)} className={checkQueryType === 7 ? userStyle.selectItem : userStyle.item}>未解决</div>
                                        <div onClick={() => setCheckQueryType(8)} className={checkQueryType === 8 ? userStyle.selectItem : userStyle.item}>已解决</div>
                                        <div onClick={() => setCheckQueryType(9)} className={checkQueryType === 9 ? userStyle.selectItem : userStyle.item}>审核通过</div>
                                        <div onClick={() => setCheckQueryType(10)} className={checkQueryType === 10 ? userStyle.selectItem : userStyle.item}>审核不通过</div>
                                        <div onClick={() => setCheckQueryType(11)} className={checkQueryType === 11 ? userStyle.selectItem : userStyle.item}>草稿</div>
                                    </>
                            }

                        </div>
                    </div>
                    <ArticleList showEdit={loginUser.id === user.id} articleList={articleList}/>
                    <div className={userStyle.pagination}>
                        <ConfigProvider locale={zhCN}>
                            <Pagination pageSizeOptions={['5', '10', '20']} showSizeChanger={true}
                                        onShowSizeChange={(page, size) => {
                                            setPagination({page, size});
                                            setPaginationChange(!paginationChange);
                                        }}
                                        onChange={(page, size) => {
                                            setPagination({page, size});
                                            setPaginationChange(!paginationChange);
                                        }}
                                        showTotal={(total, range) => `总共 ${total} 条`} current={pagination.page} pageSize={pagination.size} total={pagination.total} />
                        </ConfigProvider>
                    </div>
                </div>
                <div className={userStyle.side}>
                    <div className={userStyle.attentionList}>
                        <Card title={'关注（' + attentionTotal + "）" } extra={<span onClick={() => {
                            setModalVisible(true);
                            setViewList(allAttentionList);
                            setModalTitle("关注列表")
                        }} style={{color: '#28a745', cursor: 'pointer'}}>更多</span>}>
                            <div className={userStyle.attentionUser}>
                                {
                                    attentionList.length > 0 ? (
                                        <>
                                            {
                                                attentionList.map((item, index) => {
                                                    return (
                                                        <div key={index} className={userStyle.user}  onClick={() => history.push("/user/" + item.toId)}>
                                                            <div>
                                                                <img src={commonContext.serverUrl + "/common/photo/view?filename=" + item.toUserDTO.headPic} alt="" className={userStyle.image} />
                                                            </div>
                                                            <div className={userStyle.name}>{item.toUserDTO.username}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                gapAttentionList.map((item, index) => {
                                                    return (
                                                        <div style={{visibility: 'hidden'}} key={index} className={userStyle.user}>
                                                            <div>
                                                                <img src={commonContext.serverUrl + "/common/photo/view?filename=common/no_image.jpg"} alt="" className={userStyle.image} />
                                                            </div>
                                                            <div className={userStyle.name}></div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        <Empty style={{width: '100%'}} description="暂无数据" />
                                    )
                                }
                            </div>
                        </Card>
                    </div>
                    <div className={userStyle.attentionList} style={{marginTop: '1rem'}}>
                        <Card title={'粉丝（' + fanTotal + "）" } extra={<span onClick={() => {
                            setModalVisible(true);
                            setViewList(allFanList);
                            setModalTitle("粉丝列表")
                        }} style={{color: '#28a745', cursor: 'pointer'}}>更多</span>}>
                            <div className={userStyle.attentionUser}>
                                {
                                    fanList.length > 0 ? (
                                        <>
                                            {
                                                fanList.map((item, index) => {
                                                    return (
                                                        <div key={index} className={userStyle.user} onClick={() => history.push("/user/" + item.fromId)}>
                                                            <div>
                                                                <img src={commonContext.serverUrl + "/common/photo/view?filename=" + item.fromUserDTO.headPic} alt="" className={userStyle.image} />
                                                            </div>
                                                            <div className={userStyle.name}>{item.fromUserDTO.username}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                gapFanList.map((item, index) => {
                                                    return (
                                                        <div style={{visibility: 'hidden'}} key={index} className={userStyle.user}>
                                                            <div>
                                                                <img src={commonContext.serverUrl + "/common/photo/view?filename=common/no_image.jpg"} alt="" className={userStyle.image} />
                                                            </div>
                                                            <div className={userStyle.name}></div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        <Empty style={{width: '100%'}} description="暂无数据" />
                                    )
                                }
                            </div>
                        </Card>
                    </div>
                </div>
                <div className={userStyle.right}></div>
            </div>
            <CommonFooter />
            <Modal
                maskClosable={false}
                title="编辑个人信息"
                okText="确定"
                destroyOnClose={true}
                onOk={() => submitEditUser()}
                cancelText="取消"
                onCancel={() => {
                    setEditModalVisible(false)
                }}
                visible={editModalVisible}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="用户昵称">
                        {getFieldDecorator('username', {
                            initialValue: editUser.username,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户昵称！',
                                }
                            ],
                        })(<Input placeholder="请输入用户昵称"/>)}
                    </Form.Item>
                    <Form.Item label="用户头像">
                        <img style={{width: '90px', height: '60px'}} src={commonContext.serverUrl + "/common/photo/view?filename=" + editUser.headPic} alt="" />
                        <Upload {...uploadProps} showUploadList={false}>
                            <Button type="primary" style={{marginLeft: '10px'}}>
                                <Icon type="upload" /> 上传头像
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="用户密码">
                        {getFieldDecorator('password', {
                            initialValue: editUser.password,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户密码！',
                                }
                            ],
                        })(<Input type="password" placeholder="请输入用户密码"/>)}
                    </Form.Item>
                    <Form.Item label="手机号码">
                        {getFieldDecorator('phone', {
                            initialValue: editUser.phone,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入手机号码！',
                                }
                            ],
                        })(<InputNumber style={{width: '100%'}} min={0} placeholder="请输入手机号码"/>)}
                    </Form.Item>
                    <Form.Item label="用户性别">
                        {getFieldDecorator('sex', {
                            initialValue: editUser.sex
                        })(
                            <Radio.Group>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                                <Radio value={3}>未知</Radio>
                            </Radio.Group>)}
                    </Form.Item>
                    <Form.Item label="个人简介">
                        {getFieldDecorator('info', {
                            initialValue: editUser.info
                        })(
                            <TextArea rows={4} />)}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )

};

export default Form.create()(User);
