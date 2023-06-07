import {Input, message, Modal, Select, ConfigProvider} from 'antd';
import editorStyle from './Editor.module.scss'
import hljs from "highlight.js";
import 'highlight.js/styles/base16/onedark.css';
import zhCN from "antd/es/locale/zh_CN";
import { marked } from 'marked'
import {useContext, useEffect, useRef, useState} from 'react'
import EditorContent from 'for-editor'
import { useHistory } from 'react-router-dom';
import axios from "axios";
import CommonContext from '../../context/CommonContext';
const { TextArea } = Input;
const { confirm } = Modal;

const Editor = (props) => {

    const inputTitle = useRef();
    const editor = useRef();
    const [loginUser, setLoginUser] = useState({});
    const [imgUpload, setImgUpload] = useState(false);
    const [article, setArticle] = useState({});
    const [categoryList, setCategoryList] = useState([]);
    const [tagList, setTagList] = useState([]);
    const commonContext = useContext(CommonContext);
    const history = useHistory();

    // 对标题进行聚焦  初始化markdown编辑器
    useEffect(() => {
        inputTitle.current.focus();
        // 配置marked
        let renderer = new marked.Renderer();
        // 配置链接，点击链接时，打开新的浏览器窗口
        renderer.link = function( href, title, text ) {
            return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
        };
        marked.setOptions({
            renderer: renderer,
            highlight: function(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });
        return () => { // 页面销毁时触发
        }
    }, []);


    useEffect(() => {
        // 检查是否登录
        checkLogin();
        // 获取文章分类数据
        getAllCategory();
        // 获取文章标签数据
        getAllTag();
        return () => { // 页面销毁时触发
        }
    }, []);

    useEffect(() => {
        if(imgUpload) {
            let markDown = article.contentMarkdown + "\n";
            setArticle({...article, contentHtml: marked.parse(markDown), contentMarkdown: markDown});
            setImgUpload(false);
        }
        return () => { // 页面销毁时触发
        }
    }, [imgUpload]);

    useEffect(() => {
        const { match: { params = "" } } = props;
        if(params.operate !== 'add' && params.operate !== 'edit') {
            message.error("错误参数！");
            history.push("/index");
        }
        if(params.operate === 'add' && params.id != 1 && params.id != 2) {
            message.error("错误参数！");
            history.push("/index");
        }
        if(params.operate === 'edit') {
            // 根据id获取文章数据
            getArticleById(params.id)
        }
        return () => { // 页面销毁时触发
        }
    }, [tagList, categoryList]);


    // 检查是否登录
    const checkLogin = () => {
        let token = global.tools.getLoginUser();
        axios.post(commonContext.serverUrl + '/web/user/check_login',{token: token})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if (global.tools.isNotEmpty(resp.data.token)) {
                        setLoginUser(resp.data);
                        setArticle({...article, userId: resp.data.id});
                    } else {
                        message.error('用户登录已失效，请重新登录！');
                        history.push("/index");
                    }
                } else {
                    message.error('用户登录已失效，请重新登录！');
                    history.push("/index");
                }
            })
            .catch(function (error) {
                message.error('网络错误，用户登录已失效，请重新登录！');
                history.push("/index");
            })
    };

    // 获取文章分类数据
    const getAllCategory = () => {
        axios.post(commonContext.serverUrl + '/web/category/all')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setCategoryList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取文章分类数据失败！');
            })
    };

    // 根据id获取文章数据
    const getArticleById = (id) => {
        axios.post(commonContext.serverUrl + '/web/article/get', {id})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    let tagList = [];
                    resp.data.tagDTOList.forEach(item => {
                        tagList.push(item.id);
                    });
                    resp.data.tagList = tagList;
                    resp.data.contentMarkdown = resp.data.contentMarkdown + "\n";
                    setArticle(resp.data);
                }
            })
            .catch(function (error) {
                message.error('网络错误，根据id获取文章数据失败！');
            })
    };

    // 获取文章标签数据
    const getAllTag = () => {
        axios.post(commonContext.serverUrl + '/web/tag/all')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setTagList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取文章标签数据失败！');
            })
    };

    // 保存文章信息
    const saveArticle = (state, type) => {
        const { match: { params = '' } } = props;
        let data = {};
        if(params.operate === 'add') {
            data = {
                ...article,
                state,
                type: params.id,
                tagList: article.tagList ? article.tagList.join(";") : ''
            };
        }
        if(params.operate === 'edit') {
            data = {
                ...article,
                state,
                tagList: article.tagList ? article.tagList.join(";") : ''
            };
        }

        axios.post(commonContext.serverUrl + '/web/article/save', data)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    if(type === 1) {
                        let tagList = [];
                        resp.data.tagDTOList.forEach(item => {
                            tagList.push(item.id);
                        });
                        resp.data.tagList = tagList;
                        resp.data.contentMarkdown = resp.data.contentMarkdown + "\n";
                        setArticle(resp.data);
                        message.success(resp.msg);
                    } else if(type === 2) {
                        message.success("发布成功！");
                        history.push("/index");
                    }
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，保存文章信息失败！');
            })
    };

    // 编辑框内容发生变化时
    const handleChange = (value) => {
        setArticle({...article, contentHtml: marked.parse(value), contentMarkdown: value});
    };

    // 上传图片
    const addImg = (file) => {
        let config = {
            headers:{'Content-Type':'multipart/form-data'}
        };
        let formData = new FormData();
        formData.append('photo', file);
        axios.post(commonContext.serverUrl + '/common/photo/upload_photo', formData, config)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    editor.current.$img2Url(file.name, commonContext.serverUrl + '/common/photo/view?filename=' + resp.data);
                    setImgUpload(true);
                } else {
                    message.error(resp.msg);
                }
            })
            .catch(function (error) {
                message.error('网络错误，上传图片失败！');
            })
    };

    // 返回首页
    const backHome = () => {
        confirm({
            title: '提示',
            content: '确定要返回首页吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                history.push("/index")
            },
            onCancel() {
            },
        });
    };


    return (
        <div className={editorStyle.editor}>
            <div className={editorStyle.title}>
                <div className={editorStyle.back} onClick={() => backHome()}>
                    返回首页
                </div>
                <div style={{width: '80%', paddingTop: '0.5rem'}}>
                    <Input defaultValue={article.title} value={article.title} onChange={ e => setArticle({...article, title: e.target.value}) } ref={inputTitle} className={editorStyle.input} placeholder="请在这里输入文章标题"/>
                </div>
            </div>
            <div className={editorStyle.content}>
                <EditorContent onSave={() => saveArticle(6, 1)} ref={editor} preview={true} subfield={true}
                   addImg={($file) => addImg($file)}
                   value={article.contentMarkdown} onChange={handleChange}/>
            </div>
            <div className={editorStyle.footer}>
                <div className={editorStyle.left}>
                    <div style={{width: '50%'}}>
                        <Select defaultValue={article.categoryId} value={article.categoryId} onChange={ e => setArticle({...article, categoryId: e}) }  style={{width: '100%'}} placeholder="请选择文章分类">
                            {
                                categoryList && categoryList.map((item, index) => {
                                    return (
                                        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                    <div style={{width: '50%', marginLeft: '1rem'}} >
                        <ConfigProvider locale={zhCN}>
                            <Select mode="multiple" defaultValue={article.tagList} value={article.tagList} onChange={ e => {
                                if(e.length > 3) {
                                    message.warning("最多选择3个标签哦！")
                                } else {
                                    setArticle({...article, tagList: e});
                                }
                            } } style={{width: '100%'}} placeholder="请选择文章标签">
                                {
                                    tagList && tagList.map((item, index) => {
                                        return (
                                            <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </ConfigProvider>
                    </div>

                </div>
                <div className={editorStyle.center}>
                    <TextArea rows={1} defaultValue={article.summary} value={article.summary} onChange={ e => setArticle({...article, summary: e.target.value}) } placeholder="请输入文章摘要" />
                </div>
                <div className={editorStyle.right}>
                    <div className={editorStyle.save} onClick={() => saveArticle(6, 1)}>
                        保存草稿箱
                    </div>
                    <div className={editorStyle.submit} onClick={() => saveArticle(1, 2)}>
                        发布
                    </div>
                </div>
            </div>

        </div>
    )

};

export default Editor;
