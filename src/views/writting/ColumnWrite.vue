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
              v-model="columnForm.columnName"
              placeholder="请输入名称"
              class="me-write-input">
            </el-input>

          </div>

          <el-form :model="columnForm" ref="columnForm" :rules="rules">
            <el-form-item prop="description">
              <!-- 摘要 -->
              <el-input
                type="textarea"
                v-model="columnForm.description"
                :rows="3"
                placeholder="请输入一段描述">
              </el-input>
            </el-form-item>

            <!-- 上传封面 -->
            <el-form-item>
              <upload-cover :cover='columnForm.cover' @setCover="setCover"/>
            </el-form-item>

            <!-- 选择tag，checkbox-group，可以多选 -->
            <el-form-item label="标签" prop="tags">
              <el-checkbox-group v-model="columnForm.tags">
                <el-checkbox v-for="t in tags" :key="t.id" :label="t.id" name="tags">{{t.tagName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item prop='public'>
              <span style='padding-right:5px'>公开</span>
              <el-switch
                v-model="columnForm.open"
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
                  <el-button type="primary" @click="publish('columnForm')">确 认</el-button>
                </el-col>
                <!-- 如果是更新阶段，显示删除按钮 -->
                <el-col v-if='columnForm.id' :span="8" :offset="7">
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
import {getColumnById, getColumnsByAuthor, deleteColumnById, publishColumn} from '@/api/column'
import {getAllTags} from '@/api/tag'
import { ElMessage } from 'element-plus'
import UploadCover from '@/components/upload/UploadCover.vue';

export default {
  name: 'AddColumn',
  components: {
    MarkdownEditor,
    UploadCover
  },
  async created() {
    console.log('mounted column')
    let user_id = this.$store.state.user.id
    let column_id = this.$route.params.id
    if(!user_id){
      ElMessage({
        type: 'error',
        message: '请先登录',
      })
      this.$router.push(column_id ? `/column/${column_id}` : '/')

      return;
    }
    await this.$store.dispatch('getUserInfo')
      .catch(()=>{
        ElMessage({
          type: 'error',
          message: '获取信息失败，请重新登录',
          showClose: true,
        })
        this.$router.push(column_id ? `/column/${column_id}` : '/')
      })

    console.log(user_id)
    if(column_id){ //如果url里有id，就获取信息
      let column = await getColumnById(column_id)
      this.setColumn(column.data)
    }
    this.getTags() //获取tag和类别
  },
  data() {
    return {
      categories: [],
      tags: [],
      columnForm: {
        id: '',
        columnName: '',
        description: '',
        tags: [],
        open: true,
        cover: '',
      },
      rules: {
        description: [
          {required: true, message: '请输入描述', trigger: 'blur'},
          {max: 500, message: '不能大于500个字符', trigger: 'blur'}
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
    del(){
      this.$confirm('确认删除?文章将会保留', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteColumnById(this.columnForm.id)
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
      this.columnForm.cover = coverUrl
      console.log('cover:', this.columnForm.cover)
    },
    setColumn(column) { //获取文章
      let that = this
      Object.assign(that.columnForm, column)
      console.log('form:', that.columnForm)
      let tags = this.columnForm.tags.map(function (item) {
        return item.id;
      })
      this.columnForm.tags = tags
    },
    publish(columnForm) { //点击发布

      if (!this.columnForm.columnName) {
        this.$message({message: '标题不能为空', type: 'warning', showClose: true})
        return
      }

      if (this.columnForm.columnName.length > 100) {
        this.$message({message: '标题不能大于100个字符', type: 'warning', showClose: true})
        return
      }

      let that = this

      this.$refs[columnForm].validate((valid) => {
        if (valid) {
          let tags = this.columnForm.tags.map(function (item) {
            return {id: item};
          });
          let column = { //column的信息
            id: this.columnForm.id,
            columnName: this.columnForm.columnName,
            description: this.columnForm.description,
            tags: tags,
            cover: this.columnForm.cover,
            open: this.columnForm.open,
            createDate: new Date(),
          }
          console.log(column)

          let loading = this.$loading({
            lock: true,
            text: '发布中，请稍后...'
          })

          publishColumn(column).then((data) => { //发布给后端
            loading.close();
            that.$message({message: '操作成功！', type: 'success', showClose: true})
            that.$router.push({path: `/column/${data.data.columnId}`})

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
    getTags() { //加载分类标签
      console.log('in get')
      let that = this

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
