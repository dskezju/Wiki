<template>
  <div v-if='graph'>
    <el-button type='primary' plain @click='visible=!visible'>查看个人图谱</el-button>
    <el-dialog width="80%" custom-class="me-dialog" v-model="visible">
      <relation-graph :graph="graph"/>
    </el-dialog>
  </div>
</template>

<script>
import {getUserGraph} from '@/api/graph'
import RelationGraph from '@/components/graph/RelationGraph.vue'

export default {
  name: 'ShowUserGraph',
  components: {
    RelationGraph,
  },
  data(){
    return{
      visible: false,
      graph: '', //还不能写成graph: {},否则就会把graph传给子组件，因为!{}=false
    }
  },
  async created(){
    const data = await getUserGraph(this.$store.state.user.id)
    this.graph = data.data
    console.log('this.graph:', data.data)
  },
}
</script>

<style scoped>
.me-dialog{
  height: 50%;
}
</style>
