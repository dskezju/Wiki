<template>
  <el-form :model="form" :ref='ref'>
    <el-form-item
      label="标题"
      prop="properties.title"
      :rules="{required: true, message: '不能为空', trigger: 'blur'}"
    >
      <el-input v-model="form.properties.title"/>
    </el-form-item>

    <el-form-item
      label="摘要"
      prop="properties.summary"
      :rules="{required: true, message: '不能为空', trigger: 'blur'}"
    >
      <el-input type="textarea" :rows="3" v-model="form.properties.summary"/>
    </el-form-item>

    <el-form-item
      label="链接"
      prop='properties.link'
    >
      <el-input v-model="form.properties.link"/>
    </el-form-item>

    <el-form-item
      label="备注"
      prop='properties.note'
    >
      <el-input v-model="form.properties.note"/>
    </el-form-item>

    <el-form-item
      label="完成时间"
      prop="properties.time"
    >
      <!-- 不知道为什么data-picker突然出错 -->
      <!-- <date-picker :time='form.properties.time'/> -->
      <el-date-picker type="date" v-model="form.properties.time"/>
    </el-form-item>

    <!-- 动态添加成果 -->
    <achievement-form :achievements="form.achievements" :editMode="true"/>

    <el-button type="primary" size="small" @click="addAchievement">
        添加成果
    </el-button>

    <div style="margin-top: 10px;text-align:center">
      <el-button type="primary" size="medium" @click="submit(ref)">
        提交
      </el-button>
    </div>
  </el-form>
</template>

<script lang='ts'>
import AchievementForm from '@/views/profile/achievement/AchievementForm.vue'
import {saveSkill} from '@/api/graph'
import {deal_media, add_achievement} from '@/utils/graph'
import DatePicker from '@/components/common/DatePicker.vue'

export default {
  name: 'EditSkill',
  components: {
    AchievementForm,
    DatePicker,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
    }
  },
  emits: ['refresh'],
  data(){
    return {
      ref: 'skillForm'+this.index,
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
    submit(skillForm){
      this.$refs[skillForm].validate((valid) => {
        if (valid) {
          console.log('form:', this.form)
          let graph = {nodes: [], edges: []}
          let fake_id = 1e8  //伪id
          let isNew = !this.form.id
          let skill_id = isNew ? fake_id : this.form.id

          graph.nodes.push({
            id: skill_id,
            isNew: isNew,
            label: 'skill',
            properties: this.form.properties
          })
          if(this.form.achievements){
            for(let i in this.form.achievements){
              let achieve = this.form.achievements[i]
              console.log(achieve)
              if(!achieve.properties.title.trim()){
                this.$message({
                  type: 'error',
                  message: '成果标题不能为空'
                })
                return
              }
              fake_id = add_achievement(graph, achieve, fake_id, achieve.id ? false: true, i)

              graph.edges.push({ //技能指向成果
                startNodeId: skill_id,
                endNodeId: achieve.id || fake_id,
                label: 'skill_achievement',
                properties: {
                  name: 'skill_achievement',
                }
              })
              //处理图片和视频，单独成节点
              let achieve_id = achieve.id || fake_id
              fake_id = deal_media(graph, achieve.imgs, 'image', 'achievement_image', achieve_id, fake_id)
              fake_id = deal_media(graph, achieve.videos, 'video', 'achievement_video', achieve_id, fake_id)
            }
          }
          console.log('graph:', graph)
          saveSkill(graph).then(() => {
            this.$message({
              type: 'success',
              message: 'success!'
              })
            this.$emit('refresh')
          })
          .catch((err) => this.$message({type: 'error', message: err}))


        }
      })
    },
  },

}
</script>

<style scoped>

</style>
