import forumStyle from './Forum.module.scss'
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import ArticleList from "../../components/ArticleList/ArticleList";
import {Card, Carousel, ConfigProvider, message, Pagination, Empty} from "antd";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.png";
import CommonFooter from "../../components/CommonFooter/CommonFooter";
import {default as React, useContext, useEffect, useState} from "react";
import zhCN from "antd/es/locale/zh_CN";
import CommonContext from "../../context/CommonContext";
import {useHistory} from "react-router-dom";
import axios from "axios";
import event from "../../event";
import homeStyle from "../Home/Home.module.scss";


const Forum = () => {


    const [searchContent, setSearchContent] = useState("");
    const [articleList, setArticleList] = useState([]);
    const [hotArticleList, setHotArticleList] = useState([]);
    const [pagination, setPagination] = useState({page: 1, size: 5, total: 0});
    const [paginationChange, setPaginationChange] = useState(false);
    const commonContext = useContext(CommonContext);
    const [checkState, setCheckState] = useState(0);
    const history = useHistory();

    useEffect(() => {
        event.addListener('searchArticle',
            (data) => {
                setSearchContent(data);
            }
        );
        // 获取热门文章数据
        getHotArticle()
        return () => { // 页面销毁时触发
        }
    }, []);

    useEffect( () => {
        // 获取文章数据
        getArticleList();
        return () => { // 页面销毁时触发
        }
    }, [paginationChange, checkState, searchContent]);

    // 获取热门文章数据
    const getHotArticle = () => {
        axios.post(commonContext.serverUrl + '/web/article/hot', {type: 2})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    setHotArticleList(resp.data);
                }
            })
            .catch(function (error) {
                message.error('网络错误，获取热门文章数据失败！');
            })
    };

    // 获取文章数据
    const getArticleList = () => {
        let data = {...pagination, param: {title: searchContent, type: 2}};
        if(checkState !== 0) {
            data.param.state = checkState;
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

    return (
        <>
            <CommonHeader showSearch={true} tabKey="2" />
            <div className={forumStyle.container}>
                <div className={forumStyle.left}></div>
                <div className={forumStyle.content}>
                    <div className={forumStyle.category}>
                        <div onClick={() => setCheckState(0)} className={checkState === 0 ? forumStyle.selectItem : forumStyle.item}>全部</div>
                        <div onClick={() => setCheckState(2)} className={checkState === 2 ? forumStyle.selectItem : forumStyle.item}>未解决</div>
                        <div onClick={() => setCheckState(3)} className={checkState === 3 ? forumStyle.selectItem : forumStyle.item}>已解决</div>
                    </div>
                    <ArticleList articleList={articleList} />
                    <div className={forumStyle.pagination}>
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
                <div className={forumStyle.side}>
                    <div className={forumStyle.quick}>
                        <div className={forumStyle.leftButton} onClick={() => history.push("/editor/add/1")}>写文章</div>
                        <div className={forumStyle.rightButton} onClick={() => history.push("/editor/add/2")}>提问题</div>
                    </div>
                    <div className={forumStyle.image}>
                        <Carousel autoplay={true}>
                            <div>
                                <img src={image1} alt='' width='100%' height='100%'/>
                            </div>
                            <div>
                                <img src={image2} alt='' width='100%' height='100%'/>
                            </div>
                        </Carousel>
                    </div>
                    <div className={forumStyle.quickArticle} style={{marginTop: '1.2rem'}}>
                        <Card title="热门问题">
                            {
                                hotArticleList.length > 0 ? (
                                    <React.Fragment>
                                        {
                                            hotArticleList.map((item, index) => {
                                                return (
                                                    <div className={forumStyle.quickArticleItem}>
                                                        <div onClick={() => history.push("/blog/detail/" + item.id)} className={forumStyle.name} title={item.title}>{item.title}</div>
                                                        <div className={forumStyle.date}>{item.createTime}</div>
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
                <div className={forumStyle.right}></div>
            </div>
            <CommonFooter/>
        </>
    )

};

export default Forum;
