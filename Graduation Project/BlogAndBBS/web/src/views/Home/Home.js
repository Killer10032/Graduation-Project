import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.png';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import CommonFooter from '../../components/CommonFooter/CommonFooter';
import ArticleList from "../../components/ArticleList/ArticleList";
import {Carousel, Card, message, ConfigProvider, Pagination, Empty } from 'antd';
import homeStyle from './Home.module.scss';
import {default as React, useContext, useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import CommonContext from '../../context/CommonContext';
import zhCN from "antd/es/locale/zh_CN";
import event from "../../event";

const Home = () => {

    const [searchContent, setSearchContent] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [checkCategory, setCheckCategory] = useState('0');
    const [pagination, setPagination] = useState({page: 1, size: 5, total: 0});
    const [paginationChange, setPaginationChange] = useState(false);
    const commonContext = useContext(CommonContext);
    const history = useHistory();
    const [articleList, setArticleList] = useState([]);
    const [hotArticleList, setHotArticleList] = useState([]);

    useEffect(() => {
        event.addListener('searchArticle',
            (data) => {
                setSearchContent(data);
            }
        );
        // 获取文章分类数据
        getAllCategory();
        // 获取热门文章数据
        getHotArticle();
        return () => { // 页面销毁时触发
        }
    }, []);

    useEffect( () => {
        // 获取文章数据
        getArticleList();
        return () => { // 页面销毁时触发
        }
    }, [paginationChange, checkCategory, searchContent]);

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

    // 获取热门文章数据
    const getHotArticle = () => {
        axios.post(commonContext.serverUrl + '/web/article/hot', {type: 1})
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
        axios.post(commonContext.serverUrl + '/web/article/list', {...pagination, param: {categoryId: checkCategory, title: searchContent, type: 1}})
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
           <CommonHeader showSearch={true} tabKey="1" />
           <div className={homeStyle.container}>
               <div className={homeStyle.left}></div>
               <div className={homeStyle.content}>
                   <div className={homeStyle.category}>
                       <div onClick={() => setCheckCategory('0')} className={ checkCategory === '0' ? homeStyle.selectItem : homeStyle.item}>全部文章</div>
                       {
                           categoryList.map((item, index) => {
                               return (
                                   <div onClick={() => setCheckCategory(item.id)} key={index}
                                        className={item.id === checkCategory ? homeStyle.selectItem: homeStyle.item}>{item.name}</div>
                               )
                           })
                       }
                   </div>
                   <ArticleList articleList={articleList}/>
                   <div className={homeStyle.pagination}>
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
               <div className={homeStyle.side}>
                   <div className={homeStyle.quick}>
                       <div className={homeStyle.leftButton} onClick={() => history.push("/editor/add/1")}>写文章</div>
                       <div className={homeStyle.rightButton} onClick={() => history.push("/editor/add/2")}>提问题</div>
                   </div>
                   <div className={homeStyle.image}>
                       <Carousel autoplay={true}>
                           <div>
                               <img src={image1} alt='' width='100%' height='100%'/>
                           </div>
                           <div>
                               <img src={image2} alt='' width='100%' height='100%'/>
                           </div>
                       </Carousel>
                   </div>
                   <div className={homeStyle.quickArticle} style={{marginTop: '1.5rem'}}>
                       <Card title="热门博客">
                           {
                               hotArticleList.length > 0 ? (
                                   <React.Fragment>
                                       {
                                           hotArticleList.map((item, index) => {
                                               return (
                                                   <div key={index} className={homeStyle.quickArticleItem}>
                                                       <div onClick={() => history.push("/blog/detail/" + item.id)} className={homeStyle.name} title={item.title}>{item.title}</div>
                                                       <div className={homeStyle.date}>{item.createTime}</div>
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
               <div className={homeStyle.right}></div>
           </div>
           <CommonFooter/>
        </>
    );
};

export default Home;
