/**
 * Created by Hobby on 2018/4/27.
 */

import httpRequestor from '../common_libs/http_requestor'

/**
 * 所有用户列表
 * @return {Promise}
 */
export const getUsers = () => {
    return httpRequestor.get('/admin/all_users')
}

/**
 * 后台管理员登录
 * @param {string} account 管理员的帐号
 * @param {string} passWd 管理员的密码
 * @return {Promise}
 */
export const adminLogin = (account, passWd) => {
           return httpRequestor.post('/admin/admin_login', {account, passWd})
       }

/**
 * 删除用户
 * @param {string} account 管理员的帐号
 * @param {string} email 用户的邮箱
 * @return {Promise}
 */
export const removeUser = (account, email) => {
    return httpRequestor.post('/admin/remove_user', {account, email})
}
