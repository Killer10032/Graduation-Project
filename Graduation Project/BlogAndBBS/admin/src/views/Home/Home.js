import React, {Component} from "react";
import {Card, Statistic, Icon, message} from 'antd';
import homeStyle from './Home.module.scss';
import {connect} from "react-redux";
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import axios from "axios";
const { Meta } = Card;
class Home extends Component{

    state = {
        seriesData: [],
        userTotal: 0,
        blogTotal: 0,
        questionTotal: 0,
        commentTotal: 0,
        user: {
            headPic: "common/no_image.jpg"
        }
    };

    componentDidMount() {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("首页");
        changeSelectKey(["1"]);
        changeOpenKey(["1"]);
        this.checkLogin();
        this.getUserTotal();
        this.getBlogTotal();
        this.getQuestionTotal();
        this.getCommentTotal();
        this.getArticleTotalByDay();
    }

    getUserTotal() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/user/total')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({userTotal: resp.data});
                }
            }).catch(function (error) {
            console.error(error);
            message.error("网络错误，获取用户总数数据失败~");
        })
    }

    // 获取博客总数
    getBlogTotal() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/article/total', {type: 1})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({blogTotal: resp.data});
                }
            }).catch(function (error) {
            console.error(error);
            message.error("网络错误，获取博客总数数据失败~");
        })
    }

    // 获取问答总数
    getQuestionTotal() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/article/total', {type: 2})
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({questionTotal: resp.data});
                }
            }).catch(function (error) {
            console.error(error);
            message.error("网络错误，获取问答总数数据失败~");
        })
    }

    // 获取评论总数
    getCommentTotal() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/comment/total')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({commentTotal: resp.data});
                }
            }).catch(function (error) {
            console.error(error);
            message.error("网络错误，获取评论总数数据失败~");
        })
    }



    checkLogin(){
        const _this = this;
        const { serverUrl } = _this.props;
        let token = global.tools.getLoginAdmin();
        if (global.tools.isEmpty(token)) {
            _this.props.history.push('/login');
        }else{
            // 后端token验证
            axios.post(serverUrl+ '/admin/user/check_login',{token: token})
                .then(function (response) {
                    let resp = response.data;
                    if(resp.code === 0){
                        if (global.tools.isEmpty(resp.data.token)) {
                            _this.props.history.push('/login');
                            message.error('还未登录或会话失效，请重新登录！');
                        } else {
                            _this.setState({user: resp.data});
                        }
                    }else{
                        _this.props.history.push('/login');
                        message.error(resp.msg);
                    }
                }).catch(function (error) {
                message.error('网络错误，用户登录已失效，请重新登录！');
                _this.props.history.push('/login');
            })
        }
    }

    // 根据日期时间获取文章总数
    getArticleTotalByDay() {
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/article/total_day')
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    _this.setState({seriesData: resp.data}, function () {
                        // 基于准备好的dom，初始化echarts实例
                        let myChart = echarts.init(document.getElementById('lineChart'));
                        _this.initChart(myChart);
                    });
                }
            }).catch(function (error) {
            console.error(error);
            message.error("网络错误，根据日期时间获取文章总数数据失败~");
        })
    }




    initChart(myChart){
        // 绘制图表
        myChart.setOption({
            title: {
                text: '近三天文章数折线图',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            color: ['#FF9F7F'],
            legend: {
                // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
                orient: 'horizontal',
                // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                x: 'left',
                // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                y: 'top',
                data: ['文章数']
            },
            xAxis: {
                data: [ this.getDate(3), this.getDate(2), this.getDate(1)]
            },
            yAxis: {},
            series: [{
                name: '文章数',
                type: 'line',
                data: this.state.seriesData
            }]
        });
    }

    getDate(i) {
        let date;
        switch (i) {
            case 1:
                // 当前日期
                date = new Date();
                break;
            case 2:
                // 昨天日期
                date = new Date(new Date() - 60000*60*24);
                break;
            case 3:
                // 前天日期
                date = new Date(new Date() - 60000*60*24*2);
                break;
            default:
                date = new Date();
                break;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentDate = year + "年" + month + "月" + strDate + "日";
        return currentDate;
    }

    render() {
        const { questionTotal, userTotal, commentTotal, blogTotal, user } = this.state;
        const { serverUrl } = this.props;
        return (
            <React.Fragment>
                <div className={homeStyle.top}>
                    <div className={homeStyle.left}>
                        <Card
                            hoverable
                            style={{ width: '90%'}}
                            cover={<img style={{width: '100%', height: '16rem'}} alt="example" src={serverUrl + "/common/photo/view?filename=" + user.headPic} />}
                        >
                            <Meta title={user.username} description={
                                user.roleId === 1 ? "用户角色：普通用户" :
                                user.roleId === 2 ? "用户角色：管理员" : ''
                            } />
                        </Card>
                    </div>
                    <div id="lineChart" className={homeStyle.right}>

                    </div>
                </div>

                <div className={homeStyle.bottom}>
                    <div className={homeStyle.item}>
                        <Statistic title="用户总数" value={userTotal} prefix={<Icon type="user" />} />
                    </div>
                    <div className={homeStyle.item}>
                        <Statistic title="博客总数" value={blogTotal} prefix={<Icon type="snippets" />} />
                    </div>
                    <div className={homeStyle.item}>
                        <Statistic title="问答总数" value={questionTotal} prefix={<Icon type="question-circle" />} />
                    </div>
                    <div className={homeStyle.item}>
                        <Statistic title="评论总数" value={commentTotal} prefix={<Icon type="message" />} />
                    </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Home);
