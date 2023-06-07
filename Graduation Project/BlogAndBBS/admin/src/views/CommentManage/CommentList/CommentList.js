import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, InputNumber, Icon, Tooltip } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import axios from "axios";
import commentStyle from './CommentList.module.scss';
import {connect} from "react-redux";
const { confirm } = Modal;
class CommentList extends Component{

    state = {
        columns: [
            {title: '评论编号', dataIndex: 'id', width: '150px'},
            {title: '评论内容', dataIndex: 'content', width: '300px'},
            {title: '评论发送者', width: '150px', render: (text, record) => {
                    return record.fromUserDTO ? record.fromUserDTO.username : '';
                }},
            {title: '评论被回复者', width: '150px', render: (text, record) => {
                    return record.toUserDTO ? record.toUserDTO.username : '';
                }},
            {title: '评论所属文章', width: '250px', render: (text, record) => {
                    return record.articleDTO.title;
                }},
            {title: '评论类型', width: '100px', dataIndex: 'type', render: (text, record) => {
                    if(text === 1) {
                        return '发表'
                    } else if(text === 2) {
                        return '回复'
                    }
                }},
            {title: '是否采纳', width: '100px', dataIndex: 'pick', render: (text, record) => {
                    if(text === 1) {
                        return '否'
                    } else if(text === 2) {
                        return '是'
                    }
                }},
            {title: '评论时间', dataIndex: 'createTime', width: '200px'},
        ],
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
            content: ''
        },
        selectRows: []
    };

    // 页码变化
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getCommentList();
        });
    }

    // 每页条数变化
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}},  () => {
            this.rowSelection.selectedRowKeys = [];
            this.getCommentList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("评论管理/评论列表");
        changeSelectKey(["6-1"]);
        changeOpenKey(["6"]);
        await this.getCommentList();
    };

    getCommentList() {
        const { serverUrl } = this.props;
        const { paginationProps, searchParams } = this.state;
        const data = {
            page: paginationProps.current,
            size: paginationProps.pageSize,
            param: {
                content: searchParams.content
            }
        };
        const _this = this;
        return axios.post(serverUrl+ '/admin/comment/list', data)
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
                    message.error("获取评论数据失败~");
                }
            }).catch(function (error) {
                console.error(error);
                message.error("获取评论数据失败~");
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
    searchCommentList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getCommentList();
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.setState({selectRows: selectedRows})
        }
    };



    // 删除评论信息
    deleteComment() {
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
                axios.post(serverUrl+ '/admin/comment/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchCommentList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchCommentList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("网络错误，删除评论失败~");
                })
            },
            onCancel() {
            }
        });

    }



    render() {
        const { columns, tableData, paginationProps, searchParams } = this.state;

        return (
            <React.Fragment>
                <div style={{width: '100%', height: '10%'}}>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteComment.bind(this)}>
                        删除
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'content')} defaultValue={searchParams.content} value={searchParams.content} placeholder="请输入评论内容" style={{width: '200px', margin: '0 10px'}} />
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchCommentList.bind(this)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
