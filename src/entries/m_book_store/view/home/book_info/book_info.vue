<template>
    <div class="book-info-page">
        <book-info-header :title='bookInfo.bookName'></book-info-header>
        <div class="main-content">
            <div class="book-info content">
                <div class="book-cover">
                    <img :src="bookInfo.bookCover" alt="">
                </div>
                <div class="info">
                    <h3 class="title">{{this.bookInfo.bookName}}</h3>
                    <p class="author">{{this.bookInfo.author}}</p>
                    <p class="word-count">{{this.bookInfo.wordCount}} 字
                        <span :class="{'finish-tag':bookInfo.isFinish}" class="tag">{{this.bookInfo.isFinish?'已完成':'连载中'}}</span>
                    </p>
                </div>
            </div>
            <div class="btn-action book-des content">
                <Button @click="jumoToReader" type="primary">开始阅读</Button>
                <Button class="fr" @click="addTobookshelf">加入书架</Button>
                <div v-text='bookInfo.bookDesInfo' class="des">
                </div>
                <div class="footer-tail">
                    最新：{{this.bookInfo.latestTitle}} 更新于{{this.bookInfo.updateTime}}
                </div>
            </div>
            <div class="tag-group content">
                <h3>类别标签</h3>
                <div class="tag-content">
                    <div class="item" v-for='(item,index) in bookInfo.categories'>
                        {{item.label}}
                    </div>
                </div>
            </div>
            <div class="author-other-books content">
                <h3>作者其他图书</h3>
                <div class="item-group">
                    <div class="item" v-for='(item,index) in bookInfo.authorOtherBooks'>
                        <div class="img-content">
                            <img :src="item.cover" alt="">
                        </div>
                        <p>{{item.title}}</p>
                    </div>
                </div>
            </div>
            <div class="rights content">
                <h1>图书信息</h1>
                <p>版权：{{this.bookInfo.rights}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui'
    import {mapState, mapActions, mapMutations} from 'vuex'
    import bookInfoHeader from '../componets/book_info_header.vue'

    export default {
        name: 'book-info-page',
        data() {
            return {
                bookInfo: {}
            }
        },
        computed: {
            ...mapState({
                vxCurrentBookId: state => state.bookstore.currentBookId,
                vxEmail: state => state.account.myAccount.email
            }),
        },
        methods: {
            ...mapActions({
                vxGetBookDesInfo: 'bookstore/getBookDesInfo',
                vxAddBookshelf: 'account/addBookshelf',
                vxGetBookshelfList: 'account/getBookshelfList'
            }),
            ...mapMutations({
                vxSetCurrenReadBook: 'bookstore/setCurrenReadBook'
            }),
            jumoToReader() {
                this.vxSetCurrenReadBook({bookId: this.bookInfo.id, chapterId: 0})
                this.$router.push({
                    name: 'reader'
                })
            },
            async addTobookshelf() {
                if (this.vxEmail) {
                    try {
                        await this.vxAddBookshelf({bookId: this.vxCurrentBookId, email: this.vxEmail})
                        await this.vxGetBookshelfList({email: this.vxEmail})
                        Toast({message: '加入成功'})
                    } catch (error) {
                        Toast({message: error.message})
                    }
                } else {
                    Toast({message: '请先登录'})
                }
            }
        },
        async mounted() {
            const res = await this.vxGetBookDesInfo({bookId: this.vxCurrentBookId})
            this.bookInfo = res
        },
        components: {
            bookInfoHeader
        }

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .book-info-page {
        background: #efeff0;
        overflow: hidden;
        .main-content {
            margin-top: 45px;
            .content {
                padding: 0 14px;
                background: #fff;
                width: 100vw;
            }
            .book-info {
                display: flex;
                align-items: center;
                padding: 30px 20px 30px 30px;
                .book-cover {
                    width: 50%;
                    margin-right: 18px;
                    img {
                        width: 100%;
                    }
                }
                .info {
                    width: 282px;
                    .title {
                        margin-bottom: 13px;
                        font-size: 16px;
                        overflow: hidden;
                        color: #000;
                        font-weight: 400;
                    }
                    .author {
                        color: #4b99a7;
                        line-height: 1.4;
                        font-size: 12px;
                    }
                    .word-conut {
                        color: #6e6e6e;
                        font-size: 12px;
                    }
                    .tag {
                        border: 1px solid #63bd6e;
                        color: #63bd6e;
                        border-radius: 4px;
                        font-size: 12px;
                        line-height: 16px;
                        display: inline-block;
                        transform: scale(0.83);
                        padding: 0 2px;
                        margin-left: 3px;
                    }
                    .finish-tag {
                        color: #55b4ec;
                        border-color: #00a0e9;
                    }
                }
            }
            .btn-action {
                width: 100%;
                button {
                    width: 45%;
                }
                .fr {
                    float: right;
                }
            }
            .book-des {
                .des {
                    margin-top: 10px;
                    position: relative;
                    line-height: 1.6;
                    padding: 0 14px;
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #585858;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                }
                .footer-tail {
                    padding: 10px 14px;
                    text-align: center;
                    font-size: 14px;
                    border-top: 1px solid #f0f0f0;
                    color: #8d8d8d;
                }
            }
            .tag-group {
                margin-top: 10px;
                min-height: 75px;
                h3 {
                    font-size: 16px;
                    font-weight: normal;
                    color: #8d8d8d;
                    padding: 14px 14px 0px;
                }
                .tag-content {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    min-height: 75px;
                    align-items: center;
                }
                .item {
                    width: auto;
                    height: 27px;
                    padding: 0 20px;
                    color: #766d5d;
                    border-radius: 4px;
                    font-size: 14px;
                    text-align: center;
                    border: 1px solid #d3d3d3;
                    background-color: #fbebe8;
                    display: flex;
                    align-items: center;
                    margin-right: 10px;
                }
            }
            .author-other-books {
                margin-top: 10px;
                h3 {
                    padding-top: 15px;
                    font-size: 15px;
                    color: #8d8d8d;
                    padding-left: 14px;
                    padding-right: 14px;
                    padding-bottom: 8px;
                }
                .item-group {
                    display: flex;
                    .item {
                        width: 33.3%;
                        .img-content {
                            width: 86px;
                        }
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
            .rights {
                color: #8d8d8d;
                margin-top: 10px;
                height: 64px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                h1 {
                    padding-top: 10px;
                    font-size: 15px;
                    font-weight: 400;
                }
                p {
                    line-height: 1.6;
                    font-size: 14px;
                }
            }
        }
    }
</style>