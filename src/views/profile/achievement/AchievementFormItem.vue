<template>
  <div>
    <h4>
      <span v-if="index != undefined">
        成果{{index + 1}}：
      </span>
      <el-button type="danger" size="small" @click="deleteAchievement">
        删除
      </el-button>
    </h4>

    <el-form-item
      label="标题"
      :prop="'achievements.'+index+'.properties.title'"
      :rules="{required: true, message: '不能为空', trigger: 'blur'}"
    >
      <el-input v-model="achieve.properties.title"/>
    </el-form-item>

    <el-form-item label="领域" :prop="'achievements.'+index+'.domains'">
      <el-checkbox-group v-model="this.tmp_domains" @change='changeDomains'>
        <el-checkbox
          v-for="d in this.$store.state.graph.domains"
          :key="d"
          :label="d.id"
          name="Domains"
        >
          {{d.properties.name}}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      label="摘要"
      :prop="'achievements.'+index+'.properties.summary'"
    >
      <el-input type="textarea" :rows="3" v-model="achieve.properties.summary"/>
    </el-form-item>

    <el-form-item
      label="链接"
      :prop="'achievements.'+index+'.properties.link'"
    >
      <el-input v-model="achieve.properties.link"/>
    </el-form-item>

    <el-form-item
      label="备注"
      :prop="'achievements.'+index+'.properties.note'"
    >
      <el-input v-model="achieve.properties.note"/>
    </el-form-item>

    <el-form-item
      label="完成时间"
      :prop="'achievements.'+index+'.properties.time'"
    >
      <!-- <date-picker :time="achieve.properties.time"/> -->
      <el-date-picker type="date" v-model="achieve.properties.time"/>
    </el-form-item>

    <el-form-item label="添加图片" :prop="'achievements.'+index+'.imgs'">
      <!-- remove-image什么也不做 -->
      <upload-image @add-image="addImage" @remove-image="function(){}"/>

      <!-- 这里控制image的移除 -->
      <image-with-delete
        v-for="(img, index) in achieve.imgs"
        :src="img.properties.url"
        :index="index"
        :key="index"
        @on-remove="removeImage(index)"
      />
    </el-form-item>

    <el-form-item
      label="添加视频"
      :prop="'achievements.'+index+'.videos'"
    >
      <upload-video @add-video="addVideo" @remove-video="function(){}"/>

      <video-with-delete
        v-for="(video, index) in achieve.videos"
        type="video"
        :src="video.properties.url"
        :index="index"
        :key="index"
        @on-remove="removeVideo(index)"
      />
    </el-form-item>
  </div>
</template>

<script>
import { defineComponent, watch, reactive, onMounted } from 'vue'

import UploadVideo from '@/components/upload/UploadVideo.vue'
import UploadImage from '@/components/upload/UploadImage.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import ImageWithDelete from '@/components/common/ImageWithDelete.vue'
import VideoWithDelete from '@/components/common/VideoWIthDelete.vue'
import {getAllDomains, removeDomain} from '@/api/graph'

export default defineComponent({
  name: 'AchievementFormItem',
  components: {
    ImageWithDelete,
    UploadVideo,
    UploadImage,
    VideoWithDelete,
    DatePicker,
  },
  props: {
    index: {
      type: Number,
      required: false,
    },
    achieve: {
      type: Object,
      required: true,
    }
  },
  emits: ['deleteAchievement', 'add-image', 'add-video', 'remove-video', 'change-domains'],
  data(){
    return {
      domains: [],
      tmp_domains: [],
    }
  },
  watch: {
    achieve: { //更新tmp_domains的值，但是改其它地方也会检测到，因为外头的el-form绑定了整个achievementForm
      handler(oldval, newval){
        console.log('in formitem, newval:', newval)
        if(newval === undefined) //不知道为什么还可能是undefined
          return
        //如果是在changeDomains里引发的，就不要再更新tmp_domains了
        if(this.tmp_domains === newval.domains){ //如果没有这个，那tmp_domains会更新，又会触发change，造成循环
            console.log('==============================')
            return
        }
        // console.log('in formitem, newval=', newval)
        this.tmp_domains = newval.ori_domains.slice() //当外部更新时，更新domains到tmp_domains里去
      },
      deep: true,
      immediate: true, //第一次传过来时也要监听就要设置immediate
    },
  },
  async created(){
    // const data = await getAllDomains()
    // this.domains = data.data
  },
  mounted(){ //不知道为什么第一次传过来在watch里好像还是没监听到，所以这里手动复制
    console.log('achieve:', this.achieve)
    this.tmp_domains = this.achieve.ori_domains.slice()
  },
//   beforeUpdate(){
//     console.group('beforeUpdate 更新前状态===============》');
//     console.log('before update, achieve', this.achieve)
//   },
  methods: {
    changeDomains(newDomains) { //domain改变时，改变外部的
      console.log('newDomain:', newDomains)
      console.log(this.tmp_domains)
      // context.emit('change-domains', props.index, newDomains)
      this.achieve.domains = newDomains //直接修改achieve.domains
    }
  },
  setup(props, context) {
    const deleteAchievement = () => {
      context.emit('deleteAchievement', props.index)
    }

    const addImage = (url) => {
      context.emit('add-image', props.index, url)
    }

    const removeImage = (img_idx) => {
      context.emit('remove-image', props.index, img_idx)
    }

    const addVideo = (url) => {
      context.emit('add-video', props.index, url)
    }

    const removeVideo = (video_idx) => {
      context.emit('remove-video', props.index, video_idx)
    }

    return {
      deleteAchievement,
      addImage,
      removeImage,
      addVideo,
      removeVideo,
    }
  },

})
</script>
