<template>
    <div class="more-book-list">
        <book-info-header :title='title'></book-info-header>
        <Scroll :height='windowHeight' :on-reach-bottom="handleReachBottom">
            <Card class="item-group" dis-hover v-for='(item,index) in bookList' :key="index">
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
            </Card>
        </Scroll>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import { Toast } from 'mint-ui'
    import { get as _get } from 'lodash'
    import bookInfoHeader from '../componets/book_info_header.vue'

    export default {
        name: 'more-book-list',
        data() {
            return {
                bookList: [],
                showNum: 5,
                addNum: 5
            }
        },
        computed: {
            ...mapState({
                vxHomeInfo: state => state.bookstore.homeInfo,
                vxCurrentHomeInfoIndex: state => state.bookstore.currentHomeInfoIndex,
            }),
            bookListAll() {
                return _get(this.vxHomeInfo[this.vxCurrentHomeInfoIndex].data, 'data') || []
            },
            title() {
                return _get(this.vxHomeInfo[this.vxCurrentHomeInfoIndex], 'ad_name') || ''
            },
            windowHeight() {
                return document.body.offsetHeight
            }
        },
        methods: {
            handleReachBottom() {
                return new Promise(resolve => {
                    setTimeout(() => {
                        if (this.bookListAll.length > this.showNum) {
                            this.showNum += this.addNum
                            this.bookList = this.bookListAll.slice(0, this.showNum)
                        } else {
                            console.log('没有更多');
                            Toast({ message: '没有更多' })
                        }
                        resolve();
                    }, 1000);
                });
            },
            ...mapMutations({
                vxSetCurrenReadBook: 'bookstore/setCurrenReadBook'
            }),
            jumpToBookInfo(bookId) {
                console.log({ bookId });
                this.vxSetCurrenReadBook({ bookId, chapterId: 0 })
                this.$router.push({
                    name: 'bookInfo'
                })
            }
        },
        mounted() {
            this.bookList = this.bookListAll.slice(0, this.showNum)
            console.log(this.$route.params.title);
        },
        components: {
            bookInfoHeader
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .more-book-list {
        .ivu-card-bordered {
            border: unset;
        }
        .ivu-card-body {
            padding: 0;
        }
        margin-top: 45px;
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