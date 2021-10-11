<template>
  <scroll-page
    :loading="state.isLoading"
    :noData="state.isLoadEnd"
    @load='handleSearch'
  >
    <div class="project left">
      <el-row :gutter="20">
        <el-col
          class="el-col-pointer"
          :span="state.isMobileOrPc ? 24 : 12"
          v-for="(l, index) in state.list"
          :key="l.id"
          style="margin-bottom: 20px"
        >
          <router-link target='_blank' :to="'/column/'+l.id" >
            <!-- 卡片，封面+标题等 -->
            <el-card shadow="hover">
              <img
                :src="l.cover ? l.cover : require('@/assets/user.png')"
                class="image"
              >
              <div style="padding: 14px;">
                <h4>{{l.columnName}}</h4>
                <div class="content">{{l.description}}</div>
                <span>
                  创建于：
                  {{formatTime(l.createDate)}}
                </span>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>

  </scroll-page>
</template>


<script lang="ts">
import { defineComponent, reactive, onMounted, watch } from "vue";
import LoadEnd from "@/components/common/LoadEnd.vue";
import LoadingCustom from "@/components/common/Loading.vue";
import {
  timestampToTime,
  isMobileOrPc,
} from "@/utils/utils";
import { Params, ProjectList, ProjectsData } from "@/types/index";
import {getColumns} from '@/api/column.js'
import ScrollPage from '@/components/scrollpage/index.vue'

export default defineComponent({
  name: "ColumnsPage",
  components: {
    LoadEnd,
    LoadingCustom,
    ScrollPage,
  },
  props: {
    query: Object,
    page: Object,
  },
  setup(props) {
    const state = reactive({
      reverse: true,
      isLoadEnd: false, //加载完毕
      isLoading: false,
      isMobileOrPc: isMobileOrPc(),
      list: [],
      total: 0,
      params: { //单页加载
        query: {
          tagId: '',
          authorId: '',
        },
        page: {
          pageSize: 5, //每次获取5篇
          pageNumber: 1, //当前的下一页是第几页
          name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
          sort: 'desc' //降序
        }

      } as any
    });
    console.log('in column')

    //直接props不行
    watch(()=>props, (newval) => {
      console.log('newprops:', newval)
      if(newval.query){
        state.params.query = newval.query
      }
      if(newval.page){
        state.params.page = newval.page
      }
      state.list = [] //这里同样有query快速变化时，旧的请求干扰新的list的可能性
      handleSearch()
    })


    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    //单页加载，加载下一页的内容
    const handleSearch = async (): Promise<void> => {
      state.isLoading = true;
      //获取下一页内容
      const data = await getColumns(state.params.query, state.params.page) as any
      state.isLoading = false;

      state.list = [...state.list, ...data.data];
      if (data.data.length == 0) { //加载完了
        state.isLoadEnd = true;
      }
      else{
        state.params.page.pageNumber++; //下一页面索引++
      }
    };

    onMounted(() => {
      handleSearch();
      // window.onscroll = () => {
      //   if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
      //     // 如果不是已经没有数据了，都可以继续滚动加载
      //     if (state.isLoadEnd === false && state.isLoading === false) {
      //       handleSearch();
      //     }
      //   }
      // };
    });

    return {
      state,
      formatTime,
      handleSearch,
    };
  }
});
</script>
<style lang="less" scoped>
.project {
  overflow: hidden;
  padding: 40px 0;
  .el-col-pointer {
    cursor: pointer;
  }
  .content {
    min-height: 40px;
    text-overflow: ellipsis;
    padding-bottom: 10px;
  }

}
.image {
  // position: relative;
  max-width: 400px;
  max-height: 200px;
  display: block; //让图片居中的方法
  margin: auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

