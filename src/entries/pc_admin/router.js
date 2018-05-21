import VueRouter from 'vue-router'

// 注释里的是分块js名，加admin_前缀是为避免和某个入口或chunk同名，否则会无法运行
const main = r => import(/* webpackChunkName: "admin_main" */ './view/main.vue').then(r)
const users = r => import(/* webpackChunkName: "admin_users" */ './view/users/users.vue').then(r)
const login = r => import(/* webpackChunkName: "admin_login" */ './view/login/login.vue').then(r)

const routes = [
    {
        path: '/admin',
        component: main,
        children: [{path: 'users', name: 'users', component: users}]
    },
    {path: '/', name: 'login', component: login},
    // 必须放最后
    {path: '/*', name: '404', component: login}
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

export default router
