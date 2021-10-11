<template>
  <div class="avatar">
    <img :src="url" :alt="alt" >
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

const defaultUrl = require("@/assets/user.jpg")
export default defineComponent({
  name: 'Avatar',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    }
  },
  data(){
    return {
      url: this.src ? this.src : defaultUrl
    }
  }
})
</script>

<style lang="less"  scoped>
.avatar { //这儿的样式可以在外面被覆盖
  position: absolute;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>
