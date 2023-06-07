import React from 'react';
// React.createContext()中的参数是默认值，可填可不填
const CommonContext = React.createContext( { serverUrl: 'http://127.0.0.1:8081' });
export default CommonContext;
