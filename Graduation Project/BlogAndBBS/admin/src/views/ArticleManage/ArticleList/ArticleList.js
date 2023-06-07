import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, Radio, Icon, Tooltip } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import axios from "axios";
import 'highlight.js/styles/base16/onedark.css';
import articleStyle from './ArticleList.module.scss';
import {connect} from "react-redux";
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
class ArticleList extends Component{

    state = {
        columns: [
            {title: '文章编号', dataIndex: 'id', width: '150px'},
            {title: '文章标题', dataIndex: 'title', width: '250px'},
            {title: '文章摘要', dataIndex: 'summary', width: '300px'},
            {title: '文章所属用户', width: '150px', render: (text, record) => {
                    return record.userDTO.username
                }},
            {title: '文章状态', dataIndex: 'state', width: '100px', render: text => {
                    if(text === 1) {
                        return "待审核";
                    } else if (text === 2) {
                        return "未解决";
                    } else if (text === 3) {
                        return "已解决";
                    } else if (text === 4) {
                        return "审核通过";
                    } else if (text === 5) {
                        return "审核不通过";
                    } else if (text === 6) {
                        return "草稿";
                    }
                }},
            {title: '文章所属分类', width: '150px', render: (text, record) => {
                    return record.categoryDTO ? record.categoryDTO.name : "";
                }},
            {title: '文章所属标签', width: '150px', render: (text, record) => {
                    let tagList = [];
                    record.tagDTOList.forEach((item, index) => {
                        tagList.push(item.name);
                    });
                    return tagList.join("、");
                }},
            {title: '文章类型', dataIndex: 'type', width: '100px', render: (text, record) => {
                    if(text === 1) {
                        return "博客";
                    } else if (text === 2) {
                        return "问答";
                    }
                }},
            {title: '文章创建时间', dataIndex: 'createTime', width: '200px'},
            {title: '文章更新时间', dataIndex: 'updateTime', width: '200px'},
            {title: '文章是否置顶', dataIndex: 'top', width: '150px', render: (text, record) => {
                    if(text === 1) {
                        return "否";
                    } else if (text === 2) {
                        return "是";
                    }
                }},
            {title: '文章是否官方', dataIndex: 'official', width: '150px', render: (text, record) => {
                    if(text === 1) {
                        return "否";
                    } else if (text === 2) {
                        return "是";
                    }
                }},
            {title: '文章是否加精', dataIndex: 'essence', width: '150px', render: (text, record) => {
                    if(text === 1) {
                        return "否";
                    } else if (text === 2) {
                        return "是";
                    }
                }},
            {title: '文章浏览数', dataIndex: 'viewNum', width: '150px'},
            {title: '文章收藏数', dataIndex: 'collectNum', width: '150px'},
            {title: '文章点赞数', dataIndex: 'likeNum', width: '150px'},
            {title: '文章评论数', dataIndex: 'commentNum', width: '150px'},
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
            title: '',
            state: 0,
            type: 0
        },
        editModal: {
            visible: false
        },
        viewModal: {
            visible: false
        },
        article: {
            id: "",
            state: 6,
            top: 1,
            type: 1,
            official: 1,
            essence: 1
        },
        selectRows: []
    };

    // 页码变化
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}}, () => {
            this.rowSelection.selectedRowKeys = [];
            this.getArticleList();
        });
    }

    // 每页条数变化
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}}, () => {
            this.rowSelection.selectedRowKeys = [];
            this.getArticleList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("文章管理/文章列表");
        changeSelectKey(["5-1"]);
        changeOpenKey(["5"]);
        await this.getArticleList();
    };

    getArticleList() {
        const { serverUrl } = this.props;
        const { paginationProps, searchParams } = this.state;
        const data = {
            page: paginationProps.current,
            size: paginationProps.pageSize,
            param: {
                title: searchParams.title,
                type: searchParams.type,
                state: searchParams.state
            }
        };
        const _this = this;
        return axios.post(serverUrl+ '/admin/article/list', data)
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
                    message.error("获取文章数据失败~");
                }
            }).catch(function (error) {
                console.error(error);
                message.error("获取文章数据失败~");
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
    searchArticleList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getArticleList();
        });
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.setState({selectRows: selectedRows})
        }
    };

    // 会话框表单内容双向绑定实现
    changeModalInput(type, e){
        // type:对象成员  e:变化值
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.article, {
            [type]: e
        });
        this.setState({
            article: target
        })
    }

    // 点击修改的确定
    handleOk() {
        const { article } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/article/update', article)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    _this.setState({editModal: {visible: false}, selectRows: []});
                    _this.rowSelection.selectedRowKeys = [];
                    _this.getArticleList();
                }else{
                    message.error(resp.msg);
                }
            }).catch(function (error) {
            console.error(error);
            message.error("网络错误，修改文章信息失败~");
        })
    }


    // 删除文章信息
    deleteArticle() {
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
                axios.post(serverUrl+ '/admin/article/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchArticleList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchArticleList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("网络错误，删除文章信息失败~");
                })
            },
            onCancel() {
            }
        });

    }

    // 打开修改会话框
    openEditModal() {
        const { selectRows } = this.state;
        if(selectRows.length !== 1) {
            message.warning("请选择一条数据进行修改状态~");
            return false;
        }
        this.setState({article: {...selectRows[0] }, editModal: { visible: true }});
    }

    // 打开查看详情会话框
    openViewModal() {
        const { selectRows } = this.state;
        if(selectRows.length !== 1) {
            message.warning("请选择一条数据进行查看详情~");
            return false;
        }
        this.setState({article: {...selectRows[0] }, viewModal: { visible: true }});
    }



    render() {
        const { columns, tableData, paginationProps, searchParams, viewModal, editModal, article } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <React.Fragment>
                <Modal
                    title="查看文章详情"
                    visible={viewModal.visible}
                    okText="确定"
                    onCancel={() => this.setState({viewModal: { visible: false }})}
                    width={700}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    maskClosable={false}
                    onOk={() => this.setState({viewModal: { visible: false }})}
                >
                    <div className="for-container">
                        <div className="for-markdown-preview">
                            <div style={{padding: '1.5rem'}}  dangerouslySetInnerHTML={{
                                __html: article.contentHtml
                            }}
                            />
                        </div>
                    </div>
                </Modal>
                <Modal
                    title="修改文章信息"
                    visible={editModal.visible}
                    okText="确定"
                    cancelText="取消"
                    onCancel={() => this.setState({editModal: { visible: false }})}
                    maskClosable={false}
                    onOk={this.handleOk.bind(this)}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="文章状态">
                            <Select value={article.state} onChange={this.changeModalInput.bind(this, 'state')} style={{ width: '100%' }}>
                                <Option value={1}>待审核</Option>
                                {
                                    article.type === 2 && <Option value={2}>未解决</Option>
                                }
                                {
                                    article.type === 2 && <Option value={3}>已解决</Option>
                                }
                                {
                                    article.type === 1 && <Option value={4}>审核通过</Option>
                                }
                                <Option value={5}>审核不通过</Option>
                                <Option value={6}>草稿</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="是否置顶">
                            <Radio.Group onChange={this.changeModalInput.bind(this, 'top')} value={article.top}>
                                <Radio value={1}>否</Radio>
                                <Radio value={2}>是</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="是否官方">
                            <Radio.Group onChange={this.changeModalInput.bind(this, 'official')} value={article.official}>
                                <Radio value={1}>否</Radio>
                                <Radio value={2}>是</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="是否加精">
                            <Radio.Group onChange={this.changeModalInput.bind(this, 'essence')} value={article.essence}>
                                <Radio value={1}>否</Radio>
                                <Radio value={2}>是</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
                <div className={articleStyle.article_button} style={{width: '100%', height: '10%'}}>
                    <Button icon="eye" className={articleStyle.view} onClick={this.openViewModal.bind(this)}>
                        查看详情
                    </Button>
                    <Button type="edit" icon="edit" className={articleStyle.edit} onClick={this.openEditModal.bind(this)}>
                        修改
                    </Button>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteArticle.bind(this)}>
                        删除
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'title')} defaultValue={searchParams.title} value={searchParams.title} placeholder="请输入文章标题" style={{width: '200px', margin: '0 10px'}} />
                    <Select defaultValue={0} style={{width: '200px', margin: '0 10px'}} onChange={this.changeSearchInput.bind(this, 'state')}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>待审核</Option>
                        <Option value={2}>未解决</Option>
                        <Option value={3}>已解决</Option>
                        <Option value={4}>审核通过</Option>
                        <Option value={5}>审核不通过</Option>
                        <Option value={6}>草稿</Option>
                    </Select>
                    <Select defaultValue={0} style={{width: '200px', margin: '0 10px'}} onChange={this.changeSearchInput.bind(this, 'type')}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>博客</Option>
                        <Option value={2}>问答</Option>
                    </Select>
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchArticleList.bind(this)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
