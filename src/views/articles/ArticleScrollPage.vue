<template>
  <!-- 传过去loading、offset、no-data，监听load事件，子组件调用this.$emit('load')触发load -->
  <scroll-page
    :loading="loading"
    :offset="offset"
    :no-data="noData"
    v-on:load="load"
  >

    <!-- 填充scroll-page的slot -->
    <!-- <article-item v-for="a in articles" :key="a.id" v-bind="a"></article-item> -->

    <ul class="articles-list" id="list">
      <transition-group name="el-fade-in">
        <li
          v-for="(article) in articles"
          :key="article.id"
          class="item"
        >

          <img
            class="wrap-img img-blur-done"
            :src="article.cover ? article.cover : require('@/assets/article_avatar.jpg')"
            data-has-lazy-src="false"
            alt="文章封面"
          />
          <!-- 文章卡片 -->
          <div class="content">
            <!-- state.href根据开发还是生产而改变 -->
            <!-- 只有标题行才能点击 -->

            <h4 class="title">
              <a target="_blank" :href="href + article.id">
                {{article.title}}

                <!-- 分类 -->
                <span class="category " title="分类">
                  <el-tag
                    size="mini"
                    :key="article.category.id"
                    class="tag"
                  >
                    {{article.category.categoryName}}
                  </el-tag>
                </span>
              </a>

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
            </h4>

            <p class="abstract">{{article.summary}}</p>
            <div class="meta">
              <span class="me-article-author">
                <i class="me-icon-author"></i>

                &nbsp;{{article.author.name}}&nbsp;
              </span>
              <span>查看 {{article.viewCounts}}</span>
              <span>评论 {{article.commentCounts}}</span>
              <span>赞 {{article.likes}}</span>
              <span
                v-if="article.createDate"
                class="time"
              >
                {{formatTime(article.createDate)}}
              </span>

            </div>
          </div>

        </li>
      </transition-group>
    </ul>
  </scroll-page>
</template>

<script>
  import ArticleItem from '@/components/article/ArticleItem.vue'
  import ScrollPage from '@/components/scrollpage/index.vue' //自定义的单页滚动组件
  import {getArticles} from '@/api/article'
  import {formatTime} from '@/utils/utils'

  export default {
    name: "ArticleScrollPage",
    components: {
      ArticleItem,
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
        href: '/view/',
        loading: false,
        noData: false,
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
        handler(newval) { //外界需要确保query不会连着快速改变，比如query为确定下来就不要进入这个组件，不然前一次请求还没结束，干扰后续的articles
          this.noData = false
          this.articles = []
          this.innerPage.pageNumber = 1
          this.getArticles()

          //如果query快速改变了，就会连着调用两次getArticles，必须保证一个一个来
          //不然前一次的数据还没到，做清空articles也没意义
          //不过如果query连续改变多次，还是没法保证排队执行
          // this.synchronizedQueryChange()
        },
        deep: true //监测query里每个元素的变化
      },
      page: {
        handler() {
          this.noData = false
          this.articles = []
          this.innerPage = this.page
          // console.log('page:', page)
          this.getArticles()
        },
        deep: true
      },
      $route: { //路由改变时重新获取不好，因为此时还是用当前页面的query和page去获取的，会干扰跳转后的页面
        handler(){
          // this.getArticles()
        }
      }
    },
    mounted() { //创建时获取文章，不要用created，因为这时props还没传过来
      console.log('in mounted, this.query:', this.query)
      this.getArticles()
      //这里有坑，这里执行的是query第一次传过来的值，之后query改变后会发送新的请求，尽管articles被清空了
      //但新的请求的结果可能比旧的请求先到，于是后到的旧的请求的结果还是干扰了this.articles
    },
    methods: {
      //主要是为了query改变时等待上一次获取文章请求完全结束，不然上一次获取文章请求可能会干扰这一次的
      //scroll-page里会确保一次只会调用一个getArticles，直到请求返回，这里也要确保query初始化和改变时，依次执行getArticles
      // synchronizedQueryChange(){
      //   console.log('new query:', this.query)
      //   //loading为true说明有人正在获取文章中，此时要等待
      //   //不然清空了articles也没用，因为之前的请求返回后依旧会拼在articles后面
      //   if(this.loading == true){ //用loading和递归实现阻塞，强制同步
      //     setTimeout(() => this.synchronizedQueryChange(), 200)
      //   }
      //   else{
      //     this.noData = false
      //     this.articles = [] //此时保证获取文章都结束了
      //     this.innerPage = this.page
      //     this.getArticles() //这里面会把loading设为true，直到结束再设为false
      //         .then(() => {
      //           this.allowScroll = true
      //         })
      //   }

      // },
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
        // console.log('this.articles:', this.articles)
        //根据query中的查询条件，和当前加载了多少页的信息，向后端再加载innerPage.pageSize篇文章
        getArticles(that.query, that.innerPage).then(data => {
          // console.log('that.query:', that.query)
          let newArticles = data.data
          console.log('newArticles:', newArticles)
          if (newArticles && newArticles.length > 0) {
            that.innerPage.pageNumber += 1 //页数+1
            that.articles = that.articles.concat(newArticles) //新文章拼接在后面
          } else { //设置noData为true，表示没有更多数据了，在scrol-page里再怎么划也没用了
            that.noData = true
          }

        }).catch(error => {
          console.log(error)
          if (error !== 'error') {
            that.$message({type: 'error', message: 'xxx文章加载失败!', showClose: true})
          }
        }).finally(() => { //最后还要把它设为false
          that.loading = false
        })

      }
    },


  }
</script>

<style lang='less' scoped>
.left {
  .articles-list { //决定文章卡片样式的是这个，它底下的li，但还不知道宽度是怎么算的
    margin: 0;
    padding: 0;
    list-style: none;
    min-height: 200px;
    .title a {
      color: #333;
      margin: 7px 0 4px;
      display: inherit;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
    }
    .item > div {
      padding-right: 0px;
    }
    .item .wrap-img {
      position: absolute;
      top: 50%; //让图片左上角y坐标位于中心，再往上移自身50%的高度
      right: 0;
      max-width: 100px;
      max-height: 125px;
      transform: translateY(-50%); //向y轴平移自身-50%的高度，居中
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
      }
    }
    li {
      max-width: 710px; //这个是不包括图片的宽度，即padding不算在内，而且限制了这个会出现和articles-list之间的margin
      line-height: 20px;
      position: relative;
      // width: 100%;
      padding: 15px 0px;
      padding-right: 120px; //这个padding是留给封面图片的
      border-bottom: 1px solid #f0f0f0;
      word-wrap: break-word;
      a {
        cursor: pointer;
      }
      &:hover {
        .title a {
          color: rgb(9, 140, 247); //鼠标在li上时，title变色
        }
      }
      .abstract {
        min-height: 30px;
        margin: 0 0 8px;
        font-size: 13px;
        line-height: 24px;
        color: #555;
      }
      .meta {
        padding-right: 0 !important;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        a {
          margin-right: 10px;
          color: #b4b4b4;
          &::hover {
            transition: 0.1s ease-in;
            -webkit-transition: 0.1s ease-in;
            -moz-transition: 0.1s ease-in;
            -o-transition: 0.1s ease-in;
            -ms-transition: 0.1s ease-in;
          }
        }
        span {
          margin-right: 10px;
          color: #666;
        }
      }
    }
  }
}

.tags {
  float: right;
  // padding-top: 15px;
  // padding-right: 20px;
  .tag {
    // padding: 0 10px;
    margin-left: 5px;
    border-right: 2px solid #eee;
    // color: white;
  }
}

.category {
  // float: left;
  // padding-top: 15px;
  // padding-right: 20px;
  .tag {
    // padding: 0 10px;
    margin-left: 10px;
    border-right: 2px solid #eee;
    // color: white;
  }
}

</style>
