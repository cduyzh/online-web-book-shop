import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import bookstore from './modules/bookstore'
import account from './modules/account'

Vue.use(Vuex)

const state = {
    // 是否正在显示弹框
    isShowingDlg: false
}
const store = new Vuex.Store({
    strict: window.gDevEnv,
    state,
    getters,
    actions,
    mutations,
    modules: {
        bookstore,
        account
    }
})

// 热更新
if (module.hot) {
    module.hot.accept(
        [
            // state不支持热更新
            './getters',
            './actions',
            './mutations',
            './modules/bookstore',
            './modules/account'
        ],
        () => {
            store.hotUpdate({
                // 获取更新后的模块。因为 babel 6 的模块编译格式问题，这里需要加上 .default
                getters: require('./getters').default,
                actions: require('./actions').default,
                mutations: require('./mutations').default,
                modules: {
                    bookstore: require('./modules/bookstore').default,
                    account: require('./modules/account').default
                }
            })
        }
    )
}

export default store
