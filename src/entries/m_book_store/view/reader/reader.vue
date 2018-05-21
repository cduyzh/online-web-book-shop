<template>
    <div class="book-render">
        <div class="container" id="root">
            <div class="m-artical-action">
                <div @click='handleClickCenter' class="artical-action-mid" id="action_mid"></div>
                <div @click='showTopAction=!showTopAction' class="artical-action-top" id="action_mid"></div>
                <div @click='showBottomAction=!showBottomAction' class="artical-action-bottom" id="action_mid"></div>
            </div>
            <div :style='styleBgObject' class="m-read-content">
                <h4 v-text='this.contentTitle'></h4>
                <p v-for="(item,index) in contentList">{{item}}</p>
            </div>
            <div class="top-nav" :style="{display:showTopAction?'flex':'none'}">
                <div @click='jumpToBookInfo' class="top-nav-warp">
                    <svg class="icon icon-back-btn" aria-hidden="false">
                        <use xlink:href="#icon-back"></use>
                    </svg>
                    <div class="nav-title">
                        返回介绍
                    </div>
                </div>
            </div>
            <div class="font-size-nav" :style="{display:showFontSizeAction?'flex':'none'}">
                <div class="child-mod">
                    <span>字号</span>
                    <span @click='handleClickFontSize(1)' class="spe-button">
                        大
                    </span>
                    <span @click='handleClickFontSize(-1)' class="spe-button" style="margin-left:10px;">
                        小
                    </span>
                </div>
                <div class="child-mod">
                    <span>背景</span>
                    <span @click='currentBgColor=item.bgColor;currentBgColorIndex=index' :style='{background:item.bgColor}' class="item-border" :class="{'active-item':currentBgColorIndex===index}" v-for="(item,index) in backgroundGroup">
                    </span>
                </div>
            </div>
            <div v-if='showBottomAction&&!showFontSizeAction' class="chapter-bar">
                <div @click="toPreviousChapter" class="pre-chapter">
                    上一章
                </div>
                <div class="chapter-info">
                    {{this.currentChapter}}/{{this.totalChapter}}
                </div>
                <div @click='toNextChapter' class="next-chapter">
                    下一章
                </div>
            </div>
            <div class="bottom-nav" :style="{display:showBottomAction?'flex':'none'}">
                <div @click='jumpToCatalog' class="item">
                    <div class="item-warp">
                        <svg class="icon icon-mulu1" aria-hidden="false">
                            <use xlink:href="#icon-mulu1"></use>
                        </svg>
                        <p>
                            目录
                        </p>
                    </div>
                </div>
                <div @click='showFontSizeAction=!showFontSizeAction' class="item">
                    <div class="item-warp">
                        <svg class="icon icon-ziti" aria-hidden="false">
                            <use xlink:href="#icon-ziti"></use>
                        </svg>
                        <p class="icon-text">
                            字体
                        </p>
                    </div>
                </div>
                <div @click='isNightMode=!isNightMode' class="item">
                    <div v-if='isNightMode' class="item-warp">
                        <svg class="icon icon-sun" aria-hidden="false">
                            <use xlink:href="#icon-sun"></use>
                        </svg>
                        <p class="icon-text">
                            白天
                        </p>
                    </div>
                    <div v-else class="item-warp">
                        <svg class="icon icon-moon" aria-hidden="false">
                            <use xlink:href="#icon-moon"></use>
                        </svg>
                        <p class="icon-text">
                            夜间
                        </p>
                    </div>
                </div>
                <div class="item">
                    <div class="item-warp">
                        <svg class="icon icon-download1" aria-hidden="false">
                            <use xlink:href="#icon-download1"></use>
                        </svg>
                        <p class="icon-text">
                            下载
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Toast} from 'mint-ui'
    import {mapState, mapActions, mapMutations} from 'vuex'

    export default {
        name: 'book-render',
        data() {
            return {
                // 当前文章数据
                contentTitle: '',
                contentList: [],
                // 顶部菜单显示
                showTopAction: false,
                // 底部菜单显示
                showBottomAction: false,
                // 夜间模式
                isNightMode: false,
                // 字体设置
                showFontSizeAction: false,
                backgroundGroup: [{
                    bgColor: '#f7eee5'
                },
                {
                    bgColor: '#e9dfc7'
                },
                {
                    bgColor: '#a4a4a4'
                },
                {
                    bgColor: '#cdefce'
                },
                ],
                currentBgColor: '#f7eee5',
                currentBgFontSize: 14,
                currentBgColorIndex: 0,
                detailRes: {}
            }
        },
        computed: {
            ...mapState({
                vxCurrentCatalog: state => state.bookstore.currentCatalog,
                vxCurrentBookId: state => state.bookstore.currentBookId,
                vxCurrentChapterId: state => state.bookstore.currentChapterId,
            }),
            LightBgColor() {
                return {
                    background: this.currentBgColor,
                    color: '#4e534f',
                    fontSize: `${this.currentBgFontSize}px`
                }
            },
            styleBgObject() {
                if (!this.isNightMode) {
                    return this.LightBgColor
                } else {
                    return {
                        background: '#0f1410',
                        color: '#4e534f',
                        fontSize: `${this.currentBgFontSize}px`
                    }
                }
            },
            totalChapter() {
                return this.vxCurrentCatalog.length + 1
            },
            currentChapter() {
                return this.vxCurrentChapterId + 1
            },

        },
        methods: {
            ...mapMutations({
                vxSetCurrentChapterId: 'bookstore/setCurrentChapterId'
            }),
            ...mapActions({
                vxGetChapters: 'bookstore/getChapters',
                vxGetChaptersDetails: 'bookstore/getChaptersDetails',
            }),
            handleClickCenter() {
                if (this.showBottomAction && this.showTopAction) {
                    this.showBottomAction = false
                    this.showTopAction = false
                    this.showFontSizeAction = false
                } else {
                    this.showBottomAction = true
                    this.showTopAction = true
                }
            },
            handleClickFontSize(num) {
                if (this.currentBgFontSize > 19 || this.currentBgFontSize < 13) {
                    Toast({
                        message: '超出最大或最小字体限制'
                    })
                    this.currentBgFontSize = this.currentBgFontSize === 20 ? 19 : 13
                } else {
                    this.currentBgFontSize += num
                }
            },
            async toNextChapter() {
                try {
                    this.detailRes = await this.vxGetChaptersDetails({bookId: this.vxCurrentBookId, chapterId: this.vxCurrentChapterId + 1})
                    this.vxSetCurrentChapterId({chapterId: this.vxCurrentChapterId + 1})
                } catch (error) {
                    if (error.code === 2028) {
                        Toast({message: error.message})
                    }
                }
                this.refresh()
            },
            async  toPreviousChapter() {
                try {
                    this.detailRes = await this.vxGetChaptersDetails({bookId: this.vxCurrentBookId, chapterId: this.vxCurrentChapterId - 1})
                    this.vxSetCurrentChapterId({chapterId: this.vxCurrentChapterId - 1})
                } catch (error) {
                    if (error.code === 2028) {
                        Toast({message: error.message})
                    }
                }
                this.refresh()
            },
            jumpToCatalog() {
                this.$router.push({name: 'catalog'})
            },
            jumpToBookInfo() {
                this.$router.push({name: 'bookInfo'})
            },
            refresh() {
                this.contentTitle = this.detailRes.t
                this.contentList = this.detailRes.p
            },
        },
        async mounted() {
            await this.vxGetChapters({bookId: this.vxCurrentBookId})
            const detailRes = await this.vxGetChaptersDetails({
                bookId: this.vxCurrentBookId,
                chapterId: this.vxCurrentChapterId
            })
            this.detailRes = detailRes
            this.contentTitle = detailRes.t
            this.contentList = detailRes.p
            console.log(detailRes);
        },
        created() {},

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../../../common_assets/animation';
    @import '../../assets/scss/common.scss';
    @import '../../assets/fonts/iconfont/iconfont.css';
    .book-render {
        .m-read-content {
            font-size: 14px;
            color: #333;
            line-height: 31px;
            padding: 15px;
        }
        .m-read-content h4 {
            font-size: 20px;
            color: #736357;
            border-bottom: solid 1px #736357;
            margin: 0 0 1em 0;
            letter-spacing: 2px;
        }
        .m-read-content p {
            text-indent: 2em;
            margin: 0.5em 0;
            text-align: justify;
            letter-spacing: 0px;
            line-height: 24px;
        }
        .artical-action-top {
            position: fixed;
            top: 0px;
            height: 30%;
            width: 100%;
            z-index: 90;
        }
        .artical-action-mid {
            position: fixed;
            top: 30%;
            height: 40%;
            width: 100%;
            z-index: 10002;
        }
        .artical-action-bottom {
            position: fixed;
            bottom: 0px;
            height: 70px;
            width: 100%;
            z-index: 90;
        }
        .top-nav {
            position: fixed;
            top: 0px;
            height: 50px;
            background: rgba(0, 0, 0, 0.9);
            width: 100%;
            opacity: 1;
            z-index: 10004;
            align-items: center;
            .top-nav-warp {
                display: flex;
                margin-left: 20px;
            }
            .icon-back-btn {
                margin-right: 10px;
                color: #fff;
                font-size: 18px;
            }
            .nav-title {
                color: #d5d5d6;
            }
        }
        .bottom-nav {
            position: fixed;
            bottom: 0px;
            height: 70px;
            background: rgba(0, 0, 0, 0.9);
            width: 100%;
            opacity: 1;
            z-index: 10004;
            margin: 0 auto;
            text-align: center;
            .item {
                display: flex;
                width: 32%;
                color: #fff;
                text-align: center;
                margin: 0 auto;
                align-items: center;
                justify-content: center;
                .item-warp {
                    .icon {
                        font-size: 16px;
                        color: #fff;
                    }
                    p {
                        margin-top: 5px;
                        font-size: 10px;
                    }
                }
            }
        }
        .chapter-bar {
            position: fixed;
            bottom: 70px;
            height: 48px;
            background: rgba(0, 0, 0, 0.9);
            width: 100%;
            color: #fff;
            display: flex;
            align-items: center;
            text-align: center;
            font-size: 13px;
            .pre-chapter {
                width: 25%;
            }
            .next-chapter {
                width: 25%;
            }
            .chapter-info {
                width: 50%;
            }
        }
        .font-size-nav {
            position: fixed;
            bottom: 70px;
            height: 115px;
            background: rgba(0, 0, 0, 0.9);
            width: 100%;
            color: #fff;
            z-index: 10004;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 5px 20px;
            span {
                font-size: 14px;
            }
            .child-mod {
                display: flex;
                align-items: center;
                padding: 15px 10px;
                .item-border {
                    width: 30px;
                    height: 30px;
                    border-radius: 15px;
                    margin-left: 20px;
                }
                .active-item {
                    width: 32px;
                    height: 32px;
                    border: 1.5px solid #ff7800;
                    border-radius: 50%;
                }
            }
            .spe-button {
                border: 1px solid #8c8c8c;
                border-radius: 16px;
                padding: 5px 40px;
                font-size: 13px;
                line-height: 16px;
                color: #fff;
                margin-left: 20px;
            }
        }
    }
</style>