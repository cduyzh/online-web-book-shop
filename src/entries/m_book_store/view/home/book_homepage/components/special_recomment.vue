<template>
    <div v-if='vxHomeInfo' class="special-recomment">
        <h3 class="title">
            重磅推荐
            <svg aria-hidden="false" class="icon icon-tubiao303">
                <use xlink:href="#icon-tubiao303"></use>
            </svg>
        </h3>

        <div class="item-group">
            <div class="item" :key='index' v-for="(item,index) in hotBookList">
                <div class="first-item" v-if='index===0'>
                    <div class="left-cover">
                        <img :src="item.cover" alt="">
                    </div>
                    <div class="right-info">
                        <p class="title">{{item.title}}</p>
                        <p class="author">{{item.authors}}</p>
                        <p class="summary">{{item.summary}}</p>
                        <div class="tags">
                            <div class="tags-item" :key='index' v-for="(item,index) in item.tags">
                                {{item}}
                            </div>
                        </div>

                    </div>
                </div>
                <div v-else>
                    <p>
                        <span class="num">{{'0'+(index+1)}}</span> {{item.title}}
                        <span class="authors">{{item.authors}}</span>
                    </p>

                </div>

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
        name: 'special-recomment',
        data() {
            return {}
        },
        computed: {
            ...mapState({
                vxHomeInfo: state => state.bookstore.homeInfo,
            }),
            hotBookList() {
                return _get(this.vxHomeInfo[HOME_SHOW_TYPE.specialRecomment].data, 'data').slice(0, 5) || []
            }
        },
        methods: {
            ...mapMutations({
                vxSetHomeInfoIndex: 'bookstore/setHomeInfoIndex'
            }),
            jumpToMore() {
                this.vxSetHomeInfoIndex({homeInfoIndex: HOME_SHOW_TYPE.specialRecomment})
                this.$router.push({
                    name: 'moreBookList',
                })
            }
        }

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .special-recomment {
        margin-top: 10px;
        background: #fff;
        .title {
            font-size: 16px;
            font-weight: normal;
            color: #333;
            padding: 10px 14px;
            border-bottom: 1px solid #f0f0f0;
        }
        .icon-tubiao303 {
            color: #53ac7d;
            font-size: 18px;
        }
        .item-group {
            display: flex;
            flex-wrap: wrap;
            padding: 0 13px;
            flex-direction: column;
            .item {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                flex-direction: column;
                padding: 17px 0;
                border-bottom: 1px solid #f0f0f0;
                .first-item {
                    display: flex;
                }
                .left-cover {
                    flex: 1 1 200px;
                    height: 113px;
                    margin-right: 15px;
                }
                .right-info {
                    .title {
                        margin-bottom: 4px;
                        font-size: 16px;
                        color: rgba(0, 0, 0, 0.9);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        padding: 0;
                        border-bottom: unset;
                    }
                    .author {
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.7);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .summary {
                        display: -webkit-box;
                        margin: 6px 0 0;
                        height: 2.8em;
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.6);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    .tags {
                        display: flex;
                        margin-top: 10px;
                        padding-top: 3px;
                        overflow: hidden;
                        .tags-item {
                            margin: -3px 7px 0 0;
                            padding: 3px 6px 2px;
                            max-width: 6em;
                            font: 10px/11px a;
                            color: #53ac7d;
                            border-radius: 3px;
                            border: 1px solid #53ac7d;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .num {
                    font-size: 13px;
                    margin-right: 15px;
                    color: rgba(237, 83, 15, 0.9);
                }
                .authors {
                    color: rgba(0, 0, 0, 0.4);
                    font-size: 12px;
                    margin-left: 13px;
                }
                p {
                    /* padding: 8px 16px 0; */
                    font-size: 15px;
                    color: rgba(0, 0, 0, 0.9);
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .know-more {
            text-align: center;
            font-size: 14px;
            padding: 10px 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>