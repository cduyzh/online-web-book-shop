<template>
    <div class="book-info-header">
        <svg @click='jumpToHome' class="icon icon-back-btn" aria-hidden="false">
            <use xlink:href="#icon-back"></use>
        </svg>
        <div class="nav-title">
            {{this.title}}
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'book-info-header',
        props: {
            title: {
                type: String,
                default: '返回',
            },
        },
        data() {
            return {

            }
        },
        computed: {
            ...mapState({
                vxCurrentBookId: state => state.bookstore.currentBookId,
            }),
        },
        methods: {
            ...mapActions({

            }),
            jumpToHome() {
                this.$router.push({
                    name: 'homeContent'
                })
            }
        },
        mounted() {

        }

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .book-info-header {
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
</style>