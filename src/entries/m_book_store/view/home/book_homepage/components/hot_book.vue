<template>
    <div v-if='vxHomeInfo' class="hot-book">
        <h3 class="title">本周最火</h3>
        <div class="item-group">
            <div class="item" :key='index' v-for="(item,index) in hotBookList">
                <div @click="jumoToBookInfo(item.fiction_id)" class="item-info">
                    <img :src="item.cover" alt="">
                </div>
                <p>{{item.title}}</p>
            </div>
        </div>
        <div @click='jumpToMore' class="know-more">
            查看更多
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import {get as _get} from 'lodash'
    import {HOME_SHOW_TYPE} from '../../../../libs/const.js'

    export default {
        name: 'hot-book',
        data() {
            return {}
        },
        computed: {
            ...mapState({
                vxHomeInfo: state => state.bookstore.homeInfo,
            }),
            hotBookList() {
                return _get(this.vxHomeInfo[HOME_SHOW_TYPE.hot].data, 'data') || []
            }
        },
        methods: {
            ...mapMutations({
                vxSetHomeInfoIndex: 'bookstore/setHomeInfoIndex',
                vxSetCurrenReadBook: 'bookstore/setCurrenReadBook'
            }),
            jumpToMore() {
                this.vxSetHomeInfoIndex({homeInfoIndex: HOME_SHOW_TYPE.hot})
                this.$router.push({
                    name: 'moreBookList',
                })
            },
            jumoToBookInfo(bookId) {
                console.log({bookId});
                this.vxSetCurrenReadBook({bookId, chapterId: 0})
                this.$router.push({
                    name: 'bookInfo',
                })
            }
        }

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .hot-book {
        margin-top: 10px;
        background: #fff;
        .title {
            font-size: 16px;
            font-weight: normal;
            color: #333;
            padding: 10px 14px;
            border-bottom: 1px solid #f0f0f0;
            border-left: 6px solid #ffab18;
            margin-bottom: 13px;
        }
        .item-group {
            display: flex;
            flex-wrap: wrap;
            .item {
                width: 33.3%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 8px;
                flex-direction: column;
                .item-info {
                    height: 113px;
                    width: 86px;
                }
                p {
                    padding: 8px 16px 0;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    display: -webkit-box;
                    color: #8d8d8d;
                    font-size: 13px;
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .know-more {
            border-top: 1px solid #f0f0f0;
            text-align: center;
            font-size: 14px;
            padding: 10px 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>