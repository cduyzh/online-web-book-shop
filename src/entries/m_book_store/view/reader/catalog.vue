<template>
    <div class="novel-catalog">
        <div class="head">
            <svg @click='jumpToReader' class="icon icon-back-btn" aria-hidden="false">
                <use xlink:href="#icon-back"></use>
            </svg>
            <div class="nav-title">
                目录
            </div>
        </div>
        <div class="content">
            <div @click='jumpToAppointChapter(index)' class="item" :key='index' v-for='(item,index) in vxCurrentCatalog'>
                <span v-text='item.label' class="chapter-title"></span>
            </div>
        </div>
    </div>
</template>

<script>
    // import { Toast } from 'mint-ui'
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: 'novel-catalog',
        data() {
            return {}
        },
        computed: {
            ...mapState({
                vxCurrentCatalog: state => state.bookstore.currentCatalog
            }),
        },
        methods: {
            ...mapMutations({
                vxSetCurrentChapterId: 'bookstore/setCurrentChapterId'
            }),
            jumpToReader() {
                this.$router.push({
                    name: 'reader'
                })
            },
            jumpToAppointChapter(chapterId) {
                this.vxSetCurrentChapterId({chapterId})
                this.jumpToReader()
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../../../common_assets/animation';
    @import '../../assets/scss/common.scss';
    @import '../../assets/fonts/iconfont/iconfont.css';
    .novel-catalog {
        .head {
            height: 44px;
            background: #efeff0;
            border-bottom: 1px solid #ddd;
            color: rgba(0, 0, 0, 0.7);
            position: relative;
            display: flex;
            align-items: center;
            padding-left: 20px;
            position: fixed;
            top: 0;
            width: 100vw;
            z-index: 1;
            .nav-title {
                font-size: 15px;
            }
            .icon-back-btn {
                margin-right: 10px;
                color: #a7a7a8;
                font-size: 18px;
            }
        }
        .content {
            position: absolute;
            top: 45px;
            overflow: auto;
            .item {
                padding: 0 14px;
                height: 40px;
                border-bottom: 1px solid #eee;
                width: 100vw;
                display: flex;
            }
            .chapter-title {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                font-size: 14px;
                color: #555;
            }
        }
    }
</style>