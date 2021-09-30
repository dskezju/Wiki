<template>
  <!-- 传过去loading、offset、no-data，监听load事件，子组件调用this.$emit('load')触发load -->
  <scroll-page
    :loading="loading"
    :offset="offset"
    :no-data="noData"
    v-on:load="load"
  >

    <div class="project left">
      <el-row :gutter="20">
        <el-col
          class="el-col-pointer"
          :span="isMobileOrPc ? 24 : 12"
          v-for="article in articles"
          :key="article.id"
          style="margin-bottom: 20px"
        >
          <!-- 卡片，封面+标题等 -->
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>{{article.title}}</span>
                <el-button class="button" @click="edit(article.id)" type="text">编辑</el-button>
              </div>
            </template>

            <div class="content">
              {{article.summary}}
            </div>

            <h5 style="margin-bottom: 0px">
              <span class="me-article-author">
                <i class="me-icon-author"></i>
                &nbsp;{{article.author.name}}&nbsp;
              </span>
              <!-- 标签 -->
              <span class="tags " title="标签">
                <el-tag
                  size="mini"
                  v-for="tag in article.tags"
                  :key="tag.id"
                  class="tag"
                  type="success"
                >
                  {{tag.tagName}}
                </el-tag>
              </span>

              <span>
                创建于：
                {{formatTime(article.createDate)}}
              </span>
            </h5>

          </el-card>
        </el-col>
      </el-row>
    </div>

  </scroll-page>
</template>

<script>
  import ScrollPage from '@/components/scrollpage/index.vue' //自定义的单页滚动组件
  import {getArticles} from '@/api/article'
  import {formatTime} from '@/utils/utils'
  import {isMobileOrPc} from '@/utils/utils'

  export default {
    name: "ArticleScrollPage",
    components: {
      ScrollPage,
    },
    props: {
      offset: {
        type: Number,
        default: 100
      },
      page: { //用来初始化this.innerPage
        type: Object,
        default() {
          return {}
        }
      },
      query: { //在archive里这个query会传过来带month和year
        type: Object,
        default: {},
        required: true, //必须要传
      },
      showType: {
        type: String,
        default: 'public',
      }
    },
    data() {
      return {
        loading: false,
        noData: false,
        isMobileOrPc: isMobileOrPc(),
        innerPage: { //内页，因为是单页滚动，记录加载了多少页
          pageSize: 5, //每次获取5篇文章
          pageNumber: 1, //当前的下一页是第几页
          name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
          sort: 'desc' //降序
        },
        articles: []
      }
    },
    watch: {
      query: {
        handler(newval) { //外界需要确保query不会连着快速改变，比如query未确定下来就不要进入这个组件，不然前一次请求还没结束，干扰后续的articles
          this.noData = false
          this.articles = []
          this.innerPage.pageNumber = 1
          this.getArticles()
        },
        deep: true //监测query里每个元素的变化
      },
      page: {
        handler() {
          this.noData = false
          this.articles = []
          this.innerPage = this.page
          console.log('wiki page:', page)
          this.getArticles()
        },
        deep: true
      },
    },
    mounted() { //创建时获取文章，不要用created，因为这时props还没传过来
      if(this.page){
        this.innerPage = {...this.page}
      }
      this.getArticles()
    },
    methods: {
      edit(id) {
        this.$router.push(`/edit/wiki/${id}`)
      },
      formatTime: (value) => {
        return formatTime(value);
      },
      load() { //加载时获取文章
        this.getArticles()
      },
      view(id) { //进入文章
        this.$router.push({path: `/view/${id}`})
      },

      getArticles() { //获取文章
        let that = this
        that.loading = true //设置loading为true，避免子组件里重复触发load事件

        console.log('this.query:', this.query)
        //根据query中的查询条件，和当前加载了多少页的信息，向后端再加载innerPage.pageSize篇文章
        getArticles(that.query, that.innerPage).then(data => {
          let newArticles = data.data

          console.log('newArticles:', newArticles)
          if (newArticles && newArticles.length > 0) {
            that.innerPage.pageNumber += 1 //页数+1
            newArticles = newArticles.filter((a) => {return a.state == 1})
            that.articles = that.articles.concat(newArticles) //新文章拼接在后面
          } else { //设置noData为true，表示没有更多数据了，在scrol-page里再怎么划也没用了
            that.noData = true
          }

        }).catch(error => {
          console.log(error)
          if (error !== 'error') {
            that.$message({type: 'error', message: '加载失败!', showClose: true})
          }
        }).finally(() => { //最后还要把它设为false
          that.loading = false
        })
      }
    },

  }
</script>

<style lang='less' scoped>
.project {
  overflow: hidden;
  padding: 40px 0;
  // .el-col-pointer {
  //   cursor: pointer;
  // }
  .content {
    min-height: 40px;
    text-overflow: ellipsis;
    padding-bottom: 10px;
  }

}

.tags {
  float: right;
  .tag {
    margin-left: 5px;
    border-right: 2px solid #eee;
  }
}

.category {
  .tag {
    margin-left: 10px;
    border-right: 2px solid #eee;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  margin-bottom: 20px;
}



</style>
