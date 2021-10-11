<template>

  <article-and-wiki v-bind="params"/>

</template>

<script lang="ts">
import {
  getQueryStringByName,
} from "@/utils/utils";
import ArticleAndWiki from '@/views/articles/ArticleAndWiki.vue'

export default {
  name: "Articles",
  components: {
    ArticleAndWiki,
  },
  data(){
    return {
      params: {
        article: {
          query: {
            tagId: getQueryStringByName("tag_id"), //在url中找tag_id=...&中的 内容，即当前是不是正在显示某个tag内的文章
            categoryId: getQueryStringByName("category_id"), //同上
          },
          page: { //页面情况及搜索文章限制
            pageSize: 10, //每次获取5篇文章
            pageNumber: 1, //当前的下一页是第几页
            name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
            sort: 'desc', //降序
          },
        },
        wiki: {
          query: {
            tagId: getQueryStringByName("tag_id"), //在url中找tag_id=...&中的 内容，即当前是不是正在显示某个tag内的文章
          },
          page: { //页面情况及搜索文章限制
            pageSize: 5, //每次获取5篇文章
            pageNumber: 1, //当前的下一页是第几页
            name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
            sort: 'desc', //降序
          },
        }
      },
    }
  },
};
</script>


<style lang="less" scoped>

</style>
