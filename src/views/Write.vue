<template>
  <div class='write-area'>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      tab-position="top"
    >
      <el-tab-pane label="文章" name='1'>
        <blog-write :key="key"/>
      </el-tab-pane>

      <el-tab-pane label="知识卡片" name='2'>

      </el-tab-pane>

      <el-tab-pane label="专栏" name='3'>
        <add-column/>
      </el-tab-pane>

      <el-tab-pane label="新增标签" name='4'>
        <!-- 强制刷新组件，需在要刷新的子组件上绑定key，key更改时就会刷新 -->
        <add-tag :key="key" @ok="key++"/>
      </el-tab-pane>

      <el-tab-pane label="新增类别" name='5'>
        <add-category :key="key" @ok="key++"/>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import BlogWrite from '@/views/BlogWrite.vue'
import CardWrite from '@/views/CardWrite.vue'
import {ElMessage} from 'element-plus'
import AddTag from '@/views/AddTag.vue'
import AddCategory from "@/views/AddCategory.vue";
import AddColumn from "@/views/ColumnWrite.vue";

export default defineComponent({
  name: 'Write',
  components: {
    AddColumn,
    AddCategory,
    BlogWrite,
    CardWrite,
    AddTag,
  },
  data(){
    return {
      activeName: '1',
      key: 0,
    }
  },
  created(){
    if(localStorage.getItem('write-tab')){ //获取上一次打开的tab
      this.activeName = localStorage.getItem('write-tab')
    }
  },
  methods: {
    handleClick(tab){
      console.log(tab.props.name)
      localStorage.setItem('write-tab', tab.props.name)
    }
  },
  setup(props, context){

  },
})
</script>

<style lang='less' scoped>

.write-area {
  height: 200px;
  width:900px;
  margin: 0 auto;
  el-tabs {

  }
}
</style>
