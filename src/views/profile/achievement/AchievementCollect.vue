<template>
  <div>
    <!-- el-form-item一定要包裹在el-form中 -->
    <el-form :model='form'>
      <achievement-form :key="key" :achievements="form.achievements"/>
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
import {add_achievement, deal_media, submit_achievements} from '@/utils/graph'

export default {
  name: 'SkillCollect',
  components: {
    AchievementForm,
  },
  emits: ['refresh'],
  data(){
    return {
      key: 0,
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
            domains: [],
            ori_domains: [],
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
        domains: [],
        ori_domains: [],
      })
    },
    async submit(){
      await submit_achievements(this.form.achievements)
      //这样子也不能把domains置为空，不知道为什么，就只能用key强制刷新了
      this.form.achievements.splice(0, this.form.achievements.length,
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
          domains: [],
          ori_domains: [],
        }
      )
      this.key++
      this.$emit('refresh')
    },
  },
}
</script>

<style scoped>

</style>
