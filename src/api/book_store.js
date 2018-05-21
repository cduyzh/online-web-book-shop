/**
 * Created by Hobby on 2018/04/22.
 */

import httpRequestor from '../common_libs/http_requestor'

/**
 * 获取小说文章目录
 * @param {string} bookId 书的id
 * @return {Promise}
 */
export const getChapters = bookId => {
    return httpRequestor.post('/book/chapters', {bookId})
}

/**
 * 获取小说文章详情
 * @param {string} bookId 书的id
 * @param {string} chapterId 章节id
 * @return {Promise}
 */
export const getChaptersDetails = (bookId, chapterId) => {
    return httpRequestor.post('/book/currentdetail', {bookId, chapterId})
}

/**
 * 获取小说介绍信息
 * @param {string} bookId 书的id
 * @return {Promise}
 */
export const getBookDesInfo = bookId => {
    return httpRequestor.post('/book/current_book_info', {bookId})
}

/**
 * 获取用户书架内容
 * @param {string} email 邮箱
 * @return {Promise}
 */
export const getBookshelfList = email => {
    return httpRequestor.post('/book/bookshelf_list', {email})
}

/**
 * 获取首页展示信息的内容
 * @return {Promise}
 */
export const getHomePageInfo = () => {
    return httpRequestor.get('/book/home')
}

/**
 * 登录和注册
 * @param {string} email 邮箱
 * @param {string} passWd 密码
 * @return {Promise}
 */
export const login = (email, passWd) => {
    return httpRequestor.post('/book/login', {email, passWd})
}

/**
 * 加入书架
 * @param {string} bookId 图书id
 * @param {string} email 邮箱
 * @return {Promise}
 */
export const addBookShelf = (bookId, email) => {
    return httpRequestor.post('/book/add_bookshelf', {bookId, email})
}
/**
 * 测试get api
 * @return {Promise}
 */
export const testApi = () => {
    return httpRequestor.get('/book/test')
}

/**
 * 测试post api
 * @return {Promise}
 */
export const testPostApi = (min, max) => {
    return httpRequestor.post('/book/test/post', {min, max})
}
