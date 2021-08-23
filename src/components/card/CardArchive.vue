<template>

  <el-card :body-style="{ padding: '8px 18px', minHeight: '50px' }">
    <div  class="me-category-header">
      <span>{{cardHeader}}</span>
    </div>

    <ul class="me-category-list">
      <li v-for="a in archives" @click="view(a.year, a.month)" :key="a.year + a.month" class="me-category-item">
        <a>{{`${a.year}年${a.month}月`}}</a>
      </li>
    </ul>
  </el-card>

</template>

<script>
  export default {
    name: "CardArchive",
    props: {
      cardHeader: {
        type: String,
        required: true
      },
      archives: {
        type: Array,
        required: true
      }
    },
    data(){
      return {
        timeline: {},
      }
    },
    watch: {
      archives: {
        handler (newval) {
          console.log('new archives:', newval)
        }
      }
    },
    methods: {
      view(year, month) {
        this.$router.push({path: `/archive/${year}/${month}`})
      }
    }
  }
</script>

<style scoped>

  .me-category-header {
    font-weight: 600;
  }

  .me-category-list {
    list-style-type: none;
    padding: 0;
    text-align: center;
  }

  .me-category-item {
    display: inline-block;
    width: 40%;
    padding: 4px;
    font-size: 14px;
    color: #5FB878;
  }

  .me-category-item:hover {
    text-decoration: underline;
    cursor: pointer;
  }

</style>
