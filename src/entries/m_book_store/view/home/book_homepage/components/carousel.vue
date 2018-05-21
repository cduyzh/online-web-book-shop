<template>
    <div class="homepage-carousel">
        <Carousel :radius-dot=true autoplay v-model="carouselIndex" loop>
            <CarouselItem :key='index' v-for="(item,index) in carouselGroupList">
                <div @click='jumpToBookInfo(item.id)' class="carosel-item">
                    <img :src="item.ad_pic_url" alt="">
                </div>
            </CarouselItem>
        </Carousel>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import {get as _get} from 'lodash'
    import {HOME_SHOW_TYPE} from '../../../../libs/const.js'

    export default {
        name: 'homepage-carousel',
        data() {
            return {
                carouselIndex: 0,
            }
        },
        computed: {
            ...mapState({
                vxHomeInfo: state => state.bookstore.homeInfo,
            }),
            carouselGroupList() {
                return _get(this.vxHomeInfo[HOME_SHOW_TYPE.carouse].data, 'data') || []
            }
        },
        methods: {
            ...mapMutations({
                vxSetCurrenReadBook: 'bookstore/setCurrenReadBook'
            }),
            jumpToBookInfo(bookId) {
                this.vxSetCurrenReadBook({bookId, chapterId: 0})
                this.$router.push({
                    name: 'bookInfo'
                })
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .homepage-carousel {
        .carosel-item {
            img {
                width: 100%;
                height: 135px;
            }
        }
    }
</style>