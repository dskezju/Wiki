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

    <el-form-item label="领域" prop="domains">
      <!-- v-model不能绑定props -->
      <el-checkbox-group v-model="this.tmp_domains" @change='changeDomains'>
        <el-checkbox
          v-for="d in this.$store.state.graph.domains"
          :key="d.id"
          :label="d.id"
          name="Domains"
        >
          {{d.properties.name}}
        </el-checkbox>
      </el-checkbox-group>
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
import {getAllDomains, removeDomain} from '@/api/graph'

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
      domains: [], //后台获取的所有的domain
      tmp_domains: [], //由于v-model不可以绑定props里的值，只能绑定本地的值
    }
  },
  watch: {
    form: { //更新tmp_domains的值
      handler(oldval, newval){
        console.log('in editskill, newval:', newval)
        if(newval === undefined)
          return
        // 传过来的skill的domain只是赋值一下tmp_domains然后就没用了
        if(this.tmp_domains !== newval.domains){ //只在外部数据更新时更新
          this.tmp_domains = newval.ori_domains.slice() //赋值ori_domains或domains都可以
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async created(){
    // const data = await getAllDomains()
    // this.domains = data.data
    // console.log('created, this.form=', this.form)
  },
  mounted(){
    console.log('in editskill, mounted, form:', this.form)
    this.tmp_domains = this.form.ori_domains.slice() //浅拷贝
    console.log('tmp_domains:', this.tmp_domains)
  },
  methods: {
    changeDomains(newDomains){ //对tmp_domains的更新需要更新到外边去，因为addAchievement会更新外边的form，刷新组件，tmp_domains就会被重新赋值
      this.form.domains = newDomains
    },
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
    submit(skillForm){
      this.$refs[skillForm].validate(async (valid) => {
        if (valid) {
          console.log('form:', this.form)
          let graph = {nodes: [], edges: []}
          let fake_id = 1e8  //伪id
          let isNew = !this.form.id
          let skill_id = isNew ? fake_id : this.form.id

          graph.nodes.push({ //skill node
            id: skill_id,
            isNew: isNew,
            label: 'skill',
            properties: this.form.properties
          })

          console.log('tmp_domains:', this.tmp_domains)

          for(let domain_id of this.form.ori_domains){ //比较不同，放弃的domain就移除
            if(this.tmp_domains.indexOf(domain_id) === -1){
              await removeDomain(skill_id, domain_id) //如果form.domains不为空，则一定不是新的skill
            }
          }

          for(let domain_id of this.tmp_domains){ // skill -> domain，如果已存在后台就会做更新
            graph.edges.push({
              startNodeId: skill_id,
              endNodeId: domain_id,
              label: 'skill_domain',
              properties: {
                name: 'skill_domain',
              }
            })
          }

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

              for(let domain_id of achieve.ori_domains){ //比较不同，放弃的domain就移除
                if(this.tmp_domains.indexOf(domain_id) === -1){
                  removeDomain(achieve.id, domain_id) //如果ori_domains不为空，则一定不是新的achievement
                }
              }

              //achieve的domains是直接修改的，在achievementFormItem里
              fake_id = add_achievement(graph, achieve, fake_id, achieve.id ? false: true, i, achieve.domains)

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
            this.$emit('refresh') //外部更新数据
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
