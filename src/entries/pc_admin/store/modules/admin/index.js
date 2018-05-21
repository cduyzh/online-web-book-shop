import * as api from 'api/admin'
import util from 'common_libs/util'

export default {
    namespaced: true,
    state: {
        userList: [],
        adminAccount: util.localStorage.ADMIN_ACCOUNT || ''
    },
    getters: {
        // 是否已登录
        isLoggedIn(state) {
            return !!state.adminAccount
        }
    },
    mutations: {
        setUserList(state, {UserLists}) {
            state.userList = UserLists || []
        },
        setAdmin(state, {account}) {
            state.adminAccount = account
            util.localStorage.ADMIN_ACCOUNT = account
        }
    },
    actions: {
        // 所有用户列表
        async getAllusers({commit}) {
            const res = await api.getUsers()
            commit('setUserList', {UserLists: res.allUsers})
            return res
        },
        // 后台管理员登录
        async adminLogin({commit}, {account, passWd}) {
            const res = await api.adminLogin(account, passWd)
            commit('setAdmin', {account})
            return res
        },
        // 删除用户
        async removeUser(context, {account, email}) {
            const res = await api.removeUser(account, email)
            return res
        }
    }
}
