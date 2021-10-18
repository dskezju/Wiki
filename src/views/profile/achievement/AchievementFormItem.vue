<template>
  <div>
    <h4>
      <span v-if="index != undefined">
        成果{{index + 1}}：
      </span>
      <el-button type="danger" size="small" @click="deleteAchievement">
        删除
      </el-button>
    </h4>

    <el-form-item
      label="标题"
      :prop="'achievements.'+index+'.properties.title'"
      :rules="{required: true, message: '不能为空', trigger: 'blur'}"
    >
      <el-input v-model="achieve.properties.title"/>
    </el-form-item>

    <el-form-item
      label="摘要"
      :prop="'achievements.'+index+'.properties.summary'"
    >
      <el-input type="textarea" :rows="3" v-model="achieve.properties.summary"/>
    </el-form-item>

    <el-form-item
      label="链接"
      :prop="'achievements.'+index+'.properties.link'"
    >
      <el-input v-model="achieve.properties.link"/>
    </el-form-item>

    <el-form-item
      label="备注"
      :prop="'achievements.'+index+'.properties.note'"
    >
      <el-input v-model="achieve.properties.note"/>
    </el-form-item>

    <el-form-item
      label="完成时间"
      :prop="'achievements.'+index+'.properties.time'"
    >
      <!-- <date-picker :time="achieve.properties.time"/> -->
      <el-date-picker type="date" v-model="achieve.properties.time"/>
    </el-form-item>

    <el-form-item label="添加图片" :prop="'achievements.'+index+'.imgs'">
      <!-- remove-image什么也不做 -->
      <upload-image @add-image="addImage" @remove-image="function(){}"/>

      <!-- 这里控制image的移除 -->
      <image-with-delete
        v-for="(img, index) in achieve.imgs"
        :src="img.properties.url"
        :index="index"
        :key="index"
        @on-remove="removeImage(index)"
      />
    </el-form-item>

    <el-form-item
      label="添加视频"
      :prop="'achievements.'+index+'.videos'"
    >
      <upload-video @add-video="addVideo" @remove-video="function(){}"/>

      <video-with-delete
        v-for="(video, index) in achieve.videos"
        type="video"
        :src="video.properties.url"
        :index="index"
        :key="index"
        @on-remove="removeVideo(index)"
      />
    </el-form-item>
  </div>
</template>

<script>
import { defineComponent, watch, reactive, onMounted } from 'vue'

import UploadVideo from '@/components/upload/UploadVideo.vue'
import UploadImage from '@/components/upload/UploadImage.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import ImageWithDelete from '@/components/common/ImageWithDelete.vue'
import VideoWithDelete from '@/components/common/VideoWIthDelete.vue'

export default defineComponent({
  name: 'AchievementFormItem',
  components: {
    ImageWithDelete,
    UploadVideo,
    UploadImage,
    VideoWithDelete,
    DatePicker,
  },
  props: {
    index: {
      type: Number,
      required: false,
    },
    achieve: {
      type: Object,
      required: true,
    }
  },
  emits: ['deleteAchievement', 'add-image', 'add-video', 'remove-video'],
  setup(props, context) {

    const deleteAchievement = () => {
      context.emit('deleteAchievement', props.index)
    }

    const addImage = (url) => {
      context.emit('add-image', props.index, url)
    }

    const removeImage = (img_idx) => {
      context.emit('remove-image', props.index, img_idx)
    }

    const addVideo = (url) => {
      context.emit('add-video', props.index, url)
    }

    const removeVideo = (video_idx) => {
      context.emit('remove-video', props.index, video_idx)
    }

    return {
      deleteAchievement,
      addImage,
      removeImage,
      addVideo,
      removeVideo,
    }
  },

})
</script>
