<template>
  <div>
    <div v-for="(skill, index) in skills" :key="index">
      <div v-if='skill.editMode'>
        <edit-skill @refresh='refresh' :form='skill'/>
      </div>

      <div style='margin-top:20px;margin-bottom: 20px' v-else>
        <skill-desc-item
          :skill='skill'
          :index='index'
          @del-skill='delSkill'
          @change-mode='changeMode(index)'
        />
      </div>
    </div>
  </div>
</template>

<script>
import {getSkills} from '@/api/graph'
import EditSkill from '@/views/profile/skill/EditSkill.vue'
import SkillDescItem from '@/views/profile/skill/SkillDescItem.vue'
import {deleteSkill} from '@/api/graph'

export default {
  name: 'ShowSkills',
  components: {
    EditSkill,
    SkillDescItem,
  },
  data(){
    return {
      skills: [],
    }
  },
  mounted(){
    this.getPersonalSkills()
  },
  methods: {
    changeMode(index){
      this.skills[index].editMode = !this.skills[index].editMode
    },
    refresh(){
      this.getPersonalSkills()
    },
    async delSkill(index){
      await deleteSkill(this.skills[index].id)
      this.skills.splice(index, 1)
    },
    async getPersonalSkills(){
      const data = await getSkills(this.$store.state.user.id)
      const skills = data.data
      // console.log('skills:', data.data)
      if(!skills)
        return
      skills.forEach((skill) => {
        // console.log(skill.childrenNodes)
        if(skill.childrenNodes){
          skill.domains = skill.childrenNodes.filter((item) => {
            return item.label == 'domain'
          })
          // skill.domains.forEach((item) => item.id) //抽风了
          skill.domains = skill.domains.map((item) => item.id) //只需要留id就行

          skill.achievements = skill.childrenNodes.filter((item) => {
            return item.label == 'achievement'
          })
        }
        else{
          skill.domains = []
        }
        // console.log('domains:', skill.domains)
        skill.ori_domains = skill.domains.slice() //备份，因为domains会被更改

        delete skill.childrenNodes
        console.log('domains:', skill.domains)

        if(skill.achievements){
          skill.achievements.forEach((achieve) => {
            // console.log('achieve', achieve)
            if(achieve.childrenNodes){
              achieve.imgs = achieve.childrenNodes.filter((item) => {
                return item.label == 'image'
              })
              achieve.videos = achieve.childrenNodes.filter((item) => {
                return item.label == 'video'
              })
              achieve.domains = achieve.childrenNodes.filter((item) => {
                return item.label == 'domain'
              })
              //不知道为什么forEach又抽风了
              achieve.domains = achieve.domains.map((item) => item.id) //只需要留id就行
            }
            else{
              achieve.imgs = []
              achieve.videos = []
              achieve.domains = []
            }
            achieve.ori_domains = achieve.domains.slice() //备份，用来比较更改

            delete achieve.childrenNodes
            achieve.editMode = false
          })
        }
        else{
          skill.achievements = []
        }
        skill.editMode = false
      })
      console.log('skills:', skills)
      this.skills = skills
    }
  }
}
</script>
