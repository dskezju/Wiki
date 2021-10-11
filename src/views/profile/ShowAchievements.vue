<template>
  <div>
    <div v-for="(achieve, index) in achievements" :key="achieve">
      <div v-if='achieve.editMode'>
        <el-form :model='form'>
          <achievement-form-item
            @deleteAchievement="deleteAchievement"
            @add-image="addImage"
            @remove-image="removeImage"
            @add-video="addVideo"
            @remove-video="removeVideo"
            :achieve="achieve"
            :index="index"
          />
        </el-form>
        <el-button type="primary" size="medium" @click="submit(index)">
          保存
        </el-button>
      </div>

      <div style='margin-top:20px;margin-bottom: 20px' v-else>
        <achievement-desc-item
          :achieve='achieve'
          :index='index'
          @del-achievement="deleteAchievement"
          @change-mode='changeMode(index)'
        />
      </div>
    </div>
  </div>
</template>

<script>
import EditSkill from '@/views/profile/skill/EditSkill.vue'
import AchievementForm from '@/views/profile/achievement/AchievementForm.vue'
import {getAchievements, deleteAchievement, deleteImage, deleteVideo} from '@/api/graph'
import {submit_achievements} from '@/utils/graph'
import AchievementDescItem from '@/views/profile/achievement/AchievementDescItem.vue'
import AchievementFormItem from '@/views/profile/achievement/AchievementFormItem.vue'

export default {
  name: 'ShowAchievements',
  components: {
    EditSkill,
    AchievementForm,
    AchievementFormItem,
    AchievementDescItem,
  },
  emits: ['refresh'],
  props: {
    achievements: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changeMode(index){
      this.achievements[index].editMode = !this.achievements[index].editMode
    },
    async submit(index){
      await submit_achievements([this.achievements[index]])
      this.changeMode(index)
      this.$emit('refresh') //重新获取achievements，不然这些新增的imgs还是没有id
    },
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

  }
}
</script>
