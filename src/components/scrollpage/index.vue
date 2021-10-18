<template>
  <div ref="scroll" id="scroll-page" style="min-height:500px;overflow: hidden;">
    <slot></slot>
    <LoadingCustom v-if="loading"></LoadingCustom>
    <LoadEnd v-if="noData"></LoadEnd>
  </div>

</template>

<script>
import LoadingCustom from  '@/components/common/Loading.vue'
import LoadEnd from '@/components/common/LoadEnd.vue'

export default {
  name: "ScrollPage",
  components: {
    LoadingCustom,
    LoadEnd,
  },
  props: { //在ArticleScrollPage中传过来
    loading: Boolean,
    noData: Boolean,
    offset: { //不知道它用来干嘛，但如果它没有值的话下面判断数值大小就是false
      type: Number,
      default: 100,
    },
  },
  mounted() { //添加scroll事件绑定
    window.addEventListener('scroll', this.handleScroll, false);
  },
  beforeUnmount() { //移除事件
    window.removeEventListener('scroll', this.handleScroll)
  },
  data() {
    return {
      scrollAction: {
        x: 'undefined',
        y: 'undefined'
      }
    }
  },
  methods: {
    handleScroll(e) { //很迷惑的是，当页面不足以出现滚动条时，scroll就没用了？
      var that = this
      // console.log('that:', that)
      //如果没有数据，那怎么划也没用了
      if (!that.noData) { //如果有数据
        let curHeight = document.documentElement.scrollTop || document.body.scrollTop
        var scrollPage = document.getElementById('scroll-page');

        //如果下拉到一定程度
        // console.log(this.$refs.scroll)
        // console.log('curHeight:', curHeight)
        // console.log('innerHeight:', window.innerHeight)
        // console.log('offsetHeight:', that.$refs.scroll.offsetHeight)
        // console.log('offset:', that.offset)

        //第一次调用isDownDirection是true，之后调用全是false，所以不要打印它
        // console.log('that.isDownDirection():', that.isDownDirection())
        // console.log('that.isDownDirection():', that.isDownDirection())
        // console.log('(curHeight + window.innerHeight >= that.$refs.scroll.offsetHeight + that.offset):', (curHeight + window.innerHeight >= that.$refs.scroll.offsetHeight + that.offset))

        if ((curHeight + window.innerHeight >= that.$refs.scroll.offsetHeight + that.offset) && that.isDownDirection()) {
          // console.log('that.loading:', that.loading)
          if (!that.loading) { //如果不是正在加载中
            // console.log('emit load')
            that.$emit('load') //触发load事件，加载文章
          }
        }
      }
    },
    isDownDirection() { //判断是不是向下拉
      if (typeof this.scrollAction.x == 'undefined') {
        this.scrollAction.x = window.pageXOffset;
        this.scrollAction.y = window.pageYOffset;
      }
      var diffX = this.scrollAction.x - window.pageXOffset;
      var diffY = this.scrollAction.y - window.pageYOffset;

      this.scrollAction.x = window.pageXOffset;
      this.scrollAction.y = window.pageYOffset;

      if (diffX < 0) {
        // Scroll right
      } else if (diffX > 0) {
        // Scroll left
      } else if (diffY < 0) {
        // Scroll down
        return true
      } else if (diffY > 0) {
        // Scroll up
      } else {
        // First scroll event
      }
      return false
    }

  }
}
</script>

<style scoped>

</style>
