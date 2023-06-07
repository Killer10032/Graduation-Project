import React, {Component} from "react";
import {Layout, Icon, Menu, message} from 'antd';
import {connect} from "react-redux";
import { Link, withRouter } from "react-router-dom";
import theAsideStyle from './TheAside.module.scss';
import axios from "axios";
const { SubMenu } = Menu;
const { Sider } = Layout;
class TheAside extends Component{

    state = {
        collapsed: false,
        title: '博客论坛管理系统',
        authorityList: []
    };


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

    componentDidMount() {
        this.checkLogin();
    }

    onCollapse = collapsed => {
        const { changeOpenKey } = this.props;
        changeOpenKey([]);
        if(collapsed) {
            this.setState({title: '系统'});
        } else {
            this.setState({title: '博客论坛管理系统'});
        }
        this.setState({ collapsed });
    };

    setSubmenu = openKeys => {
        const { changeOpenKey } = this.props;
        changeOpenKey(openKeys);
    };

    render() {
        const { title } = this.state;
        const { selectKey, openKey } = this.props;
        return (
            <React.Fragment>
                <Sider className={theAsideStyle.aside} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className={theAsideStyle.logo}>{title}</div>
                    <Menu theme="dark" selectedKeys={selectKey} mode="inline" openKeys={openKey} onOpenChange={(openKeys) => {this.setSubmenu(openKeys)}}>
                        <Menu.Item key="1">
                            <Link to="/home" style={{textDecoration: 'none'}}>
                                <Icon type="home" /><span>首页</span>
                            </Link>
                        </Menu.Item>
                        <SubMenu key="2" title={<span><Icon type="team" /><span>用户管理</span></span>}>
                            <Menu.Item key="2-1">
                                <Link to="/home/user-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />用户列表
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="3" title={<span><Icon type="appstore" /><span>文章分类管理</span></span>}>
                            <Menu.Item key="3-1">
                                <Link to="/home/category-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />文章分类列表
                                </Link>

                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="4" title={<span><Icon type="tags" /><span>文章标签管理</span></span>}>
                            <Menu.Item key="4-1">
                                <Link to="/home/tag-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />文章标签列表
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="5" title={<span><Icon type="snippets" /><span>文章管理</span></span>}>
                            <Menu.Item key="5-1">
                                <Link to="/home/article-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />文章列表
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="6" title={<span><Icon type="message" /><span>评论管理</span></span>}>
                            <Menu.Item key="6-1">
                                <Link to="/home/comment-list" style={{textDecoration: 'none'}}>
                                    <Icon type="bars" />评论列表
                                </Link>
                            </Menu.Item>
                        </SubMenu>

                    </Menu>
                </Sider>
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TheAside));
