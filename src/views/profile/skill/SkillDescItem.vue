<template>
  <div>
    <el-card shadow="hover">
      <div class="me-author-description">
        <el-descriptions
          :title="'技能'+parseInt(index+1)"
          :column="1"
          size="medium"
        >
          <template #extra>
            <el-button type="danger" size="small" @click="delSkill">
              删除
            </el-button>
            <el-button type="primary" size="small" @click="clickChange">
              更改
            </el-button>
          </template>

          <el-descriptions-item>
            <template #label>
              标题
            </template>
            {{skill.properties.title}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              摘要
            </template>
              {{skill.properties.summary}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              链接
            </template>
            <a :href='skill.properties.link'>
              {{skill.properties.link}}
            </a>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              备注
            </template>
            {{skill.properties.note}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              完成时间
            </template>
            {{skill.properties.time}}
          </el-descriptions-item>

          <el-divider/>

          <!-- 成果展示，editMode=false -->
          <!-- <show-achievements v-if='skill && skill.achievements'
            :achievements="skill.achievements"
            @refresh='()=>{}'
          /> -->
        </el-descriptions>

        <!-- 这个必须放el-descriptions外面，因为它不能嵌套 -->
        <div v-for='(achieve, index) in skill.achievements' :key="achieve" style='margin-top:20px;margin-bottom: 20px'>
          <achievement-desc-item
            :achieve='achieve'
            :index='index'
            :showChangeBtn='false'
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import ShowAchievements from '@/views/profile/ShowAchievements.vue'
import AchievementDescItem from '@/views/profile/achievement/AchievementDescItem.vue'

export default {
  name: 'SkillDescItem',
  components: {
    ShowAchievements,
    AchievementDescItem,
  },
  props: {
    skill: {
      type: Object,
      required: true,
    },
    index: {
      required: true,
    },
  },
  emits: ['change-mode', 'del-skill'],
  watch: {
    props: {
      handler(old, newval){
        console.log('new:', newval)
      },
      deep: true,
    }
  },
  mounted(){
    console.log('skill:', this.skill)
  },
  methods: {
    clickChange(){
      this.$emit('change-mode')
    },
    delSkill(){
      this.$confirm('确认永久删除该内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('del-skill', this.index)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
