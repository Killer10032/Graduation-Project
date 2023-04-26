import React from 'react';

const Avatar = (props) => {
    return (
        <div>
            <img style={{
                width: props.size + 'px',
                height: props.size + 'px',
                borderRadius: "50%"
            }}
                className="navbar-avatar"
                src={props.img} alt="avatar" />
        </div>
    );
}

export default Avatar;
