import * as api from 'api/book_store'
import moment from 'moment'
import util from '../../../../../common_libs/util'

import {HOME_SHOW_TYPE} from '../../../libs/const'

export default {
    namespaced: true,
    state: {
        currentBookId: util.localStorage.C_BOOKID || 0,
        currentCatalog: util.localStorage.C_CATALOG || [],
        currentChapterId: util.localStorage.C_CHAPTER_ID || 0,
        homeInfo: util.localStorage.C_HOME_INFO || [], // 首页的所有展示数据信息
        currentHomeInfoIndex: util.localStorage.C_HOME_SHOW_TYPE_INDEX || HOME_SHOW_TYPE.hot // 当前首页展示数据数组的下标值
    },
    getters: {},
    mutations: {
        setCurrentCatalog(state, {bookId, currentCatalog}) {
            state.currentCatalog = currentCatalog
            util.localStorage.C_CATALOG = currentCatalog
            util.localStorage.C_BOOKID = bookId
        },
        setCurrentChapterId(state, {chapterId}) {
            state.currentChapterId = chapterId
            util.localStorage.C_CHAPTER_ID = chapterId
        },
        setCurrenReadBook(state, {bookId, chapterId}) {
            state.currentChapterId = chapterId
            state.currentBookId = bookId
            util.localStorage.C_BOOKID = bookId
            util.localStorage.C_CHAPTER_ID = chapterId
        },
        setHomeInfo(state, {homeInfo}) {
            state.homeInfo = homeInfo
            util.localStorage.C_HOME_INFO = homeInfo
        },
        setHomeInfoIndex(state, {homeInfoIndex}) {
            state.currentHomeInfoIndex = homeInfoIndex
            util.localStorage.C_HOME_SHOW_TYPE_INDEX = homeInfoIndex
        }
    },
    actions: {
        // 获取文章目录
        async getChapters({commit}, {bookId}) {
            const res = await api.getChapters(bookId)
            commit('setCurrentCatalog', {bookId, currentCatalog: res.chapters})
            return res
        },
        // 获取文章详情
        getChaptersDetails(context, {bookId, chapterId}) {
            util.localStorage.C_CHAPTER_ID = chapterId
            return api.getChaptersDetails(bookId, chapterId)
        },
        // 获取图书介绍信息
        async getBookDesInfo(context, {bookId}) {
            const res = await api.getBookDesInfo(bookId)
            const bookInfo = {
                updateTime: moment(new Date(res.item.updated * 1000)).format('YYYY-MM-DD HH:mm') || '', // 格式化时间戳的格式
                bookName: res.item.title || '',
                id: res.item.fiction_id || '',
                bookCover: res.item.cover || '',
                author: res.item.authors || '',
                bookDesInfo: res.item.content || '',
                wordCount: res.item.word_count || 0,
                rights: res.item.rights || '',
                categories: res.item.categories || [],
                isFinish: res.item.finish || false,
                latestTitle: res.item.latest || '',
                authorOtherBooks: res.author_books || []
            }
            return bookInfo
        },
        async getHomeInfo({commit}) {
            const res = await api.getHomePageInfo()
            commit('setHomeInfo', {homeInfo: res.items})
            return res
        },
        // 测试get api
        async testApi() {
            const res = await api.testApi()
            return res
        },
        // 测试post api
        async testPostApi(context, {min, max}) {
            const res = await api.testPostApi(min, max)
            return res
        }
    }
}
