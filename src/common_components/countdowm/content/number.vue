<template>
    <div class="countdown-number">
        <div class="number-wrap">
            <!-- 底层显示  -->
            <div class="up">
                <div class="shadow"></div>
                <div class="num num-top">{{number}}</div>
            </div>
            <div class="down">
                <div class="shadow"></div>
                <div class="num num-bottom">{{number}}</div>
            </div>
            <!-- 翻转显示 -->
            <transition name="rollover-up">
                <div class="up-rollover" v-show="onOff">
                    <div class="shadow"></div>
                    <div class="num num-top">{{number}}</div>
                </div>
            </transition>
            <transition name="rollover-down">
                <div class="down-rollover" v-show="onOff">
                    <div class="shadow"></div>
                    <div class="num num-bottom">{{number}}</div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'countdown-number',
        props: {
            // 后台下发的已经是时分秒时间戳
            number: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                onOff: false,
            }
        },
        computed: {
            nextNumber: {
                get() {
                    if (this.number === 0) {
                        return 9
                    } else {
                        return this.number - 1
                    }
                },
                set(val) {
                    return val
                }
            }
        },
        watch: {
            number() {
                this.onOff = !this.onOff
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../../common_assets/basic_const';
    $number-color: #ccc;
    $number-bgc: #131314;
    $shadow-begin: rgba(0, 0, 0, 0.1);
    $shadow-end: rgba(0, 0, 0, 0.8);

    .countdown-number {
        position: relative;
        margin: 0 0.2em;
        width: 2.8em;
        height: 4.5em;
        line-height: 4.5em;
        font-weight: bold;
        border: 1px silid #000;
        // perspective: 200px;
        // 倒影
        // box-reflect: below 0 linear-gradient(top,rgba(250,250,250,.0) 30%,rgba(250,250,250,0.3));
        // -webkit-box-reflect: below 0 -webkit-linear-gradient(top,rgba(250,250,250,.0) 30%,rgba(250,250,250,0.3));
        .number-wrap {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            // 分界线
            .up,
            .down,
            .up-rollover,
            .down-rollover {
                position: absolute;
                width: 100%;
                height: 50%;
                overflow: hidden;
                .num {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    color: $number-color;
                    text-align: center;
                    background-color: $number-bgc;
                    border-radius: 0.1em;
                    font-size: 3.5em;
                    font-family: 'Roboto Condensed';
                }
                .num-top {
                    top: 0;
                }
                .num-bottom {
                    bottom: 0;
                }
                // 阴影
                .shadow {
                    z-index:1;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 0.1em;
                }
            }
            .up,
            .up-rollover {
                transform-origin: 50% 100%; // 定位旋转基点
                top: 0;
                // 分割线
                &:after {
                    content: '';
                    position: absolute;
                    top: 2.1em;
                    left: 0;
                    z-index: 11;
                    width: 100%;
                    height: 0.3em;
                    background-color: $shadow-end;
                }
            }
            .down,
            .down-rollover {
                transform-origin: 50% 0; // 定位旋转基点
                bottom: 0;
            }
            .up {
                z-index: 5;
                // .shadow {
                //     background: linear-gradient(to bottom, $shadow-begin 30%, $shadow-end 100%);
                //     animation: shadow-hide 0.25s linear both;
                // }
            }
            .down {
                z-index: 5;
                // .shadow {
                //     background: linear-gradient(to bottom, $shadow-end 0%, $shadow-begin 70%);
                //     animation: shadow-hide 0.25s linear both;
                // }
            }
            .up-rollover {
                z-index: 2;
                // .shadow {
                //     background: linear-gradient(to bottom, $shadow-begin 30%, $shadow-end 100%);
                //     animation: shadow-show 0.25s linear both;
                // }
            }
            .down-rollover {
                z-index: 2;
                // .shadow {
                //     background: linear-gradient(to bottom, $shadow-end 0%, $shadow-begin 70%);
                //     animation: shadow-show 0.25s linear both;
                // }
            }
        }
    }
    // rollover-up
    .rollover-up-enter-active {
        animation: turn-up 0.25s linear;
    }
    .rollover-up-leave-active {
        animation: turn-up 0.25s linear;
    }
    @keyframes turn-up {
        0% {
            transform: rotate3d(1, 0, 0, 0deg);
            z-index: 6;
        }

        100% {
            transform: rotate3d(1, 0, 0, -90deg);
            z-index: 4;
        }
    }
    // rollover-down
    .rollover-down-enter-active {
        animation: turn-down 0.25s 0.25s linear;
    }
    .rollover-down-leave-active {
        animation: turn-down 0.25s 0.25s linear;
    }
    @keyframes turn-down {
        0% {
            transform: rotate3d(1, 0, 0, 90deg);
            z-index: 6;
        }

        100% {
            transform: rotate3d(1, 0, 0, 0deg);
            z-index: 4;
        }
    }
    @keyframes shadow-show {
        0% {
            opacity: 0;
        }
        100% {
           opacity: 1;
        }
    }
    @keyframes shadow-hide {
        0% {
            opacity: 1;
        }
        100% {
           opacity: 0;
        }
    }
</style>
