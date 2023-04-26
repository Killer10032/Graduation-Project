import axios from "axios"

const request = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 3000
})

//设置请求拦截
request.interceptors.request.use((config) => {
    return config
})

//设置响应拦截
request.interceptors.response.use((response) => {
    return response
}, (error) => {
    return Promise.reject(error)
})

export default request
