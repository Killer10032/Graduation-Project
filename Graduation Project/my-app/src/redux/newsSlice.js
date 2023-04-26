import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getHeadlineNewApi, getNewsApi, addNewApi, getNewsByIdApi } from "../api/newApi"

//初始化首页的轮博数据
export const getHeadlineNewsListAsync = createAsyncThunk("getHeadlineNewsListAsync", async (_, thunkAPI) => {
    const { data } = await getHeadlineNewApi()
    thunkAPI.dispatch(initHeadlineNewsList(data))
})

//初始化新闻页的数据
export const getNewsListAsync = createAsyncThunk("getNewsListAsync", async (_, thunkAPI) => {
    const { data } = await getNewsApi()
    thunkAPI.dispatch(initNewsList(data))
})

//新增数据
export const addNewsListAsync = createAsyncThunk("addNewsListAsync", async (payload, thunkAPI) => {
    // console.log(payload)
    const { data } = await addNewApi(payload)
    // console.log({ data })
    thunkAPI.dispatch(addNews(data))

})

export const newsSlice = createSlice({
    name: "news",
    initialState: {
        newsList: [],
        headlineNewsList: []
    },
    reducers: {
        initHeadlineNewsList: (state, { payload }) => {
            state.headlineNewsList = payload
        },
        initNewsList: (state, { payload }) => {
            state.newsList = payload
        },
        addNews: (state, { payload }) => {
            state.newsList.push(payload)
        }
    }
})

const { initHeadlineNewsList, initNewsList, addNews } = newsSlice.actions

export default newsSlice.reducer 