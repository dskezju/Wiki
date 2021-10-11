<template>
   <!--播放器, hash用来创建多个播放器-->
  <div class="prism-player" :id="'J_prismPlayer'+hash" style="margin-left: auto; margin-right: auto;"></div>
</template>
<script>

  export default {
    name: 'VideoPlayer',
    props:{
      hash: { //用来创建多个player时避免冲突
        required: true,
      },
      source: {
        // required: true,
        default: '',
      }
    },
    mounted(){
      this.initPlayer()
    },
    methods: {
      initPlayer(){
        new Aliplayer({
          playsinline: true,
          id: 'J_prismPlayer' + this.hash,
          source: this.source,
          encryptType: '1', // 如果播放加密视频，则需设置encryptType=1，非加密视频无需设置此项
          width: '300px',
          height: '200px',
          //cover: 'http://guli.shop/photo/banner/1525939573202.jpg', // 封面
          qualitySort: 'asc', // 清晰度排序
          mediaType: 'video', // 返回音频还是视频
          autoplay: false, // 自动播放
          isLive: false, // 直播
          rePlay: false, // 循环播
          preload: true,
          controlBarVisibility: 'hover', // 控制条的显示方式：鼠标悬停
          useH5Prism: true, // 播放器类型：html5
        }, function(player) {
          console.log(player)
          console.log('播放器创建成功')
        })
      }
    }
  }
</script>
