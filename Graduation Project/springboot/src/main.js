import { createApp } from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import hljs from 'highlight.js'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/assets/css/global.css';

// Vue.use(ElementPlus, {size: 'small'})
// Vue.use(mavonEditor)
// Vue.use(hljs)
//
// new Vue({
//     router,
//     store,
//     render: () => h(App)
// }).$mount('#app')
createApp(App).use(mavonEditor).use(store).use(router).use(ElementPlus, {size: 'small' }).use(hljs).mount('#app')

