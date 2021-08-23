  <template>
  <div class="left clearfix">
    <!-- 如果url里有tag_id，就显示标签名称 -->
    <h3 v-if="state.article.query.tagId" class="left-title">
      {{state.tag_name}} 相关的文章：
    </h3>

    <article-scroll-page v-bind="state.article"/>

  </div>
</template>

<script lang="ts">
import Home from '@/views/Home.vue'
import { defineComponent, reactive, onMounted, nextTick } from "vue";
import LoadEnd from "@/components/LoadEnd.vue";
import LoadingCustom from "@/components/Loading.vue";
import {
  throttle,
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  getQueryStringByName,
  timestampToTime,
} from "@/utils/utils";
import ArticleScrollPage from '@/views/articles/ArticleScrollPage.vue';

// 获取可视区域的高度
const viewHeight = window.innerHeight || document.documentElement.clientHeight;
// 用新的 throttle 包装 scroll 的回调
const lazyload = throttle(() => {
  // 获取所有的图片标签
  const imgs = document.querySelectorAll("#list .item img");
  // num 用于统计当前显示到了哪一张图片，避免每次都从第一张图片开始检查是否露出
  let num = 0;
  for (let i = num; i < imgs.length; i++) {
    // 用可视区域高度减去元素顶部距离可视区域顶部的高度
    let distance = viewHeight - imgs[i].getBoundingClientRect().top;
    let imgItem: any = imgs[i];
    // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
    if (distance >= 100) {
      // 给元素写入真实的 src，展示图片
      let hasLaySrc = imgItem.getAttribute("data-has-lazy-src");
      if (hasLaySrc === "false") {
        imgItem.src = imgItem.getAttribute("data-src");
        imgItem.setAttribute("data-has-lazy-src", "true");
      }
      // 前 i 张图片已经加载完毕，下次从第 i+1 张开始检查是否露出
      num = i + 1;
    }
  }
}, 1000);

export default {
  name: "Articles",
  components: {
    LoadEnd,
    LoadingCustom,
    Home,
    ArticleScrollPage,
  },
  watch: {
    $route: {
      handler(val: any, oldVal: any) {
        this.routeChange(val, oldVal);
      },
      immediate: true,
    },
  },
  setup(props, context) {
    const state = reactive({
      isLoadEnd: false,
      isLoading: false,
      articlesList: [] as Array<any>,
      total: 0,
      tag_name: decodeURI(getQueryStringByName("tag_name")),
      article: {
        query: {
          year: '',
          month: '',
          tagId: getQueryStringByName("tag_id"), //在url中找tag_id=...&中的 内容，即当前是不是正在显示某个tag内的文章
          categoryId: getQueryStringByName("category_id"), //同上
        },
        page: { //页面情况及搜索文章限制
          pageSize: 5, //每次获取5篇文章
          pageNumber: 1, //当前的下一页是第几页
          name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
          sort: 'desc', //降序
        },
      },
    });

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    //路由改变时，从url中获取tag、category，重置pageNum，重新搜索
    const routeChange = (val: any, oldVal: any): void => {
      state.tag_name = decodeURI(getQueryStringByName("tag_name"));
      state.article.query.tagId = getQueryStringByName("tag_id");
      state.article.query.categoryId = getQueryStringByName("category_id");
      // state.articlesList = [];
      state.article.page.pageNumber = 1;
      // handleSearch();
    }

    onMounted(() => {
      //这个函数会出问题，图片突然加载不出来
      // document.addEventListener("scroll", lazyload);
    });

    return {
      state,
      formatTime,
      // handleSearch,
      routeChange
    };
  }
};
</script>


<style lang="less" scoped>

</style>
