import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const Search = () => {
    return (
        <div style={{ display: "flex" }}>
            <Tooltip title="search">
                <Button type="primary" shape="circle" icon={<SearchOutlined />} />
            </Tooltip>
            <NavLink to="/addNew"><EditTwoTone style={{ fontSize: "32px", marginLeft: "15px", cursor: "pointer" }} /></NavLink>
        </div>
    );
}

export default Search;
