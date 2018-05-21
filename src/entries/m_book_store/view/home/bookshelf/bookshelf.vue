<template>
    <div class="bookshelf-page">
        <div class="item-group" v-for='(item,index) in vxBookShelfList'>
            <div @click='jumpToBookInfo(item.fiction_id)' class="item">
                <div class="book-cover">
                    <img :src="item.cover" alt="">
                </div>
                <div class="book-info">
                    <h3>{{item.title}}</h3>
                    <p class="author">{{item.authors}}</p>
                    <p class="latest-chapter">最新：{{item.latest}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex'
    import store from '../../../store'

    export default {
        name: 'bookshelf-page',
        data() {
            return {

            }
        },
        computed: {
            ...mapState({
                vxBookShelfList: state => state.account.bookShelfList,
                vxEmail: state => state.account.myAccount.email
            }),
        },
        methods: {
            ...mapActions({
                vxGetBookshelfList: 'account/getBookshelfList',
            }),
            ...mapMutations({
                vxSetCurrenReadBook: 'bookstore/setCurrenReadBook'
            }),
            jumpToBookInfo(bookId) {
                // TODO 存下当前书籍阅读的章节方便读取，默认现在都是从第一章节开始
                this.vxSetCurrenReadBook({bookId, chapterId: 0})
                this.$router.push({name: 'bookInfo'})
            }
        },
        async mounted() {
            if (this.vxBookShelfList.length === 0 && this.vxEmail) {
                await this.vxGetBookshelfList({email: this.vxEmail})
            }
        },
        beforeRouteEnter(to, from, next) {
            if (store.getters['account/isLoggedIn']) {
                next()
            } else {
                // next()
                next({name: 'userInfo'})
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .bookshelf-page {
        .item-group {
            padding: 13px 20px;
            border-bottom: 1px solid #f0f0f0;
            .item {
                display: flex;
                align-items: center;
                img {
                    width: 100%;
                    height: 100%;
                }
                .book-cover {
                    width: 104px;
                    height: 136px;
                    margin-right: 20px;
                }
                .book-info {
                    h3 {
                        margin-bottom: 4px;
                        font-size: 16px;
                        font-weight: 400;
                        color: #000;
                    }
                    .author {
                        color: #666;
                        margin-top: 4px;
                        font-size: 12px;
                    }
                    .latest-chapter {
                        margin-top: 4px;
                        font-size: 12px;
                        color: #8d8d8d;
                    }
                }
            }
        }
    }
</style>