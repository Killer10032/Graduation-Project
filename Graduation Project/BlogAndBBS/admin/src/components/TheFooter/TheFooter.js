import React, {Component} from "react";
import {Layout} from 'antd';
import theFooterStyle from './TheFooter.module.scss';
const { Footer } = Layout;
class TheFooter extends Component{


    render() {
        return (
            <React.Fragment>
                <Footer className={theFooterStyle.footer}>Ventsze©2023(QQ：614371734)</Footer>
            </React.Fragment>
        );
    }
}

export default TheFooter;
