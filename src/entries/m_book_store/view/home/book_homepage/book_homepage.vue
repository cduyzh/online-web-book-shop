<template>
    <div class="book-homepage">
        <!-- 轮播 -->
        <home-carousel></home-carousel>
        <!-- 热门书籍 -->
        <hot-book></hot-book>
        <!-- 重磅推荐 -->
        <special-recomment></special-recomment>
        <!-- 女生喜欢 -->
        <woman-love></woman-love>
        <!-- 男生喜欢 -->
        <man-love></man-love>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {Indicator} from 'mint-ui'
    import homeCarousel from './components/carousel'
    import hotBook from './components/hot_book'
    import specialRecomment from './components/special_recomment'
    import womanLove from './components/woman_love'
    import manLove from './components/man_love'

    export default {
        name: 'book-homepage',
        data() {
            return {}
        },
        computed: {

        },
        methods: {
            ...mapActions({
                vxGetHomeInfo: 'bookstore/getHomeInfo',
                testApi: 'bookstore/testApi',
                testPostApi: 'bookstore/testPostApi'
            }),
        },
        components: {
            homeCarousel,
            hotBook,
            specialRecomment,
            womanLove,
            manLove
        },
        async mounted() {
            Indicator.open({
                spinnerType: 'fading-circle'
            });
            // try {
            //     await this.testApi()
            // } catch (error) {
            //     console.log(error.code)
            //     Indicator.close()
            // }
            // await this.testPostApi({min: 0, max: 100})
            try {
                await this.vxGetHomeInfo()
                Indicator.close()
            } catch (error) {
                Indicator.close()
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .book-homepage {
    }
</style>