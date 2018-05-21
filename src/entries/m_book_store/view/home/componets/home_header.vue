<template>
    <div class="home-header">
        <div @click='jumpToHome' class="left-icon">
            <svg class="icon icon-book-2" aria-hidden="false">
                <use xlink:href="#icon-book-2"></use>
            </svg>
        </div>
        <div @click='jumpToUserInfo' class="right-icon">
            <svg class="icon icon-yonghu" aria-hidden="false">
                <use xlink:href="#icon-yonghu"></use>
            </svg>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'home-header',
        data() {
            return {

            }
        },
        computed: {
            ...mapState({
                vxEmail: state => state.account.myAccount.email,
                vxCurrentBookId: state => state.bookstore.currentBookId,
            }),
        },
        methods: {
            ...mapActions({
                vxGetBookDesInfo: 'bookstore/getBookDesInfo',
            }),
            jumpToUserInfo() {
                if (this.vxEmail) {
                    this.$router.push({
                        name: 'userInfo'
                    })
                } else {
                    this.$router.push({
                        name: 'login'
                    })
                }
            },
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
    .home-header {
        position: relative;
        top: 0;
        z-index: 2;
        font-size: 16px;
        div {
            position: absolute;
            padding: 8px 12px;
        }
        .left-icon {
            left: 0;
        }
        .right-icon {
            right: 0;
        }
    }
</style>