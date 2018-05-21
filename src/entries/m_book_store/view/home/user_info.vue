<template>
    <div class="user-info">
        <book-info-header></book-info-header>
        <div class="user-content">
            <div class="user-balance">
                <img src="http://www.duokan.com/hs/static/images/avatar.png">
                <div class="info">
                    <h3>{{this.vxUserAccount.email}}，您现在拥有</h3>
                    <p>
                        <svg class="icon icon--jinbi" aria-hidden="false">
                            <use xlink:href="#icon--jinbi"></use>
                        </svg>
                        {{this.vxUserAccount.assetCoin}}
                        <svg class="icon icon-quan" aria-hidden="false">
                            <use xlink:href="#icon-quan"></use>
                        </svg>
                        {{this.vxUserAccount.assetChapter}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import bookInfoHeader from './componets/book_info_header.vue'

    export default {
        name: 'user-info',
        data() {
            return {
                userAccount: 'xxx28065xxx',
                assetCoin: 11,
                assetChapter: 11
            }
        },
        computed: {
            ...mapState({
                vxUserAccount: state => state.account.myAccount,
            }),
        },
        components: {
            bookInfoHeader
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .user-info {
        .user-content {
            margin-top: 45px;
            .user-balance {
                display: flex;
                align-items: center;
                height: 82px;
                padding: 0 15px;
                color: #6b3416;
                img {
                    width: 36px;
                    margin-right: 20px;
                }
                .info {
                    p {
                        font-size: 12px;
                    }
                    .icon-quan {
                        margin-left: 20px;
                    }
                }
            }
        }
    }
</style>