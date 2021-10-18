  <template>
  <div class="left clearfix">

    <el-tabs
      tab-position="top"
      style="height: 200px"
      v-model="activeName"
      @tab-click="handleClick"
      class='me-el-tabs'
    >
      <el-tab-pane label="文章" name='1'>
        <!-- 如果url里有tag_id，就显示标签名称 -->
        <h3 v-if="this.article.query.tagId" class="left-title">
          {{this.tag_name}} 相关的文章：
        </h3>
        <article-scroll-page v-bind="this.article"/>
      </el-tab-pane>

      <el-tab-pane label="词条" name='2'>
        <h3 v-if="this.article.query.tagId" class="left-title">
          {{this.tag_name}} 相关的内容：
        </h3>
        <wiki-scroll-page v-bind="this.wiki"/>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>


<script lang="ts">
import {
  getQueryStringByName,
  timestampToTime,
} from "@/utils/utils";
import ArticleScrollPage from '@/views/articles/ArticleScrollPage.vue';
import WikiScrollPage from '@/views/articles/wiki/WikiScrollPage.vue'

export default {
  name: "ArticleAndWiki",
  components: {
    ArticleScrollPage,
    WikiScrollPage,
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
    wiki: {
      type: Object,
      required: true,
    },
  },
  watch: {
    $route: {
      handler(val: any, oldVal: any) {
        this.routeChange(val, oldVal);
      },
      immediate: true,
    },
  },
  data(){
    return {
      activeName: '',
      tag_name: decodeURI(getQueryStringByName("tag_name")),
    }
  },
  created(){
    if(localStorage.getItem('article-tab')){ //获取上一次打开的tab
      this.activeName = localStorage.getItem('article-tab')
    }
  },
  methods: {
    handleClick(tab){
      console.log(tab.props.name)
      localStorage.setItem('article-tab', tab.props.name)
    },
    //路由改变时，从url中获取tag、category，重置pageNum，重新搜索
    routeChange(val: any, oldVal: any): void {
      this.tag_name = decodeURI(getQueryStringByName("tag_name"));
      this.article.query.tagId = getQueryStringByName("tag_id");
      this.article.query.categoryId = getQueryStringByName("category_id");
      this.article.page.pageNumber = 1;

      this.wiki.query.tagId = getQueryStringByName("tag_id");
      this.wiki.page.pageNumber = 1;
    },
    formatTime(value: string | Date): string {
      return timestampToTime(value, true);
    }
  },
};
</script>


<style lang="less" scoped>

.el-tabs {
  height: auto !important; // !important表示最高优先级，才能覆盖组件内的样式
}

</style>
