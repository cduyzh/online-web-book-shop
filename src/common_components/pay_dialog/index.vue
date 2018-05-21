<template>
<div class="pay-dialog-wrapper" v-if="visible">
    <div class="pay-dialog">
        <div class="banner">
            <h1 class="title">Get Luxy BLACK</h1>
            <div class="close" @click="close">&times;</div>
            <Carousel v-model="buyValue"
                :dots="'none'"
                autoplay
                loop>
                <Carousel-item
                    v-for="item in payCarousel"
                    :key="item.title">
                    <div class="carousel">
                        <div class="icon" :class="'black-privilege-'+item.id"></div>
                        <h3 class="banner-title">{{item.title}}</h3>
                        <div class="description">{{item.description}}</div>
                    </div>
                </Carousel-item>
            </Carousel>
            <div class="btn-buy-wrap">
                <a class="buy-link" :href="'//www.onluxy.com/go#/credit_card?goodsid=Luxy_Braintree_TransactionNew_Black1Month&track=vouch_black&openid=' + openId" target="_blank">
                    <i-button class="btn-buy" type="ghost" shape="circle" long>1 Month: <span class="price">$99.99</span>/Month
                    <!-- <span class="delete">$99.9</span><span class="save">SAVE 30%</span> -->
                    </i-button>
                </a>
                <a class="buy-link" :href="'//www.onluxy.com/go#/credit_card?goodsid=Luxy_Braintree_TransactionNew_Black1Month&track=vouch_black&openid=' + openId" target="_blank">
                    <i-button class="btn-buy" type="ghost" shape="circle" long>6 Months: <span class="price">$58.99</span>/Month</i-button>
                </a>
                <a class="buy-link" :href="'//www.onluxy.com/go#/credit_card?goodsid=Luxy_Braintree_TransactionNew_Black1Month&track=vouch_black&openid=' + openId" target="_blank">
                    <i-button class="btn-buy" type="ghost" shape="circle" long>12 Months: <span class="price">$37.49</span>/Month</i-button>
                </a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    /**
     * @example
     * this.$payDialog.show({message: 'message', iconClassName:'my-imgs-above-message'}).then(this.doSthWhenClosed)
     */

    export default {
        name: 'pay-dialog',
        data() {
            return {
                // 是否显示弹窗
                visible: false,
                // 窗口关闭回调方法，用来构造show方法返回的Promise
                closeHandler: null,
                // 走马灯
                buyValue: 0,
                payCarousel: [
                    {id: 1, title: 'Get Luxury VIP Emblem', description: 'The deluxe VIP emblem is only for Luxy BLACK owner, which highlights the distinguished, extraordinary and luxury'},
                    {id: 2, title: 'Message Anyone You Like', description: 'Strike up a conversation and become acquainted with each other directly'},
                    {id: 3, title: 'Get More Possible Matches', description: 'Upgrade and improve your chances by 500%. Be viewed and contacted 20+ times more than standard members'},
                    {id: 4, title: 'Change Name', description: 'Change your name anytime'},
                ],
                openId: '123'
            }
        },
        methods: {
            close() {
                this.visible = false
                this.callCloseHandler()
            },
            show(config) {
                console.log(config)
                this.visible = true
                this.callCloseHandler()
                return new Promise(resolve => {
                    this.closeHandler = resolve
                })
            },
            callCloseHandler() {
                if (this.closeHandler) {
                    this.closeHandler()
                    this.closeHandler = null
                }
            },
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common_assets/basic_const';

    .pay-dialog-wrapper {
        position: fixed;
        top: 0;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 999;
        width: 100%;
        padding: 0 30px;
        .pay-dialog {
            background: #333 url('../../common_assets/imgs/bg_payDlg.png') no-repeat center 0/100%;
            margin: 0 auto;
            border-radius: 10px;
            padding-bottom: 1px;
            top: 18%;
            max-width: 500px;
            min-height: 545px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .banner {
                margin: 20px 0;
                width: 100%;
                text-align: center;
                .title {
                    font-family: 'Roboto';
                    font-size: 28px;
                    font-weight: 700;
                    color: $basic-primary;
                    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#9a753a), to(#e1c895));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .close {
                    position: absolute;
                    right: 10px;
                    top: 0;
                    padding: 10px;
                    font-size: 40px;
                    color: #999;
                }
                .carousel {
                    margin: 40px 0;
                    .icon {
                        color: #fff;
                        width: 100px;
                        height: 70px;
                        margin: 0 auto;
                    }
                    .banner-title {
                        margin-top: 20px;
                        color: $basic-primary;
                        background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#9a753a), to(#e1c895));
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        font-size: 20px;
                    }
                    .description {
                        margin-top: 20px;
                        margin-bottom: 20px;
                        padding: 0 20px;
                        font-size: 14px;
                        font-weight: 400;
                        color: rgb(153, 153, 153);
                        white-space: pre-wrap;
                    }
                    .black-privilege-1 {
                        background: url('../../common_assets/imgs/black_privilege_1.png')no-repeat 0/100%;
                    }
                    .black-privilege-2 {
                        background: url('../../common_assets/imgs/black_privilege_2.png')no-repeat 0/100%;
                    }
                    .black-privilege-3 {
                        background: url('../../common_assets/imgs/black_privilege_3.png')no-repeat 0/100%;
                    }
                    .black-privilege-4 {
                        background: url('../../common_assets/imgs/black_privilege_4.png')no-repeat 0/100%;
                    }
                }
            }
            .btn-buy-wrap {
                margin: 0 auto;
                width: 345px;
                .buy-link {
                    color: $basic-primary;
                    display: inline-block;
                    margin-top: 20px;
                    width: 90%;
                }
                .btn-buy {
                    text-align: center;
                    color: $basic-primary;
                    border: 1px solid $basic-primary;
                    font-size: 14px;
                    padding: 6px 40px;
                    &:hover {
                        border-color: $basic-primary-highlight;
                        color: $basic-primary-highlight;
                    }
                }
            }
        }
    }
</style>
