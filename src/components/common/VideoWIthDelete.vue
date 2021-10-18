<template>
  <div class="img-del">
    <video-player
      class="video"
      :source="src"
      :hash="hash()"
    />

    <div v-if='showDel'>
      <el-button plain size="small" @click="remove">移除</el-button>
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/video_player/VideoPlayer.vue';

export default {
  components: { VideoPlayer },
  name: 'VideoWithDelete',
  props: {
    showDel: {
      default: true,
    },
    index: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
  },
  emits: ['on-remove'],
  methods: {
    hash(){ //5位不带小数点的随机数
      let h = Math.random() * (1e6-1e5) + 1e5
      console.log((''+h).substr(0, 5))
      return (''+h).substr(0, 5)
    },
    remove(){
      this.$emit('on-remove', this.index);
    }
  }
}
</script>

<style scoped>
.video {
  width: 500px;
  height:300px;
}

.img-del {
  width: 300px;
  float: left;
  margin-right: 20px;
  text-align:center
}
</style>
