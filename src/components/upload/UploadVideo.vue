<template>
  <el-upload
    drag
    class="upload-demo"
    action="http://127.0.0.1:8080/upload"
    :show-file-list="true"
    :on-success="handleSuccessVideo"
    :on-progress="uploadProcess"
    :before-upload="videoBeforeUpload"
    :before-remove="beforeRemove"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">只能上传mp4/flv文件，且不超过30MB</div>
  </el-upload>
</template>

<script>

export default {
  name: 'UploadVideo',
  data(){
    return {
      percent: 0,
    }
  },
  emits: ['add-video', 'remove-video'],
  methods: {
    beforeRemove(file, fileList) {
      let index = fileList.indexOf(file)
      this.$emit('remove-video', index)
      return true // 之后会进行删除
    },
    handleSuccessVideo(response) {
      this.$message({
        message: response,
        type: 'success'
      });
      this.percent = 0;
      this.imageUrl = response.data.url;
      this.$emit('add-video', this.imageUrl)
    },
    videoBeforeUpload(file) {
      console.log(file);
      const _self = this;
      const isVideo = file.type === 'video/mp4' || file.type === 'video/ogg' || file.type === 'video/flv' || file.type === 'video/avi' || file.type === 'video/wmv' || file.type === 'video/rmvb';
      const isLt30M = file.size / 1024 / 1024 < 30;
      if (!isVideo) {
        this.$message.warning('请上传正确格式的视频！');
        return false;
      } else {
        if (!isLt30M) {
          this.$message.warning('上传视频文件大小不能超过 30MB!');
          return false;
        }
      }
    },
    uploadProcess(event, file, fileList) {
      this.imgFlag = true;
      // console.log(event.percent);
      this.percent = Math.floor(event.percent);
    },
  }
}
</script>

<style scoped>
.upload-demo {
  /* display: inline-flex; */
  max-width: 400px;
  margin: 0 auto;
}

.el-upload__tip {
  margin-top: 0;
}
</style>
