<template>
  <!-- 这是一个没有el-form包围的form-item的集合 -->
  <div>
    <!-- 还要封装出一个form-item是因为不然的话传不了index给父组件，
        因为在emit('add-image')里不知道当前的achieve的index是什么 -->
    <!-- <el-form :model='form'> -->
      <achievement-form-item
        v-for="(achieve, index) in achievements"
        @deleteAchievement="deleteAchievement"
        @add-image="addImage"
        @remove-image="removeImage"
        @add-video="addVideo"
        @remove-video="removeVideo"
        :achieve="achieve"
        :index="index"
        :key="index"
      />
    <!-- </el-form> -->

  </div>
</template>

<script>
import AchievementFormItem from '@/views/profile/achievement/AchievementFormItem.vue'
import {deleteAchievement, deleteImage, deleteVideo, deleteSkill} from '@/api/graph'

export default {
  name: 'AchievementForm',
  components: {
    AchievementFormItem,
  },
  props: {
    editMode:{
      default: true,
    },
    achievements: {
      type: Object,
      required: true,
    }
  },
  watch: {
    achievements: {
      handler(old, newval){
        console.log('in achieveForm, achieves:', newval)
      },
      deep: true,
    }
  },
  methods: {
    deleteAchievement(index) {
      if(this.achievements[index].id){
        deleteAchievement(this.achievements[index].id)
      }
      this.achievements.splice(index, 1)
    },
    addImage(index, url) {
      this.achievements[index].imgs.push({
        properties: {
          url,
        }
      });
      console.log('imgs:', this.achievements[index].imgs)
    },
    removeImage(index, img_idx) {
      if(this.achievements[index].imgs[img_idx].id){
        deleteImage(this.achievements[index].imgs[img_idx].id)
      }
      this.achievements[index].imgs.splice(img_idx, 1)
      console.log('imgs:', this.achievements[index].imgs)
    },
    addVideo(index, url) {
      this.achievements[index].videos.push({
        properties: {
          url,
        }
      })
      console.log('videos:', this.achievements[index].videos)
    },
    removeVideo(index, video_idx) {
      if(this.achievements[index].videos[video_idx].id){
        deleteVideo(this.achievements[index].videos[video_idx].id)
      }
      this.achievements[index].videos.splice(video_idx, 1)
      console.log('videos:', this.achievements[index].videos)
    },
    changeDomains(index, newDomains) { //直接修改achievement.domains
      console.log('newDomains:', newDomains)
      this.achievements[index].domains = newDomains
    }
  }
}
</script>

<style scoped>

</style>
