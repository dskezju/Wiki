<template>
  <columns-page v-bind='column'/>
</template>


<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import ColumnsPage from "@/views/column/ColumnsPage.vue";

export default defineComponent({
  name: "Columns",
  components: {
    ColumnsPage,
  },
  data(){
    return {
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
      }
    }
  }

});
</script>

<style lang="less" scoped>

</style>

