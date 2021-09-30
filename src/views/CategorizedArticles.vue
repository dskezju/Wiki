<template>
  <el-container>
    <div class="left clearfix">

      <div class="me-ct-body" :data-title="title">
        <el-main>
        <div class="me-ct-title me-area">
          <!-- 标签 -->
          <template v-if="this.$route.params.type === 'tag'">
            <!-- 图片和tag名字 -->
            <el-image
              class="me-ct-picture"
              :src="ct.cover?ct.cover:defaultAvatar"
              :preview-src-list="[ct.cover?ct.cover:defaultAvatar]"
              :hide-on-click-modal='true'
            >
            </el-image>
            <h3 class="me-ct-name">{{ct.tagName}}</h3>
          </template>

          <!-- 分类 -->
          <template v-else-if="this.$route.params.type === 'category'">
            <!-- 图片和category名字，以及description -->
            <el-image
              class="me-ct-picture"
              :src="ct.cover?ct.cover:defaultAvatar"
              :preview-src-list="[ct.cover?ct.cover:defaultAvatar]"
              :hide-on-click-modal='true'
            >
            </el-image>
            <h3 class="me-ct-name">{{ct.categoryname}}</h3>
            <p>{{ct.description}}</p>
          </template>

          <!-- 专栏 -->
          <template v-else>
            <!-- 名字，以及description -->
            <el-image
              class="me-ct-picture"
              :src="ct.cover?ct.cover:defaultAvatar"
              :preview-src-list="[ct.cover?ct.cover:defaultAvatar]"
              :hide-on-click-modal='true'
            >
            </el-image>
            <h3 class="me-ct-name">
              <!-- 标题和关注、编辑按钮 -->
              {{ct.columnName}}
              <!-- 是创建者的话就显示编辑 -->
              <el-button
                v-if="ct.authorId == $store.state.user.id"
                @click="editColumn"
                class='edit-button'
                size="mini"
                round
                icon="el-icon-edit"
              >
                编辑
              </el-button>
              <!-- 否则视情况选择关注和已关注tag -->
              <span v-else>
                <el-tag type="info" class='edit-button' @click="follow">
                  {{this.followed ? '已关注' : '+ 关注'}}
                </el-tag>
              </span>
            </h3>

            <!-- 标签 -->
            <div class="tags " title="标签">
              <el-tag
                size="mini"
                v-for="tag in ct.tags"
                :key="tag.id"
                class="tag"
                type="success"
              >
                {{tag.tagName}}
              </el-tag>
            </div>
            <!-- 描述 -->
            <p>{{ct.description}}</p>
          </template>

          <!-- 多少篇文章 -->
          <span class="me-ct-meta">{{ct.articles}} 文章</span>
        </div>

        <el-divider/>

        <div class="me-ct-articles">
          <!-- 单页滚动展示文章，用v-if控制query未确定时不要展示文章 -->
          <article-and-wiki
            v-if="this.show"
            v-bind="params"
          />
        </div>
      </el-main>
      </div>
    </div>
  </el-container>

</template>

<script>
  import {getTagDetail} from '@/api/tag'
  import {getCategoryDetail} from '@/api/category'
  import {getColumnById, getColumnDetail, removeColumnMember, addColumnMember, getColumnsByAuthor} from '@/api/column.js'
  import defaultAvatar from '@/assets/logo.jpg'
  import { ElMain, ElMessage } from 'element-plus'
  import ArticleAndWiki from '@/views/ArticleAndWiki.vue'
  import {getQueryStringByName} from '@/utils/utils'

  export default {
    name: 'CategorizedArticles',
    components: {
      ArticleAndWiki,
    },
    mounted() { //创建时获取category或tag
      this.getTypeAndArticles()
      console.log('in categorized')
    },

    watch: {
      '$route': 'getTypeAndArticles' //route变化时
    },
    data() {
      return {
        show: false, //一开始query还没确定，不要去找文章
        defaultAvatar: defaultAvatar,
        ct: {},
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
        // article: {
        //   query: { //查询articles
        //     tagId: '',
        //     categoryId: '',
        //     columnId: '',
        //   },
        //   page: { //内页，因为是单页滚动，记录加载了多少页
        //     pageSize: 5, //每次获取5篇文章
        //     pageNumber: 1, //当前的下一页是第几页
        //     name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
        //     sort: 'desc' //降序
        //   },
        // },
        // followed: false,
      }
    },
    computed: {
      title() {
        if(this.$route.params.type === 'tag'){
          return `${this.ct.tagName} - 标签 - `
        }
        if(this.$route.params.type === 'category'){
          return `${this.ct.categoryName} - 文章分类 - `
        }
        if(this.$route.params.type === 'column'){
          return `${this.ct.columnName} - 专栏 - `
        }
      },
      followed() { //当前用户是否在专栏的members里面
        console.log('members:', this.ct.members)
        return this.ct.members && this.ct.members.find(item => item.id===this.$store.state.user.id)
      }
    },
    methods: {
      follow(){
        if(this.followed){
          this.$confirm('取关后将不能在栏目内发文章，但栏目内文章还会保留，确认继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            removeColumnMember(this.ct.id, this.$store.state.user.id)
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            //重新获取专栏信息
            this.getColumnDetail(this.$route.params.id)
          })
        }
        else{
          if(!this.$store.state.user.id){
            ElMessage({type: 'error', message: '请先登录'})
          }
          else{
            addColumnMember(this.ct.id, this.$store.state.user.id).then(() => {
              ElMessage({type: 'success', message: '操作成功'})
              this.getColumnDetail(this.$route.params.id)
            }).catch((err) => console.log(err))
          }

        }
      },
      editColumn(){
        this.$router.push(`/edit/column/${this.ct.id}`)
      },
      async getTypeAndArticles() {
        let id = this.$route.params.id
        let type = this.$route.params.type
        if ('tag' === type) { //根据type查询tag或category
          await this.getTagDetail(id)
          this.params.article.query.tagId = id
          this.params.wiki.query.tagId = id
          this.show = true
        } else if('category' === type) {
          await this.getCategoryDetail(id)
          this.params.article.query.categoryId = id
          this.params.wiki.query.categoryId = id
          this.show = true
        }
        else if('column' === type){
          this.params.article.query.columnId = id
          this.params.wiki.query.columnId = id
          await this.getColumnDetail(id)
          this.show = true
        }

      },
      async getCategoryDetail(id) { //加载category
        let that = this
        getCategoryDetail(id).then(data => {
          that.ct = data.data
        }).catch(error => {
          if (error !== 'error') {
            that.$message({type: 'error', message: '文章分类加载失败', showClose: true})
          }
        })
      },
      async getTagDetail(id) { //加载tag
        let that = this
        getTagDetail(id).then(data => {
          that.ct = data.data
        }).catch(error => {
          if (error !== 'error') {
            that.$message({type: 'error', message: '标签加载失败', showClose: true})
          }
        })
      },
      async getColumnDetail(id) { //column
        let that = this

        try{ //两个异步操作一定要按先后顺序执行，不然ct就可能被覆盖
          let data = await getColumnDetail(id)
                            .catch(() => {this.$router.push('/column')})
          that.ct = data.data
          console.log(data)

          //获取column的tag，因为detail里获取不到tag，而这里面又获取不到文章数
          data = await getColumnById(this.params.article.query.columnId)
          that.ct.tags = data.data.tags
          that.ct.members = data.data.members //忘了这个是很坑的
          console.log('ct:', that.ct)
        }
        catch{

        }
      },
    },

  }
</script>

<style>
  .me-ct-body {
    margin: 10px auto 140px;
    min-width: 100%;
  }

  .el-main {
    padding: 0;
  }

  .me-ct-title {
    text-align: center;
    min-height: 300px;
    /* padding: 20px; */
  }

  .me-ct-picture img {
    max-height: 150px;
    width: auto;
  }

  .me-ct-name {
    font-size: 20px;
    margin-bottom: 5px;
  }

  .me-ct-meta {
    font-size: 12px;
    color: #969696;
  }

  .me-ct-articles {
    /* width: 640px;
    margin: 30px auto; */
  }

  .edit-button {
    position: absolute;
    left: 55%;
  }

</style>
