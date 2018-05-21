import * as api from 'api/book_store'
import util from '../../../../../common_libs/util'

export default {
    namespaced: true,
    state: {
        myAccount: util.localStorage.ACCOUNT || {
            uin: 0,
            nickName: '',
            phone: '',
            email: ''
        },
        bookShelfList: util.localStorage.USER_BOOKSHELF || []
    },
    getters: {
        // 是否已登录
        isLoggedIn(state) {
            return !!state.myAccount.email
        }
    },
    mutations: {
        setMyAccount(state, {uin, email, assetCoin, assetChapter}) {
            state.myAccount = {
                uin: uin || 0,
                email: email || '',
                assetCoin: assetCoin || 0,
                assetChapter: assetChapter || 0
            }
            util.localStorage.ACCOUNT = state.myAccount
        },
        setBookShelfList(state, {bookShelfList}) {
            state.bookShelfList = bookShelfList
            util.localStorage.USER_BOOKSHELF = bookShelfList
        }
    },
    actions: {
        // 获取用户书架内容
        async getBookshelfList({commit}, {email}) {
            const res = await api.getBookshelfList(email)
            commit('setBookShelfList', {bookShelfList: res.bookShelfList})
            return res
        },
        // 加入书架
        async addBookshelf({commit}, {bookId, email}) {
            const res = await api.addBookShelf(bookId, email)
            commit('setBookShelfList', {bookShelfList: res.bookShelfList})
            return res
        },
        // 注销帐号
        logOut({commit}) {
            localStorage.clear()
            commit('setMyAccount', {})
        },
        // 登录或注册
        async login({commit}, {email, passWd}) {
            const res = await api.login(email, passWd)
            commit('setMyAccount', {uin: res.uin, email, assetCoin: res.assetCoin, assetChapter: res.assetChapter})
            return res
        }
    }
}
