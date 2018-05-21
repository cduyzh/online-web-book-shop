import VueRouter from 'vue-router'

// web阅读器
import rederIndex from './view/reader/reder_index.vue'
import reader from './view/reader/reader.vue'
import catalog from './view/reader/catalog.vue'
// 书城首页
import home from './view/home/index.vue'
import homeContent from './view/home/home_content.vue'
import bookInfo from './view/home/book_info/book_info.vue'
import userInfo from './view/home/user_info.vue'
import moreBookList from './view/home/more_book_list/more_book_list.vue'
import login from './view/home/login/login.vue'

const routes = [
    // 主页
    {
        path: '/',
        component: home,
        children: [
            {
                path: '',
                name: 'homeContent',
                component: homeContent
            },
            {
                path: 'bookInfo',
                name: 'bookInfo',
                component: bookInfo
            },
            {
                path: 'more',
                name: 'moreBookList',
                component: moreBookList
            }
        ]
    },
    // 登录注册
    {
        path: '/login',
        component: login,
        name: 'login'
    },
    // 用户信息
    {
        path: '/user_info',
        component: userInfo,
        name: 'userInfo'
    },
    // 阅读器
    {
        path: '/reader',
        component: rederIndex,
        children: [{path: '', name: 'reader', component: reader}, {path: 'catalog', name: 'catalog', component: catalog}]
    }
]

// 创建 router 实例
const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return {x: 0, y: 0}
    }
})

router.beforeEach((to, from, next) => {
    if (!window.gDevEnv) {
        Vue.prototype.$reporter.reportPageView({path: to.path})
    }
    next()
})

export default router
