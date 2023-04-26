//封装请求函数
import request from "./request";

//获取首页轮播数据
export function getHeadlineNewApi() {
    return request({
        url: "/headlineNews",
        method: "GET",
    })
}

//获取新闻数据
export function getNewsApi() {
    return request({
        url: "/news",
        method: "GET",
    })
}

//添加新闻数据
export function addNewApi(data) {
    return request({
        url: "/news",
        method: "POST",
        data
    })
}

//根据 id 获取数据
export function getNewsByIdApi(id) {
    return request({
        url: `/news/${id}`,
        method: "GET"
    })
}