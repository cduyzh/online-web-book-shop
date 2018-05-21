<template>
    <div class="countdown-component">
        <div class="time-wrapper clearfix">
            <!-- 小时 -->
            <count-number :number="hourTens"></count-number>
            <count-number :number="hourOnes"></count-number>
            <!-- 冒号 -->
            <div class="colon-wrap">
                <div class="colon colon-top"></div>
                <div class="colon colon-bottom"></div>
            </div>
            <!-- 分钟 -->
            <count-number :number="minTens"></count-number>
            <count-number :number="minOnes"></count-number>
            <!-- 冒号 -->
            <div class="colon-wrap">
                <div class="colon colon-top"></div>
                <div class="colon colon-bottom"></div>
            </div>
            <!-- 秒 -->
            <count-number :number="secTens"></count-number>
            <count-number :number="secOnes"></count-number>
        </div>
    </div>
</template>

<script>
    import countNumber from './content/number'

    export default {
        name: 'countdown-component',
        props: {
            // 后台下发的已经是时分秒时间戳
            leftTime: {
                default: 0
            },
            endText: {
                type: String,
                default: '00:00:00'
            },
        },
        data() {
            return {
                timeText: '',
                time: null,
                day: 0,
                hourTens: 0, // 小时（十位）
                hourOnes: 0, // 小时（个位）
                minTens: 0, // 分（十位）
                minOnes: 0, // 分（个位）
                secTens: 0, // 秒（十位）
                secOnes: 0, // 秒（个位）
            }
        },
        mounted() {
            this.$nextTick(() => {
                console.log('leftT:', this.leftTime)
                this.countdowm(Number(this.leftTime))
            })
        },
        methods: {
            countdowm(timestamp) {
                const timer = setTimeout(() => {
                    this.time = --timestamp
                    if (this.time > 0) {
                        this.day = Math.floor(this.time / 86400);
                        const hour = Math.floor((this.time / 3600) % 24);
                        const min = Math.floor((this.time / 60) % 60);
                        const sec = Math.floor(this.time % 60);
                        // console.log(`${this.day}天,${hour}h,${min}m,${sec}s`)
                        // 区分小余10
                        if (hour < 10) {
                            this.hourTens = 0;
                            this.hourOnes = hour % 10;
                        } else {
                            this.hourTens = Math.floor(hour / 10);
                            this.hourOnes = hour % 10;
                        }
                        if (min < 10) {
                            this.minTens = 0;
                            this.minOnes = min % 10;
                        } else {
                            this.minTens = Math.floor(min / 10);
                            this.minOnes = min % 10;
                        }
                        this.secTens = Math.floor(sec / 10);
                        this.secOnes = sec % 10;
                        /* 定义正常时间格式（这里用不到了，用翻页取代了）
                            let format = '';
                            if (this.day > 0) {
                                format = `${this.day}:${this.hour}:${this.min}:${this.sec}`;
                            } else {
                                format = `${this.hour}:${this.min}:${this.sec}`;
                            }
                            this.timeText = format;
                        */
                        // 回调
                        this.countdowm(this.time)
                    } else {
                        clearInterval(timer)
                        this.hourTens = 0
                        this.hourOnes = 0
                        this.minTens = 0
                        this.minOnes = 0
                        this.secTens = 0
                        this.secOnes = 0
                        this.$emit('callBack');
                    }
                }, 1000);
            }
        },
        components: {
            countNumber
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common_assets/basic_const';
    $colon-color: #999;

    .countdown-component {
        .time-wrapper {
            font-family: 'simhei', 'PingFang SC', 'Arial', 'PingFang SC';
            -webkit-user-select: none;
            cursor: pointer;
            .time {
                list-style: none;
            }
        }
        .time-wrapper {
            display: flex;
            justify-content: center;
            // 冒号
            .colon-wrap {
                display: flex;
                flex-flow: column wrap;
                align-items: center;
                justify-content: center;
                width: 1em;
                .colon {
                    flex: 0 1 1;
                    width: 0.5em;
                    height: 0.5em;
                    background: $colon-color;
                    border-radius: 50%;
                    &.colon-bottom {
                        margin-top: 0.5em;
                    }
                }
            }
        }
    }
</style>
