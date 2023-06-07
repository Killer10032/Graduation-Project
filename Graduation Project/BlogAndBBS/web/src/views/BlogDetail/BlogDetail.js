import blogDetailStyle from './BlogDetail.module.scss'
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import CommonFooter from "../../components/CommonFooter/CommonFooter";
import {Card, Input, Icon, Pagination, message, Button, ConfigProvider, Modal, Form, Empty} from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import pickImg from "../../assets/pick.png";
import 'highlight.js/styles/base16/onedark.css';
import {default as React, useContext, useEffect, useState} from "react";
import axios from "axios";
import CommonContext from "../../context/CommonContext";
import {useHistory} from "react-router-dom";
const { confirm } = Modal;

const BlogDetail = (props) => {

    const [article, setArticle] = useState({ contentMarkdown: '', categoryDTO: {}, userDTO: {headPic: 'common/no_image.jpg'}});
    const [pagination, setPagination] = useState({page: 1, size: 5, total: 0});
    const [paginationChange, setPaginationChange] = useState(false);
    const [attention, setAttention] = useState(false);
    const [content, setContent] = useState("");
    const [total, setTotal] = useState(0);
    const [replyContent, setReplyContent] = useState("");
    const [like, setLike] = useState(false);
    const [collect, setCollect] = useState(false);
    const [replyVisible, setReplyVisible] = useState(false);
    const [comment, setComment] = useState({ toUser: {} });
    const [commentList, setCommentList] = useState([]);
    const [authorArticleList, setAuthorArticleList] = useState([]);
    const [loginUser, setLoginUser] = useState({headPic: 'common/no_image.jpg'});
    const commonContext = useContext(CommonContext);
    const history = useHistory();


    useEffect(() => {
        const { match: { params = '' } } = props;
        // 检查是否登录
        checkLogin(params.params);
        // 根据文章id获取文章详情信息
        getArticleDetail(params.params, '/web/article/view');
        // 获取作者的其他文章
        getAuthorArticleList(params.params);
        return () => { // 页面销毁时触发
        }
    }, [props.location.pathname]);


    useEffect( () => {
        if(loginUser.id && article.userId) {
            judgeAttention({fromId: loginUser.id, toId: article.userId});
        }
        return () => { // 页面销毁时触发
        }
    }, [loginUser, article, props.location.pathname]);

    useEffect( () => {
        const { match: { params = '' } } = props;
        // 分页变化时候获取评论数据
        getCommentList([], params.params);
        return () => { // 页面销毁时触发
        }
    }, [paginationChange, props.location.pathname]);


    // 根据文章id获取文章详情信息
    const getArticleDetail = (id, url) => {
         axios.post(commonContext.serverUrl + url, {id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setArticle(resp.data);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取文章详情数据失败！');
            })
    };

    // 获取作者的其他文章
    const getAuthorArticleList = (id) => {
        axios.post(commonContext.serverUrl + '/web/article/author', {id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setAuthorArticleList(resp.data);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取作者的其他文章数据失败！');
            })
    };


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

    // 判断是否喜欢文章
    const judgeLike = (params) => {
        axios.post(commonContext.serverUrl + '/web/like/judge', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setLike(resp.data);
                } else {
                    setLike(false);
                }
            })
            .catch(function (error) {
                message.error('网络错误，判断是否喜欢文章失败！');
            })
    };

    // 判断是否收藏文章
    const judgeCollect = (params) => {
        axios.post(commonContext.serverUrl + '/web/collect/judge', params)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setCollect(resp.data);
                } else {
                    setCollect(false);
                }
            })
            .catch(function (error) {
                message.error('网络错误，判断是否收藏文章失败！');
            })
    };

    // 获取评论数据总数
    const countCommentTotal = (articleId) => {
         axios.post(commonContext.serverUrl + '/web/comment/total', {articleId})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setTotal(resp.data);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取评论数据总数失败！');
            })
    };

    // 点赞文章
    const likeArticle = () => {
        axios.post(commonContext.serverUrl + '/web/like/like', {articleId: article.id, userId: loginUser.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    setLike(true);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，点赞文章失败！');
            })
    };

    // 关注作者
    const attentionAuthor = () => {
        axios.post(commonContext.serverUrl + '/web/attention/add', {fromId: loginUser.id, toId: article.userId})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    judgeAttention({fromId: loginUser.id, toId: article.userId});
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
        axios.post(commonContext.serverUrl + '/web/attention/remove', {fromId: loginUser.id, toId: article.userId})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    judgeAttention({fromId: loginUser.id, toId: article.userId});
                    message.success(resp.msg);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，取消关注作者失败！');
            })
    };

    // 采纳评论
    const pickComment = (id) => {
        confirm({
            title: '提示',
            content: '确定采纳这条评论吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                axios.post(commonContext.serverUrl + '/web/comment/pick', {id})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            getArticleDetail(article.id, '/web/article/get');
                            getCommentList([], article.id);
                        } else {
                            message.error(resp.msg);
                        }
                    })
                    .catch(function (error) {
                        message.error('网络错误，采纳评论失败！');
                    })
            },
            onCancel() {
            },
        });
    };

    // 收藏文章
    const collectArticle = () => {
        axios.post(commonContext.serverUrl + '/web/collect/add', {articleId: article.id, userId: loginUser.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    setCollect(true);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，收藏文章失败！');
            })
    };

    // 取消点赞文章
    const unlikeArticle = () => {
        axios.post(commonContext.serverUrl + '/web/like/unlike', {articleId: article.id, userId: loginUser.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    setLike(false);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，取消点赞文章失败！');
            })
    };

    // 取消收藏文章
    const removeCollectArticle = () => {
        axios.post(commonContext.serverUrl + '/web/collect/remove', {articleId: article.id, userId: loginUser.id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    setCollect(false);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，取消收藏文章失败！');
            })
    };

    // 获取评论数据
    const getCommentList = (oldCommentList, articleId) => {
        return axios.post(commonContext.serverUrl + '/web/comment/list', {...pagination, param: {articleId}})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if(oldCommentList.length > 0) {
                        let newCommentList = resp.data.list;
                        newCommentList.forEach((item, index) => {
                            item.collapse = oldCommentList[index].collapse;
                        });
                        setCommentList(JSON.parse(JSON.stringify(newCommentList)));
                    } else {
                        setCommentList(resp.data.list);
                    }
                    setPagination({...pagination, total: resp.data.total});
                    countCommentTotal(articleId);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取评论数据失败！');
            })
    };

    // 检查是否登录
    const checkLogin = (articleId) => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/check_login',{token: token})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if (global.tools.isNotEmpty(resp.data.token)) {
                        setLoginUser(resp.data);
                        judgeLike({articleId: articleId, userId: resp.data.id});
                        judgeCollect({articleId: articleId, userId: resp.data.id})
                    }
                }
            })
            .catch(function (error) {
            })
    };

    // 发表或回复评论信息
    const submitComment = (type, parentId, toId, submitContent) => {
        let data = {
            content: submitContent,
            fromId: loginUser.id,
            articleId: article.id,
            type,
            parentId,
            toId
        };
        axios.post(commonContext.serverUrl + '/web/comment/submit', data)
            .then( (response) => {
                let resp = response.data;
                if(resp.code === 0){
                    setContent('');
                    setReplyVisible(false);
                    setReplyContent("");
                    message.success(resp.msg);
                    let newCommentList = JSON.parse(JSON.stringify(commentList));
                    if(type === 1) {
                        newCommentList.unshift({fromUserDTO: {headPic: 'common/no_image.jpg'}});
                    }
                    getCommentList(newCommentList, article.id);
                    getArticleDetail(article.id, '/web/article/get');
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，发表评论失败！');
            })
    };

    // 删除评论信息
    const deleteComment = (id) => {
        confirm({
            title: '提示',
            content: '确定删除评论吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                axios.post(commonContext.serverUrl + '/web/comment/delete', {id})
                    .then( (response) => {
                        let resp = response.data;
                        if(resp.code === 0){
                            let newCommentList = JSON.parse(JSON.stringify(commentList));
                            newCommentList = newCommentList.filter(item => item.id !== id);
                            getCommentList(newCommentList, article.id);
                            // 根据文章id获取文章详情信息
                            getArticleDetail(article.id, '/web/article/get');
                        } else {
                            message.error(resp.msg);
                        }
                    })
                    .catch(function (error) {
                        message.error('网络错误，删除评论失败！');
                    })
            },
            onCancel() {
            },
        });
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 19 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };


    return (
        <>
            <Modal
                maskClosable={false}
                title={"回复 " + comment.toUser.username + "："}
                onCancel={() => setReplyVisible(false)}
                okText="确定"
                onOk={() => submitComment(2, comment.parentId, comment.toUser.id, replyContent)}
                cancelText="取消"
                visible={replyVisible}
            >
                <Form {...formItemLayout} >
                    <Form.Item label="评论内容">
                        <Input.TextArea placeholder="请输入评论内容" defaultValue={replyContent} value={replyContent} onChange={ e => setReplyContent(e.target.value) } autoSize={{ minRows: 4 }}/>
                    </Form.Item>
                </Form>
            </Modal>
            <CommonHeader showSearch={false} />
            <div className={blogDetailStyle.container}>
                <div className={blogDetailStyle.left}></div>
                <div className={blogDetailStyle.content}>
                    <div className={blogDetailStyle.blog}>
                        <div className={blogDetailStyle.title}>{article.title}</div>
                        <div className={blogDetailStyle.info}>
                            <span style={{marginRight: '0.5rem'}}>
                                <img src={commonContext.serverUrl + '/common/photo/view?filename=' + article.userDTO.headPic} style={{marginBottom: '0.2rem'}} alt='' width='15' height='15'/>
                            </span>
                            <span className={blogDetailStyle.username} onClick={() => history.push("/user/" + article.userId)}>
                                {article.userDTO.username}
                            </span>
                            <span title="发布时间" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="history" />
                            </span>
                            <span>
                                {article.createTime}
                            </span>
                            <span title="浏览数" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="eye" />
                            </span>
                            <span>
                               {article.viewNum}
                            </span>
                            <span title="点赞数" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="like" />
                            </span>
                            <span>
                                {article.likeNum}
                            </span>
                            <span title="评论数" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="message" />
                            </span>
                            <span>
                                {article.commentNum}
                            </span>
                            <span title="收藏数" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="heart" />
                            </span>
                            <span>
                                {article.collectNum}
                            </span>
                            <span title="分类" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="appstore" />
                            </span>
                            <span>
                                {article.categoryDTO.name}
                            </span>
                            <span title="标签" style={{margin: '0 0.5rem 0 1.5rem'}}>
                                <Icon type="tag" />
                            </span>
                            {
                                article.tagDTOList && article.tagDTOList.map((tag, tagIndex) => {
                                    return (
                                        <span key={tagIndex} style={{marginRight: '0.5rem'}}>
                                            {tag.name}
                                        </span>
                                    )
                                })
                            }
                        </div>
                        <div className={blogDetailStyle.operate}>
                            {
                                collect ? (
                                    <div title="取消收藏" onClick={() => removeCollectArticle()}><Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /></div>
                                ) : (
                                    <div title="收藏" onClick={() => collectArticle()}><Icon type="heart" /></div>
                                )
                            }
                            {
                                like ? (
                                    <div title="取消点赞" onClick={() => unlikeArticle()}><Icon type="like" theme="twoTone" twoToneColor="#eb2f96" /></div>
                                ) : (
                                    <div title="点赞" onClick={() => likeArticle()}><Icon type="like" /></div>
                                )
                            }
                        </div>
                        <div className={blogDetailStyle.text}>
                            <div className="for-container">
                                <div className="for-markdown-preview">
                                    <div style={{padding: '1.5rem'}}  dangerouslySetInnerHTML={{
                                        __html: article.contentHtml
                                    }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={blogDetailStyle.footer}>
                            最后一次编辑于：{article.updateTime}
                        </div>

                    </div>
                    <div className={blogDetailStyle.submitComment}>
                        <div><img src={commonContext.serverUrl + '/common/photo/view?filename=' + loginUser.headPic} className={blogDetailStyle.image} alt="" /></div>
                        <div style={{width: '90%'}}><Input.TextArea placeholder="请输入评论内容" defaultValue={content} value={content} onChange={ e => setContent(e.target.value) } autoSize={{ minRows: 1 }}/></div>
                        <div style={{width: '10%', marginLeft: '1rem'}}>
                            <Button onClick={() => submitComment(1, '', '', content)} type="primary">发布</Button>
                        </div>
                    </div>
                    <div className={blogDetailStyle.commentList}>

                        {
                            commentList.map((item, index) => {
                                return (
                                    <div key={index} className={blogDetailStyle.comment}>
                                        {
                                            item.pick === 2 &&
                                            <div className={blogDetailStyle.pick}>
                                                <img src={pickImg} alt="" style={{width:'50%'}} />
                                            </div>
                                        }
                                        <div><img src={commonContext.serverUrl + '/common/photo/view?filename=' +item.fromUserDTO.headPic} className={blogDetailStyle.image} alt="" /></div>
                                        <div style={{width: '100%', borderBottom: '1px solid #00000020'}}>
                                            <div className={blogDetailStyle.username}>{item.fromUserDTO.username}</div>
                                            <div className={blogDetailStyle.content}>{item.content}</div>
                                            <div className={blogDetailStyle.footer}>
                                                <div>
                                                    <span>{item.createTime}</span>
                                                    {
                                                        item.childrenList && item.childrenList.length > 0 &&
                                                        (
                                                            <>
                                                                {
                                                                    item.collapse ? (
                                                                        <span onClick={() => {
                                                                            let newCommentList = commentList;
                                                                            newCommentList[index].collapse = !newCommentList[index].collapse;
                                                                            setCommentList(JSON.parse(JSON.stringify(newCommentList)));
                                                                        }} style={{cursor: 'pointer', color: '#40a9ff', marginLeft: '1rem'}}>展开{item.childrenList.length}条回复</span>
                                                                    ) : (
                                                                        <span onClick={() => {
                                                                            let newCommentList = commentList;
                                                                            newCommentList[index].collapse = !newCommentList[index].collapse;
                                                                            setCommentList(JSON.parse(JSON.stringify(newCommentList)));
                                                                        }} style={{cursor: 'pointer', color: '#40a9ff', marginLeft: '1rem'}}>折叠回复</span>
                                                                    )
                                                                }

                                                            </>
                                                        )
                                                    }
                                                </div>

                                                <div className={blogDetailStyle.button} >
                                                    {
                                                        article.type === 2 && article.state === 2 && article.userId === loginUser.id &&
                                                        <div style={{cursor: 'pointer'}} onClick={() => pickComment(item.id)}>
                                                            <span style={{marginRight: '0.3rem'}}>
                                                                <Icon type="smile" />
                                                            </span>
                                                            <span style={{fontSize: '0.75rem', marginRight: '0.5rem'}}>
                                                                采纳
                                                            </span>
                                                        </div>
                                                    }
                                                    {
                                                        loginUser.id === item.fromUserDTO.id &&
                                                        <div style={{cursor: 'pointer'}} onClick={() => deleteComment(item.id)}>
                                                            <span style={{marginRight: '0.3rem'}}>
                                                                <Icon type="delete" />
                                                            </span>
                                                            <span style={{fontSize: '0.75rem', marginRight: '0.5rem'}}>
                                                                删除
                                                            </span>
                                                        </div>
                                                    }
                                                    <div style={{cursor: 'pointer'}} onClick={() => {
                                                        setComment({...comment, parentId: item.id, toUser: item.fromUserDTO});
                                                        setReplyVisible(true);
                                                    }}>
                                                        <span style={{marginRight: '0.3rem'}}>
                                                            <Icon type="message" />
                                                        </span>
                                                        <span style={{fontSize: '0.75rem'}}>
                                                            回复
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                            {
                                                !item.collapse &&
                                                <div className={blogDetailStyle.reply}>
                                                    {
                                                        item.childrenList && item.childrenList.map((child, childIndex) => {
                                                            return (
                                                                <div key={childIndex} className={blogDetailStyle.comment}>
                                                                    {
                                                                        child.pick === 2 &&
                                                                        <div className={blogDetailStyle.pick}>
                                                                            <img src={pickImg} alt="" style={{width:'50%'}} />
                                                                        </div>
                                                                    }
                                                                    <div><img src={commonContext.serverUrl + '/common/photo/view?filename=' +child.fromUserDTO.headPic} className={blogDetailStyle.image} alt="" /></div>
                                                                    <div style={{width: '100%'}}>
                                                                        <div className={blogDetailStyle.username}><span>{child.fromUserDTO.username}</span><span style={{margin: '0 0.5rem'}}>回复</span><span>{child.toUserDTO.username}</span></div>
                                                                        <div className={blogDetailStyle.content}>{child.content}</div>
                                                                        <div className={blogDetailStyle.footer}>
                                                                            <div>{child.createTime}</div>

                                                                            <div className={blogDetailStyle.button} >
                                                                                {
                                                                                    article.type === 2 && article.state === 2 && article.userId === loginUser.id &&
                                                                                    <div style={{cursor: 'pointer'}} onClick={() => pickComment(child.id)}>
                                                                                        <span style={{marginRight: '0.3rem'}}>
                                                                                            <Icon type="smile" />
                                                                                        </span>
                                                                                        <span style={{fontSize: '0.75rem', marginRight: '0.5rem'}}>
                                                                                            采纳
                                                                                        </span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    loginUser.id === child.fromUserDTO.id &&
                                                                                    <div style={{cursor: 'pointer'}} onClick={() => deleteComment(child.id)}>
                                                                                        <span style={{marginRight: '0.3rem'}}>
                                                                                            <Icon type="delete" />
                                                                                        </span>
                                                                                        <span style={{fontSize: '0.75rem', marginRight: '0.5rem'}}>
                                                                                            删除
                                                                                        </span>
                                                                                    </div>
                                                                                }
                                                                                <div style={{cursor: 'pointer'}} onClick={() => {
                                                                                    setComment({...comment, parentId: item.id, toUser: child.fromUserDTO});
                                                                                    setReplyVisible(true);
                                                                                }}>
                                                                                    <span style={{marginRight: '0.3rem'}}>
                                                                                        <Icon type="message" />
                                                                                    </span>
                                                                                    <span style={{fontSize: '0.75rem'}}>
                                                                                        回复
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                            }

                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className={blogDetailStyle.pagination}>
                        <ConfigProvider locale={zhCN}>
                            <Pagination showTotal={() => '总共 ' + total + ' 条'} current={pagination.page}
                                        onChange={(page, size) => {
                                            setPagination({page, size});
                                            setPaginationChange(!paginationChange);
                                        }}
                                        pageSize={pagination.size} total={pagination.total} />
                        </ConfigProvider>
                    </div>
                </div>
                <div className={blogDetailStyle.side}>
                    <div className={blogDetailStyle.author}>
                        <div style={{width: '100%'}}>
                            <img src={commonContext.serverUrl + '/common/photo/view?filename=' + article.userDTO.headPic} className={blogDetailStyle.image} alt="" />
                        </div>
                        <div className={blogDetailStyle.name} onClick={() => history.push("/user/" + article.userId)}>
                            {article.userDTO.username}
                        </div>
                        {
                            attention ? (
                                <div onClick={() => removeAttentionAuthor()} className={blogDetailStyle.notAttention}>取消关注</div>
                            ) : (
                                <div onClick={() => attentionAuthor()} className={blogDetailStyle.attention}>关注TA</div>
                            )
                        }
                    </div>
                    <div className={blogDetailStyle.quickArticle}>
                        <Card title="作者其他文章" extra={<a href={'/#/user/' + article.userId} style={{color: '#28a745'}}>更多</a>}>
                            {
                                authorArticleList.length > 0 ? (
                                    <React.Fragment>
                                        {
                                            authorArticleList.map((item, index) => {
                                                return (
                                                    <div key={index} className={blogDetailStyle.quickArticleItem}>
                                                        <div onClick={() => history.push("/blog/detail/" + item.id)} className={blogDetailStyle.name} title={item.title}>{item.title}</div>
                                                        <div className={blogDetailStyle.date}>{item.createTime}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </React.Fragment>
                                ) : (
                                    <Empty description="暂无数据" />
                                )
                            }
                        </Card>
                    </div>
                </div>
                <div className={blogDetailStyle.right}></div>
            </div>
            <CommonFooter />
        </>
    )

};

export default BlogDetail;
