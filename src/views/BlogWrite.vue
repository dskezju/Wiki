<template>
  <div style='width:100%;'>
    <el-container>
      <el-container class="me-write-box">
        <el-main class="me-write-main">
          <div class="me-write-title">
            <!-- 标题 -->
            <el-input resize="none"
              type="textarea"
              autosize
              v-model="articleForm.title"
              placeholder="请输入标题"
              class="me-write-input">
            </el-input>

          </div>

          <el-form :model="articleForm" ref="articleForm" :rules="rules">
            <el-form-item prop="summary">
              <!-- 摘要 -->
              <el-input
                type="textarea"
                v-model="articleForm.summary"
                :rows="3"
                placeholder="请输入摘要">
              </el-input>
            </el-form-item>

            <!-- 上传文章封面 -->
            <el-form-item>
              <upload-cover :cover='articleForm.cover' @setCover="setCover"/>
            </el-form-item>

            <!-- 选择category和专栏，只能单选 -->
            <el-form-item label="文章分类" prop="category">
              <el-select v-model="articleForm.category" value-key="id" placeholder="请选择文章分类">
                <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章专栏" prop="column">
              <el-select v-model="articleForm.specialColumn" value-key="id" placeholder="请选择专栏">
                <el-option v-for="c in columns" :key="c.id" :label="c.columnName" :value="c"></el-option>
              </el-select>
            </el-form-item>

            <!-- 选择tag，checkbox-group，可以多选 -->
            <el-form-item label="文章标签" prop="tags">
              <el-checkbox-group v-model="articleForm.tags">
                <el-checkbox v-for="t in tags" :key="t.id" :label="t.id" name="tags">{{t.tagName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item prop='public'>
              <span style='padding-right:5px'>公开</span>
              <span v-if='articleForm.specialColumn.id>0'>(随专栏)</span>
              <el-switch
                v-model="articleForm.open"
                v-else
                :active-value="true"
                :inactive-value="false">
              </el-switch>

            </el-form-item>
          </el-form>

          <div id="placeholder" style="visibility: hidden;height: 89px;display: none;"></div>
          <!-- 编辑内容区 -->
          <markdown-editor ref='md' :editor="articleForm.editor" class="me-write-editor"></markdown-editor>

          <el-row style='padding-top:10px;'>
            <el-col :span="24">
              <div class="me-write-btn">
                <el-col :span="8" :offset="9">
                <el-button @click="cancel">取 消</el-button>
                </el-col>
                <el-col :span="8" :offset="3">
                <el-button type="primary" @click="publish('articleForm')">确 认</el-button>
                </el-col>
                <!-- 如果是更新阶段，显示删除按钮 -->
                <el-col v-if='articleForm.id' :span="8" :offset="7">
                  <el-button type="danger" @click="del">删除</el-button>
                </el-col>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>


    </el-container>
  </div>
</template>

<script>
import 'md-editor-v3/lib/style.css';
import MarkdownEditor from '@/components/markdown/MarkdownEditor.vue'
import {publishArticle, getArticlesByAuthor, deleteArticleById, getArticleById} from '@/api/article'
import {getAllCategories} from '@/api/category'
import {getAllTags} from '@/api/tag'
import { ElMessage, ElPopconfirm } from 'element-plus'
import VueMarkdownEditor, { xss } from '@kangc/v-md-editor';
import UploadCover from '@/components/UploadCover.vue';
import {getWritableColumns} from '@/api/column'

export default {
  name: 'BlogWrite',
  components: {
    MarkdownEditor,
    UploadCover
  },
  async created() {
    console.log('mounted write')
    let user_id = this.$store.state.user.id
    let article_id = this.$route.params.id
    if(!user_id){
      ElMessage({
        type: 'error',
        message: '请先登录',
      })
      if(article_id){
        this.$router.push(`/view/${article_id}`)
      }
      else{
        this.$router.push('/')
      }
      return;
    }
    await this.$store.dispatch('getUserInfo')
          .catch(()=>{
            ElMessage({type: 'error', message: '获取信息失败，请重新登录', showClose: true,})
            this.$router.back()
          })

    console.log(user_id)
    if(article_id){ //如果url里有id，就获取文章
      const article = await getArticleById(article_id)
      console.log('article:', article)
      this.setArticle(article.data)
    }
    this.getCategoriesAndTags() //获取tag和类别
    this.getColumns() //获取专栏

    //lodash，节流，在200ms内最多执行一次里面的函数
    this.editorToolBarToFixedWrapper = this.$_.throttle(this.editorToolBarToFixed, 200)

    //添加事件
    window.addEventListener('scroll', this.editorToolBarToFixedWrapper, false);
  },
  beforeUnmount() { //移除事件，vue3中beforeDestroyed改成了beforeUnmont
    window.removeEventListener('scroll', this.editorToolBarToFixedWrapper, false)
    console.log('removed')
  },
  data() {
    return {
      categories: [],
      columns: [],
      tags: [],
      articleForm: {
        id: '',
        title: '',
        summary: '',
        category: '',
        specialColumn: '',
        tags: [],
        open: true,
        cover: '',
        editor: {
          value: '',
          ref: '',//保存Editor实例  实际不该这样
          'left-toolbar': 'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save emoji todo-list'
        }
      },
      rules: {
        summary: [
          {required: true, message: '请输入摘要', trigger: 'blur'},
          {max: 80, message: '不能大于80个字符', trigger: 'blur'}
        ],
        category: [
          {required: true, message: '请选择文章分类', trigger: 'change'}
        ],
        tags: [
          {type: 'array', required: false, message: '请选择标签', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    title (){
      return '创作'
    }
  },
  methods: {
    async getColumns(){
      const data = await getWritableColumns() //获取可以写入文章的专栏
      this.columns = data.data
      this.columns.splice(0, 0, {id: 0, columnName: '无'})
      console.log('this.columns:', data.data)
    },
    del(){
      this.$confirm('确认永久删除该文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticleById(this.articleForm.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$router.push('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

    },
    setCover(coverUrl){
      this.articleForm.cover = coverUrl
      console.log('cover:', this.articleForm.cover)
    },
    toHtml(text){ //v-md-editor自带的转换html方式
      return xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(text));
    },
    setArticle(article) { //获取文章
      let that = this
      Object.assign(that.articleForm, article)
      console.log('form:', that.articleForm)
      that.articleForm.editor.value = article.body.content

      let tags = this.articleForm.tags.map(function (item) {
        return item.id;
      })
      this.articleForm.tags = tags
    },
    publish(articleForm) { //点击发布

      if (!this.articleForm.title) {
        this.$message({message: '标题不能为空哦', type: 'warning', showClose: true})
        return
      }

      if (this.articleForm.title.length > 40) {
        this.$message({message: '标题不能大于40个字符', type: 'warning', showClose: true})
        return
      }

      if (!this.articleForm.editor.value) {
        this.$message({message: '内容不能为空哦', type: 'warning', showClose: true})
        return
      }

      let that = this

      this.$refs[articleForm].validate((valid) => {
        if (valid) {

          let tags = this.articleForm.tags.map(function (item) {
            return {id: item};
          });
          console.log('tags:', tags)
          console.log(this.articleForm)

          //专栏文章的私密性随专栏，专栏是私密的则里面所有文章都是私密的
          let open = this.articleForm.specialColumn.id > 0 ? this.articleForm.specialColumn.open : this.articleForm.open

          let article = { //article的信息
            id: this.articleForm.id,
            title: this.articleForm.title,
            summary: this.articleForm.summary,
            category: this.articleForm.category,
            tags: tags,
            viewCounts: this.articleForm.viewCounts - 1, //因为会返回到/view/id，但不应该增加阅读数
            cover: this.articleForm.cover,
            open: open,
            specialColumn: this.articleForm.specialColumn,
            updateTime: new Date(),
            body: { //body
              content: this.articleForm.editor.value,
              //不知道为什么会变成纯文本
              // contentHtml: this.$refs.md.toHtml(this.articleForm.editor.value),
              contentHtml: this.toHtml(this.articleForm.editor.value),
            }

          }
          console.log(article)


          let loading = this.$loading({
            lock: true,
            text: '发布中，请稍后...'
          })

          publishArticle(article).then((data) => { //发布给后端
            loading.close();
            that.$message({message: '发布成功！', type: 'success', showClose: true})
            that.$router.push({path: `/view/${data.data.articleId}`})

          }).catch((error) => {
            loading.close();
            if (error !== 'error') {
              that.$message({message: error, type: 'error', showClose: true});
            }
          })

        } else {
          return false;
        }
      });
    },
    cancel() { //取消前弹出对话框
      this.$confirm('文章将不会保存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { //取消后居然重定向到根
        this.$router.push('/')
      })
    },
    getCategoriesAndTags() { //加载分类标签
      console.log('in get')
      let that = this
      getAllCategories().then(data => {
        that.categories = data.data
      }).catch(error => {
        console.log(error)
        if (error !== 'error') {
          that.$message({type: 'error', message: '文章分类加载失败', showClose: true})
        }
      })

      getAllTags().then(data => {
        that.tags = data.data
      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '标签加载失败', showClose: true})
        }
      })

    },
    editorToolBarToFixed() {
      //去编辑器的源码里找工具栏的div
      // let toolbar = document.querySelector('.v-note-op');
      let toolbar = document.querySelector('.v-md-editor__toolbar');
      let curHeight = document.documentElement.scrollTop || document.body.scrollTop;
      if (curHeight >= 460) {
        document.getElementById("placeholder").style.display = "block"; //bad  用计算属性较好
        toolbar.classList.add("me-write-toolbar-fixed");
      } else {
        document.getElementById("placeholder").style.display = "none";
        toolbar.classList.remove("me-write-toolbar-fixed");
      }
    }
  },
  //组件内的守卫 调整body的背景色，结果是跳出后背景会变灰
  // beforeRouteEnter(to, from, next) {
  //   window.document.body.style.backgroundColor = '#fff';
  //   next();
  // },
  // beforeRouteLeave(to, from, next) {
  //   window.document.body.style.backgroundColor = '#f5f5f5';
  //   next();
  // }
}
</script>

<style >
  .v-md-editor {
    min-height: 400px;
  }
  .write {
    border-left: 100px;

  }
  .el-header {
    position: fixed;
    z-index: 1024;
    min-width: 100%;
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
  }

  .me-write-info {
    line-height: 60px;
    font-size: 18px;
    font-weight: 600;
  }

  .me-write-btn {
    margin-top: 10px;
  }

  .me-write-box {
    max-width: 1200px;
    margin: 20px ;
  }

  .me-write-main {
    padding: 0;
  }

  .me-write-title {
  }

  .me-write-input textarea {
    font-size: 32px;
    font-weight: 600;
    height: 20px;
    border: none;
  }

  .me-write-editor {
    min-height: 700px !important;
    max-height: 1200px;
    overflow:visible;
    height:600px;
  }


  .me-header-left {
    margin-top: 10px;
  }

  .me-title img {
    max-height: 2.4rem;
    max-width: 100%;
  }

  .me-write-toolbar-fixed {
    position: fixed;
    width: 1200px !important;
    top: 60px;
    z-index:999;
    background-color: white;
  }

  .v-note-op {
    box-shadow: none !important;
  }

  .md-toolbar {
    box-shadow: none !important;
  }

  .auto-textarea-input, .auto-textarea-block {
    font-size: 18px !important;
  }
</style>
