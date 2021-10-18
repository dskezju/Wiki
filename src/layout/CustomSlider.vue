<template>
  <div class="right slider">
    <img
      class="right-logo"
      :src="$store.state.user.avatar"
      alt=""
    >
    <div class="title">{{account}}</div>
    <div class="right-content">
    </div>
    <div class="tags">
      <div class="title">标签</div>
      <!--点击进入相应标签的文章页-->
      <router-link
        v-for="tag in hotTags"
        class="item"
        :key="tag.id"
        :to="`/articles?tag_id=${tag.id}&tag_name=${tag.tagName}&category_id=`"
      >
        <span :key="tag.id">{{tag.tagName}}</span>
      </router-link>
    </div>

    <div class="categories">
      <div class="title">分类</div>
      <!--点击进入相应分类的文章页-->
      <router-link
        v-for="c in categories"
        class="item"
        :key="c.id"
        :to="`/articles?category_id=${c.id}`"
      >
        <span :key="c.id">{{c.categoryName}}</span>
      </router-link>
    </div>

    <el-aside>
      <!-- 展示文章、归档等的组件 -->
      <card-article cardHeader="最热文章" :articles="hotArticles"></card-article>
      <card-archive cardHeader="文章归档" :archives="archives"></card-archive>
      <card-article cardHeader="最新文章" :articles="newArticles"></card-article>
    </el-aside>
  </div>
</template>

<script lang="ts">
import CardArticle from '@/components/card/CardArticle.vue'
import CardArchive from '@/components/card/CardArchive.vue'
import CardTag from '@/components/card/CardTag.vue'
import { defineComponent, reactive, onMounted } from "vue";
import {getHotTags} from '@/api/tag'
import {getArticles, getHotArtices, getNewArtices} from '@/api/article'
import {listArchives} from '@/api/article'
import { getAllCategories } from '@/api/category';

export default defineComponent({
  name: "CustomSlider",
  components: {
    CardArticle,
    CardTag,
    CardArchive
  },
  created() { //创建时加载右边的卡片，最热文章、最新文章、归档等
    this.getHotArtices()
    this.getNewArtices()
    this.getHotTags()
    this.listArchives()
    this.getCategories()
  },
  data() {
    return {
      hotTags: [],
      hotArticles: [],
      newArticles: [],
      archives: [],
      categories: [],
    }
  },
  computed: {
    avatar(){
      let avatar = this.$store.state.user.avatar
      if(!avatar){
        return require('@/assets/user.jpg')
      }
      else{
        return avatar
      }
    },
    account(){
      return this.$store.state.user.account
    }
  },
  methods: {
    getHotArtices() {
      let that = this
      getHotArtices().then(data => {
        that.hotArticles = data.data
      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '最热文章加载失败!', showClose: true})
        }
      })
    },
    getNewArtices() {
      let that = this
      getNewArtices().then(data => {
        that.newArticles = data.data
      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '最新文章加载失败!', showClose: true})
        }

      })

    },
    getHotTags() {
      let that = this
      getHotTags().then(data => {
        that.hotTags = data.data
      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '最热标签加载失败!', showClose: true})
        }

      })
    },
    listArchives() {
        let that = this
      listArchives().then((data => {
        this.archives = data.data
        console.log('this.archives:', this.archives)
      })).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '文章归档加载失败!', showClose: true})
        }
      })
    },
    getCategories() {
      getAllCategories().then((data => {
        this.categories = data.data
      })).catch(error => {
        console.log(error)
        if (error !== 'error') {
          this.$message({type: 'error', message: '文章归档加载失败!', showClose: true})
        }
      })
    }

  },

});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.slider {
  padding-top: 50px;
  margin-left: 20px;
}
.right {
  text-align: center;
  .right-logo {
    width: 130px;
    border-radius: 50%;
    animation: mylogo 3s;
    -moz-animation: mylogo 3s; /* Firefox */
    -webkit-animation: mylogo 3s; /* Safari and Chrome */
    -o-animation: mylogo 3s; /* Opera */
    animation-iteration-count: infinite;
  }
  .title {
    font-size: 25px;
    font-weight: bold;
  }
  .right-content {
    padding: 10px 0 20px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .item {
      display: inline-block;
      padding: 0 10px;
      color: #969696;
      border-right: 1px solid #eee;
      &:last-child {
        border-right: none;
      }
      .num {
        color: #333;
      }
    }
  }
  .introduce {
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .content {
      color: #333;
      line-height: 26px;
      text-align: left;
      padding: 20px 0;
    }
    .footer {
      padding-bottom: 10px;
    }
  }
  .tags {
    min-height: 200px;
    padding: 5px 0 20px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .item {
      display: inline-block;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
      background-color: #eee;
      color: #333;
      margin: 10px 10px 0 0;
      text-decoration: none;
      &:hover {
        color: #409eff;
      }
    }
  }
  .categories {
    min-height: 100px;
    padding: 5px 10px 20px 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;

    .title {
      font-size: 14px;
      color: #969696;
    }

    .item {
      display: inline-block;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
      background-color: #eee;
      color: #333;
      margin: 10px 10px 0 0;
      text-decoration: none;

      &:hover {
        color: #409eff;
      }
    }
  }
  .classification {
    padding: 5px 0 20px 0;
    .title {
      font-size: 14px;
      color: #969696;
    }
    .item {
      text-align: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
      color: #666;
      margin: 10px 10px 0 0;
    }
  }
}
@keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-moz-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-webkit-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}

@-o-keyframes mylogo {
  0% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
  25% {
    transform: rotate(0deg) scale(1, 1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(0deg) scale(0.8, 0.8);
    opacity: 1;
  }
}
</style>
