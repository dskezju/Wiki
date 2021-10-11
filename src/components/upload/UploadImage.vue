<template>

  <!-- 很神奇，后端一定要用@RequestParam的方式才能接受到数据
    这里如果用普通的form配合<input name=''>可以被requestparam接收
    但el-upload不知道怎么定义字段名，折腾了很久最后发现只有drag模式下
    配合requestparam("file")成功了。。。而且只能用自动上传 -->
  <el-upload
    class="upload-demo"
    drag
    action="http://127.0.0.1:8080/upload"
    multiple
    :show-file-list="true"
    :on-success="successRes"
    :before-remove="beforeRemove"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10MB</div>
  </el-upload>

</template>

<script>

  export default {
    name: 'UploadImage',
    emits: ['add-image', 'remove-image'],
    methods: {
      beforeRemove(file, fileList) {
        let index = fileList.indexOf(file)
        this.$emit('remove-image', index)
        return true //return false则不从fileList中移除
      },
      successRes(response, file, fileList) { //文件上传成功之后
        this.$message({
          message: response,
          type: 'success'
        });
        this.$emit('add-image', response.data.url)
      },
      removeRes(file, fileList){
        console.log(file, fileList)
      },
      beforeUpload(file) { //文件上传之前
        console.log("afsdfasdfa");
        var isLt2M = file.size / 1024 / 1024 < 10
        console.log(isLt2M);
        if(!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 10MB!',
            type: 'warning'
          });
          return false;
        }
      },
      handlePreview(file) {
        console.log(file);
      }
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
