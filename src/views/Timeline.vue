<template>
  <div class="timeline left">
    <el-timeline>
      <el-timeline-item
        v-for="(l, i) in state.list"
        :key="l.id"
        :color="l.state === 1 ? 'green' : l.state === 3 ? 'red' : ''"
        placement="top"
        hide-timestamp
      >
        <el-card>
          <h3>{{l.title}}</h3>
          <p v-html="l.content"></p>
          <p>
            <span>
              {{formatTime(l.start_time)}}--
            </span>
            <span>
              {{formatTime(l.end_time)}}
            </span>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import LoadEnd from "@/components/common/LoadEnd.vue";
import LoadingCustom from "@/components/common/Loading.vue";
import {
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  timestampToTime,
} from "@/utils/utils";
import {getTimeAxisList} from '@/api/timeline'
import { Params, TimelineList, TimelinesData } from "@/types/index";

//用defineComponent包裹了组件;
//defineComponent函数，只是对setup函数进行封装，返回options的对象；
//defineComponent最重要的是：在TypeScript下，给予了组件 正确的参数类型推断
export default defineComponent({
  name: "Timeline",
  components: {
    LoadEnd,
    LoadingCustom,
  },
  setup() {
    const state = reactive({
      isLoadEnd: false,
      isLoading: false,
      list: [
        {
          id: 3,
          state: 0,
          title: '',
          content:
            `<div>
              增加个人技能与成果等信息收集表单，用<a href='http://relation-graph.com/#/demo/simple'>relation graph</a>可视化，
              目前样式上有待调整
          </div>`,
          start_time: '2021.9.7 08:00:00',
          end_time: '2021.10.11 08:00:00'
        },
        {
          id: 2,
          state: 0,
          title: '初版',
          content:
            `<div>
              前端换成另一个模板：<a href="https://github.com/biaochenxuying/blog-vue-typescript">
              https://github.com/biaochenxuying/blog-vue-typescript</a>，后端没变，主要是修改、测试，
              增加写文章、知识卡片、创建专栏、显示个人页面功能，目前显示文章目录还有一些问题。
          </div>`,
          start_time: '2021.7.30 08:00:00',
          end_time: '2021.9.6 08:00:00'
        },
        {
          id: 1,
          state: 1,
          title: 'Wiki页面搭建',
          content:
            `<div>
              前端（vue 3）+ 后台（spring boot 2），主要参考<a href='https://github.com/shimh-develop/blog-vue-springboot'>
              https://github.com/shimh-develop/blog-vue-springboot</a>，前后端联合测试成功。
          </div>`,
          start_time: '2021.7.15 08:00:00',
          end_time: '2021.7.30 08:00:00'
        },
        {
          id: 1,
          state: 1,
          title: '主页面搭建',
          content:
            `<div>
              前端（vue）主要参考Gitee上的开源后台管理项目<a href='https://gitee.com/y_project/RuoYi-Vue'>
              RuoYi-Vue
          </div>`,
          start_time: '2021.7.1 08:00:00',
          end_time: '2021.7.15 08:00:00'
        },

      ] as TimelineList[],
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    });

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    return {
      state,
      formatTime,
    };
  }
});
</script>
<style lang="less" scoped>
.timeline {
  padding: 40px 0;
  .year {
    font-size: 34px;
    font-weight: bold;
    color: #000;
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

