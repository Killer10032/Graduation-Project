import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/Layout.vue';
import Blog from "@/layout/Blog";



const routes = [{
        path: '/',
        name: 'Layout',
        component: Layout,
        redirect: "/user",
        children: [{
                path: 'user',
                name: 'User',
                component: () =>
                    import ("@/views/User"),
            },
            {
                path: 'book',
                name: 'Book',
                component: () =>
                    import ("@/views/Book"),
            },
            {
                path: 'news',
                name: 'News',
                component: () =>
                    import ("@/views/News"),
            },
            {
                path: 'person',
                name: 'Person',
                component: () =>
                    import ("@/views/Person"),
            },

        ]
    },
    {
        path: '/about',
        name: 'about',
        component: () =>
            import ("@/views/User")
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ("@/views/Login")
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import ("@/views/Register")
    },
    {
        path: '/blog',
        name: 'Blog',
        component: Blog,
        redirect: '/blogMain',
        children: [{
                path: '/blogMain',
                name: 'BlogMain',
                component: () =>
                    import ("@/views/BlogMain")
            },
            {
                path: '/editor',
                name: 'Editor',
                component: () =>
                    import ("../views/Editor")
            },
            {
                path: '/content',
                name: 'Content',
                component: () =>
                    import ("@/views/Content")
            },
            {
                path: '/personCenter',
                name: 'PersonCenter',
                component: () =>
                    import ('@/views/PersonCenter')
            },
        ]
    },
    {
        path: '/404',
        name: '404',
        component: () =>
            import ('@/views/404'),
    },
    {
        path: '/likeTest',
        name: 'likeTest',
        component: () =>
            import ('@/views/likeTest')
    },
    {
        path: "/:catchAll(.*)",
        redirect: '/404',
    }


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// 限制某些页面禁止未登录访问
let limitPagePath = ['/about']

router.beforeEach((to, from, next) => {
    if (limitPagePath.includes(to.path)) {
        // 判断sessionStorage是否保存了用户信息
        let userStr = sessionStorage.getItem("user") || "{}"
        let user = JSON.parse(userStr)
        if (!user.id) {
            // 跳转到登录页面
            next({ path: "/login" })
        } else {
            next()
        }
    } else {
        next()
    }

})

export default router