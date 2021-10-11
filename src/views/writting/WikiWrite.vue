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
                placeholder="请输入内容">
              </el-input>
            </el-form-item>

            <!-- 选择category和专栏，只能单选 -->
            <el-form-item label="专栏" prop="column">
              <el-select v-model="articleForm.specialColumn" value-key="id" placeholder="请选择专栏">
                <el-option v-for="c in columns" :key="c.id" :label="c.columnName" :value="c"></el-option>
              </el-select>
            </el-form-item>

            <!-- 选择tag，checkbox-group，可以多选 -->
            <el-form-item label="标签" prop="tags">
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
import {publishArticle, deleteArticleById, getArticleById} from '@/api/article'
import {getAllCategories} from '@/api/category'
import {getAllTags} from '@/api/tag'
import { ElMessage} from 'element-plus'
import {getWritableColumns} from '@/api/column'

export default {
  name: 'WikiWrite',
  components: {
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
      },
      rules: {
        summary: [
          {required: true, message: '请输入摘要', trigger: 'blur'},
          {max: 500, message: '不能大于500个字符', trigger: 'blur'}
        ],
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
      this.$confirm('确认永久删除该内容?', '提示', {
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
    setArticle(article) { //获取文章
      let that = this
      Object.assign(that.articleForm, article)
      let tags = this.articleForm.tags.map(function (item) {
        return item.id;
      })
      this.articleForm.tags = tags
    },
    publish(articleForm) { //点击发布

      if (!this.articleForm.title) {
        this.$message({message: '标题不能为空', type: 'warning', showClose: true})
        return
      }

      if (this.articleForm.title.length > 40) {
        this.$message({message: '标题不能大于40个字符', type: 'warning', showClose: true})
        return
      }

      let that = this

      this.$refs[articleForm].validate((valid) => {
        if (valid) {

          let tags = this.articleForm.tags.map(function (item) {
            return {id: item};
          });

          //专栏文章的私密性随专栏，专栏是私密的则里面所有文章都是私密的
          let open = this.articleForm.specialColumn.id > 0 ? this.articleForm.specialColumn.open : this.articleForm.open

          let article = { //article的信息
            id: this.articleForm.id,
            title: this.articleForm.title,
            summary: this.articleForm.summary,
            tags: tags,
            open: open,
            state: 1,
            specialColumn: this.articleForm.specialColumn,
            updateTime: new Date(),
          }

          let loading = this.$loading({
            lock: true,
            text: '发布中，请稍后...'
          })

          publishArticle(article).then((data) => { //发布给后端
            loading.close();
            that.$message({message: '发布成功！', type: 'success', showClose: true})
            that.$router.back()

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
      this.$confirm('内容将不会保存, 是否继续?', '提示', {
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
          that.$message({type: 'error', message: '分类加载失败', showClose: true})
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
  },
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
    top: 60px; /**60是因为nav高度是60 */
    z-index:999;
    background-color: white;
  }

  .v-note-op {
    box-shadow: none !important;
  }

  .placeholder{
    visibility: hidden;
    height: 41px; /**应该是toolbar的高度 */
    display: none;
  }

  .md-toolbar {
    box-shadow: none !important;
  }

  .auto-textarea-input, .auto-textarea-block {
    font-size: 18px !important;
  }
</style>
