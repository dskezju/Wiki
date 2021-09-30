<template>
  <div>
    <span>封面：</span>
    <el-button type="text" @click="visible = true">选择/更改</el-button>
    <span style='padding-left:10px' v-if='cover'>
      <el-button type="text" @click="changeCover('')">删除</el-button>
    </span>
    <div>
      <!-- <img
        :src="cover"
        style='max-width:200px'
      /> -->
      <el-image
        v-if='cover'
        style="max-width:200px"
        :src="cover"
        :preview-src-list="[cover]"
        :hide-on-click-modal='true'

      >
      </el-image>
    </div>
    <!-- 上传图片的dialog -->
    <el-dialog
      v-model='visible'
      width="40%"
      height='80%'
      title="上传图片"
    >
      <div style='text-align:center'>
        <upload-image @setImage='changeCover'/>
      </div>
      <template #footer>
        <p style='text-align:center;'>
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="visible = false">确 定</el-button>
        </p>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import UploadImage from '@/components/UploadImage.vue'

export default {
  name: 'UploadCover',
  components: {
    UploadImage,
  },
  emits: ['setCover'],
  props: {
    cover: {
      type: String,
      default: '',
    }
  },
  data(){
    return {
      visible: false,
    }
  },
  methods: {
    changeCover(imgUrl){
      console.log('imgUrl:', imgUrl)
      this.$emit('setCover', imgUrl)
    }
  }
}
</script>
