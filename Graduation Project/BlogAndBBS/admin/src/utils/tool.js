global.tools = {

    /**
     * 保存登录管理员信息
     */
    setLoginAdmin: function (loginUser) {
        global.SessionStorage.set(global.SessionStorage.SESSION_KEY_LOGIN_ADMIN, loginUser);
    },

    /**
     * 获取登录管理员信息
     */
    getLoginAdmin: function () {
        return global.SessionStorage.get(global.SessionStorage.SESSION_KEY_LOGIN_ADMIN) || "";
    },

    /**
     * 空校验 null或""都返回true
     */
    isEmpty: function (obj) {
        if ((typeof obj === 'string')) {
            return !obj || obj.replace(/\s+/g, "") === ""
        } else {
            return (!obj || JSON.stringify(obj) === "{}" || obj.length === 0);
        }
    },

    /**
     * 非空校验
     */
    isNotEmpty: function (obj) {
        return !this.isEmpty(obj);
    }

};
