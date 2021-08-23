<template>
  <!-- 凡是div + v-title，全都出现莫名的问题 -->
  <!-- <div v-title :data-title="title"> -->
  <el-container>
    <el-aside class="me-area">
      <ul class="me-month-list">
        <li v-for="a in state.archives" :key="a.year + '' + a.month" class="me-month-item">
          <el-badge :value="a.count">
            <el-button @click="changeArchive(a.year, a.month)" size="small">{{a.year +'年' + a.month + '月'}}
            </el-button>
          </el-badge>
        </li>
      </ul>
    </el-aside>

    <div class="left clearfix">
      <h3 class="left-title">
        <div class="me-month-title">{{currentArchive}}</div>
      </h3>

      <el-divider>
        <i class='el-icon-time'/>
      </el-divider>

      <el-container>
        <el-main>
          <article-scroll-page v-bind="state.article"/>
        </el-main>
      </el-container>
    </div>

  </el-container>
</template>

<script lang="ts">
import { listArchives } from '@/api/article';
import {defineComponent, onMounted, reactive, watch} from 'vue'
import {useRoute} from 'vue-router'
import {ElMessage} from "element-plus";
import ArticleScrollPage from '@/views/articles/ArticleScrollPage.vue'

export default defineComponent({
  name: "archiveDetail",
  components: {
    ArticleScrollPage,
  },
  methods: {
    changeArchive(year, month) {
      this.$router.push({path: `/archive/${year}/${month}`})
    },
  },
  computed: {
    title (){
      return this.currentArchive + ' - 文章归档 - '
    },
    currentArchive (){
      if(this.state.article.query.year && this.state.article.query.month){
        return `${this.state.article.query.year}年${this.state.article.query.month}月`
      }
      return '全部'
    }
  },
  setup(props, context){
    const route = useRoute();
    const state = reactive({
      year: '',
      month: '',
      archives: [],
      article: {
        query: {
          year: route.params.year,
          month: route.params.month,
        },
        page: { //页面情况及搜索文章限制
          pageSize: 20, //每次获取文章
          pageNumber: 1, //当前的下一页是第几页
          name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
          sort: 'desc', //降序
        },
      }
    })

    watch(route, (newRoute) => {
      if(newRoute.params.year){
        state.article.query.year = newRoute.params.year
      }
      if(newRoute.params.month){
        state.article.query.month = newRoute.params.month
      }
    })

    onMounted(() => { //获取archive，所有文章，虽然有点重复，因为在CustomSlider里做过一次了
      console.log('listarchives')
      listArchives().then((data => {
        state.archives = data.data
      })).catch(error => {
        ElMessage({type: 'error', message: '文章归档加载失败!', showClose: true})
      })
    })

    return {
      state,
    }
  }
})
</script>

<style scoped>
.me-area {
  width: 80px;

}
.el-container {
  /* width: 830px; */
}

.el-aside {
  left: 60px;
  /* position: fixed; */
  overflow: auto;
  padding-left: 0;
  margin-right: 30px;
  width: 130px !important;
}

.el-main {
  /* padding: 0px;
  line-height: 16px; */
}

.me-month-list {
  padding-left: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  list-style-type: none;
}

.me-month-item {
  margin-top: 18px;
  padding: 4px;
  font-size: 18px;
  color: #5FB878;
}

.me-order-list {
  float: right;
}

.me-month-title {
  margin-left: 4px;
  margin-bottom: 12px;
}
</style>
