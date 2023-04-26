//创建“外壳”组件App
import React from "react";
import NavBar from "./components/navbar/NavBar";
// import Rotation from "./components/main/Rotation";
import RouterConfig from "./router/index"


import "./styles/App.css"

const App = () => {
    return (
        <div className="container">
            <NavBar />
            <RouterConfig />
        </div>
    )
}
export default App
