import React, {Component} from "react";
import {Button, Input, Table, Select, message, ConfigProvider, Modal, Form, InputNumber, Icon, Tooltip } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import event from "../../../event";
import axios from "axios";
import categoryStyle from './CategoryList.module.scss';
import {connect} from "react-redux";
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
class CategoryList extends Component{

    state = {
        columns: [
            {title: '文章分类编号', dataIndex: 'id', width: '150px'},
            {title: '文章分类名称', dataIndex: 'name', width: '150px'},
            {title: '文章分类排序', dataIndex: 'sort', width: '150px'},
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
            name: ''
        },
        modal: {
            visible: false,
            title: ""
        },
        category: {
            id: "",
            name: "",
            sort: 0
        },
        selectRows: []
    };

    // 页码变化
    handlePageChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}}, () => {
            this.rowSelection.selectedRowKeys = [];
            this.getCategoryList();
        });
    }

    // 每页条数变化
    handleSizeChange(current, pageSize) {
        this.setState({selectRows: [], paginationProps: {current: current, pageSize: pageSize}}, () => {
            this.rowSelection.selectedRowKeys = [];
            this.getCategoryList();
        });
    }

    componentDidMount = async () => {
        const { changeName, changeSelectKey, changeOpenKey } = this.props;
        changeName("文章分类管理/文章分类列表");
        changeSelectKey(["3-1"]);
        changeOpenKey(["3"]);
        await this.getCategoryList();
    };

    getCategoryList() {
        const { serverUrl } = this.props;
        const { paginationProps, searchParams } = this.state;
        const data = {
            page: paginationProps.current,
            size: paginationProps.pageSize,
            param: {
                name: searchParams.name
            }
        };
        const _this = this;
        return axios.post(serverUrl+ '/admin/category/list', data)
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
                    message.error("获取文章分类数据失败~");
                }
            }).catch(function (error) {
                console.error(error);
                message.error("获取文章分类数据失败~");
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
    searchCategoryList() {
        let page = {
            current: 1,
            pageSize: 5,
        };
        this.setState({selectRows: [], paginationProps: page}, function () {
            this.rowSelection.selectedRowKeys = [];
            this.getCategoryList();
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
        this.setState({category: { sort: 0 }, modal: {visible: true, title: "添加文章分类信息"}});
    }

    // 会话框表单内容双向绑定实现
    changeModalInput(type, e){
        // type:对象成员  e:变化值
        if(e.target) {
            e = e.target.value;
        }
        let target= Object.assign({}, this.state.category, {
            [type]: e
        });
        this.setState({
            category: target
        })
    }

    // 点击确定
    handleOk() {
        const { category } = this.state;
        const { serverUrl } = this.props;
        const _this = this;
        axios.post(serverUrl+ '/admin/category/save', category)
            .then(function (response) {
                let resp = response.data;
                if(resp.code === 0){
                    message.success(resp.msg);
                    _this.setState({modal: {visible: false}, selectRows: []});
                    _this.rowSelection.selectedRowKeys = [];
                    _this.getCategoryList();
                }else{
                    message.error(resp.msg);
                }
            }).catch(function (error) {
            console.error(error);
            message.error("网络错误，保存文章分类信息失败~");
        })
    }


    // 删除文章分类信息
    deleteCategory() {
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
                axios.post(serverUrl+ '/admin/category/delete', {id: ids})
                    .then(function (response) {
                        let resp = response.data;
                        if(resp.code === 0){
                            message.success(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchCategoryList();
                        }else{
                            message.error(resp.msg);
                            _this.setState({selectRows: []});
                            _this.rowSelection.selectedRowKeys = [];
                            _this.searchCategoryList();
                        }
                    }).catch(function (error) {
                    console.error(error);
                    message.error("网络错误，删除文章分类信息失败~");
                })
            },
            onCancel() {
            }
        });

    }

    // 打开修改会话框
    openEditModal() {
        const { selectRows, category } = this.state;
        if(selectRows.length !== 1) {
            message.warning("请选择一条数据进行修改~")
            return false;
        }
        this.setState({category: {...selectRows[0] }, modal: {visible: true, title: "修改文章分类信息"}});
    }



    render() {
        const { columns, tableData, paginationProps, searchParams, modal, category } = this.state;
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
                    title={modal.title}
                    visible={modal.visible}
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    onOk={this.handleOk.bind(this)}
                    onCancel={() => this.setState({modal: {visible: false}})}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="文章分类名称">
                            <Input placeholder="请输入文章分类名称" onChange={this.changeModalInput.bind(this, 'name')} defaultValue={category.name} value={category.name}/>
                        </Form.Item>
                        <Form.Item label={
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Tooltip placement="top" title="排序值越大，首页展示越靠前">
                                    <div><Icon type="question-circle" /></div>
                                </Tooltip>
                                <div style={{marginLeft: '0.5rem'}}>文章分类排序：</div>
                            </div>
                        }>
                            <InputNumber style={{width: '100%'}} min={0} max={10000} placeholder="请输入文章分类排序" onChange={this.changeModalInput.bind(this, 'sort')} defaultValue={category.sort} value={category.sort}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <div className={categoryStyle.category_button} style={{width: '100%', height: '10%'}}>
                    <Button icon="plus" className={categoryStyle.add} onClick={this.openAddModal.bind(this)}>
                        添加
                    </Button>
                    <Button type="edit" icon="edit" className={categoryStyle.edit} onClick={this.openEditModal.bind(this)}>
                        修改
                    </Button>
                    <Button type="danger" icon="delete" style={{margin: '0 5px'}} onClick={this.deleteCategory.bind(this)}>
                        删除
                    </Button>
                    <Input onChange={this.changeSearchInput.bind(this, 'name')} defaultValue={searchParams.name} value={searchParams.name} placeholder="请输入文章分类名称" style={{width: '200px', margin: '0 10px'}} />
                    <Button type="primary" icon="search" style={{margin: '0 5px'}} onClick={this.searchCategoryList.bind(this)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
