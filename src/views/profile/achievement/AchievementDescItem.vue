<template>
  <div>
    <el-card shadow="hover">
      <div class="me-author-description">
        <el-descriptions
          :title="'成果'+parseInt(index+1)"
          :column="1"
          size="medium"
        >

          <template v-if='showChangeBtn' #extra>
            <el-button type="danger" size="small" @click="delSkill">
              删除
            </el-button>
            <el-button type="primary" size="small" @click="clickChange">
              更改
            </el-button>
          </template>

          <el-descriptions-item>
            <template #label>
              标题
            </template>
            {{achieve.properties.title}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              摘要
            </template>
              {{achieve.properties.summary}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              链接
            </template>
            <a :href='achieve.properties.link'>
              {{achieve.properties.link}}
            </a>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              备注
            </template>
            {{achieve.properties.note}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              完成时间
            </template>
            {{achieve.properties.time}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              图片/视频
            </template>
            <el-image
              v-for='(img, index) in achieve.imgs'
              class="image"
              :src="img.properties.url"
              fit="cover"
              :preview-src-list="preview(index)"
              :key="index"
            >
            </el-image>

            <div>
            <video-with-delete
              v-for="(video, index) in achieve.videos"
              type="video"
              :src="video.properties.url"
              :index="index"
              :key="index"
              @on-remove="()=>{}"
              :showDel="false"
            />
            </div>

          </el-descriptions-item>

        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script>
import VideoWithDelete from '@/components/common/VideoWIthDelete.vue'

export default {
  name: 'AchievementDescItem',
  components: {
    VideoWithDelete,
  },
  props: {
    showChangeBtn:{
      default: true,
    },
    achieve: {
      type: Object,
      required: true,
    },
    index: {
      required: true,
    },
  },
  emits: ['change-mode', 'del-achievement'],
  data(){
    return {
    }
  },
  methods: {
    clickChange(){
      this.$emit('change-mode')
    },
    preview(index){ //把所有图片放进去就行了，点击谁还是显示谁
      let srcList = []
      for(let i in this.achieve.imgs){
        srcList.push(this.achieve.imgs[i].properties.url)
      }
      // console.log(srcList)
      return srcList
    },
    delSkill(){
      this.$confirm('确认永久删除该内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      this.$emit('del-achievement', this.index)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }

  }
}
</script>

<style scoped>
.image {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
</style>
