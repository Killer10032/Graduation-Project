import { legacy_createStore as createStore} from "redux"

// 状态初始
const initState = {
    menuName: "首页",
    selectKey: ["1"],
    openKey: ["1"],
    serverUrl: "http://127.0.0.1:8081"
};

const reducer = (state = initState, action) =>{
    switch (action.type) {
        case "changeName":
            return {
                ...state,
                menuName: action.name
            };
        case "changeSelectKey":
            return {
                ...state,
                selectKey: action.selectKey
            };
        case "changeOpenKey":
            return {
                ...state,
                openKey: action.openKey
            };
        default:
            return state;
    }
};

export default createStore(reducer);
