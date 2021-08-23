<template>
  <div class="left clearfix" style='min-height:800px'>

    <card-me/>

    <el-devider/>

    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      tab-position="top"
    >
      <el-tab-pane label="文章" name='1'>
        <article-scroll-page v-bind='state.article'/>
      </el-tab-pane>

      <el-tab-pane label="知识卡片" name='2'>

      </el-tab-pane>

      <el-tab-pane label="专栏" name='3'>
        <column-page v-bind='state.column'/>
      </el-tab-pane>

      <el-tab-pane label="待完成" name='4'>
        待完成
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter,} from 'vue-router'
import {key} from '@/store'
import ArticleScrollPage from '@/views/articles/ArticleScrollPage.vue'
import { ElMessage } from 'element-plus'
import ColumnPage from '@/views/ColumnPage.vue'
import CardMe from '@/components/card/CardMe.vue'

export default defineComponent({
  components: {
    ArticleScrollPage,
    ColumnPage,
    CardMe,
  },
  name: 'Profile',
  data(){
    return {
      activeName: '',
    }
  },
  created(){
    if(localStorage.getItem('profile-tab')){ //获取上一次打开的tab
      this.activeName = localStorage.getItem('profile-tab')
    }
  },
  methods: {
    handleClick(tab){
      console.log(tab.props.name)
      localStorage.setItem('profile-tab', tab.props.name)
    },
  },
  setup(props, context){

    const store = useStore(key)
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      // is_current_user: false, //前端不用判断是不是当前用户了，因为后端会判断哪些数据是属于当前请求的用户的
      article: {
        query: {
          year: '',
          month: '',
          tagId: '',
          categoryId: '',
          authorId: route.params.id,
        },
        page: { //页面情况及搜索文章限制
          pageSize: 10, //每次获取5篇文章
          pageNumber: 1, //当前的下一页是第几页
          name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
          sort: 'desc', //降序
        },
      },
      column: {
        query: {
          tagId: '',
          authorId: '',
        },
        page: {
          pageSize: 10, //每次获取5篇
          pageNumber: 1, //当前的下一页是第几页
          name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
          sort: 'desc' //降序
        }
      },

    })

    onMounted(async () => {
      store.dispatch('getUserInfo')
        .then(() => {
          console.log('user:', store.state.user)
        })
        .catch(res => {
          console.log(res)
          ElMessage({
            type: 'warning',
            message: '请先登录',
          })
          router.push('/')
          return;
        })
      return;
    })

    return {
      state,
    }
  }
})
</script>
