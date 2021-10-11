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
      console.log('skills:', data.data)
      if(!skills)
        return
      skills.forEach((skill) => {
        console.log(skill.childrenNodes)
        skill.achievements = skill.childrenNodes
        delete skill.childrenNodes
        console.log(skill.achievements)

        if(skill.achievements){
          skill.achievements.forEach((achieve) => {
            console.log('achieve', achieve)
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
            }
            else{
              achieve.imgs = []
              achieve.videos = []
              achieve.domains = []
            }

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
