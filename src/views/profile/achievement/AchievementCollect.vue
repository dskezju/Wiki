<template>
  <div>
    <!-- el-form-item一定要包裹在el-form中 -->
    <el-form :model='form'>
      <achievement-form :achievements="form.achievements"/>
    </el-form>
    <el-button type="primary" size="small" @click="addAchievement">
        添加成果
    </el-button>
    <div style="margin-top: 10px;text-align:center">
      <el-button type="primary" size="medium" @click="submit">
        提交
      </el-button>
    </div>
  </div>
</template>

<script lang='ts'>
import AchievementForm from '@/views/profile/achievement/AchievementForm.vue'
import {saveAchievement} from '@/api/graph'
import {add_achievement, deal_media, submit_achievements} from '@/utils/graph'

export default {
  name: 'SkillCollect',
  components: {
    AchievementForm,
  },
  emits: ['refresh'],
  data(){
    return {
      form: { //achievements还是要放到form里面，因为form-item里的prop会变成form.achievement.0.title
        achievements: [
          {
            id: '',
            label: '',
            properties: {
              title: '',
              summary: '',
              link: '',
              note: '',
              time: '',
            },
            imgs: [],
            videos: [],
          }
        ],
      },
    }
  },
  methods: {
    addAchievement() {
      this.form.achievements.push({
        id: '',
        label: '',
        properties: {
          title: '',
          summary: '',
          link: '',
          note: '',
          time: '',
        },
        imgs: [],
        videos: [],
      })
    },
    async submit(){
      await submit_achievements(this.form.achievements)
      this.form.achievements = [
        {
          id: '',
          label: '',
          properties: {
            title: '',
            summary: '',
            link: '',
            note: '',
            time: '',
          },
          imgs: [],
          videos: [],
          }
      ]
      this.$emit('refresh')
    },
  },
}
</script>

<style scoped>

</style>
