<template>
  <div>
    <!-- 太坑了，老是忘记state. -->
    <scroll-page :loading="state.isLoading" :noData="state.noData" v-on:load="handleSearch">
      <div class="archive left">
        <!--时间线-->
        <el-timeline>
          <!-- 时间线item -->
          <el-timeline-item
            v-for="(l, i) in state.articlesList"
            :key="l.year"
            placement="top"
            hide-timestamp
          >
            <!-- 年份 -->
            <h3 class="year">{{l.year}}</h3>
            <!-- 每年的时间线item -->
            <el-timeline-item
              v-for="(item, index) in l.list"
              :key="item.id"
              placement="top"
            >
              <router-link :to="`/view/${item.id}`">
                <!-- 文章标题、时间 -->
                <h3 class="title">{{item.title}}</h3>
              </router-link>
              <p>{{formatTime(item.createDate)}}</p>
            </el-timeline-item>
          </el-timeline-item>
        </el-timeline>
      </div>
    </scroll-page>
  </div>
</template>

<script lang="ts">
import ScrollPage from '@/components/scrollpage/index.vue'
import { defineComponent, reactive, onMounted } from "vue";
import {useRoute} from 'vue-router'
import { timestampToTime } from "@/utils/utils";
import { ParamsArchive, ArchiveData } from "@/types/index";
import {listArchiveArticles } from '@/api/article'
import ArticleScrollPage from '@/views/articles/ArticleScrollPage.vue';

export default defineComponent({
  name: "Archives",
  components: {
    ScrollPage,
    ArticleScrollPage,
  },
  setup() {
    const route = useRoute()
    const state = reactive({
      noData: false,
      isLoading: false,
      articlesList: [] as Array<any>,
      articles: [],
      total: 0,
      page: { //页面情况及搜索文章限制
        pageSize: 20, //每次获取5篇文章
        pageNumber: 1, //当前的下一页是第几页
        name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
        sort: 'desc', //降序
      },
    });

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    }

    const handleSearch = async (): Promise<void> => {
      console.log('in handleSearch')
      state.isLoading = true;
      const data: any = await listArchiveArticles(state.page)
      state.isLoading = false;

      console.log('data:', data)
      state.articles = [...state.articles, ...data.data];

      //按照年份分组
      let year = null
      let idx = 0
      state.articlesList[idx] = {list: []}
      for(let a of state.articles){
        if(!year){
          year = a.year
          state.articlesList[idx].year = year
          state.articlesList[idx].list.push(a)
        }
        else{
          if(a.year != year){
            state.articlesList[++idx] = {year: a.year, list: [a]}
            year = a.year
          }
          else{
            state.articlesList[idx].list.push(a)
          }
        }
      }
      console.log('articleList:', state.articlesList)


      if (data.data.length == 0) {
        state.noData = true;
      }
      else{
        state.page.pageNumber++;
      }
      console.log('state:', state)
    }

    onMounted(() => {
      handleSearch();
    })

    return {
      state,
      formatTime,
      handleSearch
    };
  },
});
</script>

<style lang="less" scoped>
.archive {
  padding: 40px 0;
  min-width: 830px; //这里不应该是定值，而应随浏览器宽度变化
  .year {
    font-size: 30px;
    font-weight: bold;
    color: #000;
    margin-top: 0;
  }
  a {
    text-decoration: none;
  }

  .title {
    color: #333;
    &:hover {
      color: #1890ff;
    }
  }
}
</style>

