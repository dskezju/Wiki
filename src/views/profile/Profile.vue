<template>
  <div class="left clearfix" style='min-height:800px'>

    <card-me/>

    <el-divider/>

    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      tab-position="top"
    >
      <el-tab-pane label="文章" name='1'>
        <article-scroll-page v-bind='state.article'/>
      </el-tab-pane>

      <el-tab-pane label="知识卡片" name='2'>
        <wiki-scroll-page v-bind="state.wiki"/>
      </el-tab-pane>

      <el-tab-pane label="专栏" name='3'>
        <column-page v-bind='state.column'/>
      </el-tab-pane>

      <el-tab-pane label="科研背景" name='4'>

        <show-user-graph :key="state.key"/>

        <el-collapse v-if='$route.params.id==$store.state.user.id' v-model='activeNames'>

          <el-collapse-item title="添加技能" name="1">
            <edit-skill :key="state.key" :form='state.skillForm' @refresh='refresh'/>
          </el-collapse-item>

          <el-collapse-item title="添加成果" name="2">
            <achievement-collect @refresh='refresh'/>
          </el-collapse-item>

          <el-collapse-item title="查看/编辑技能" name="3">
            <!-- key用来强制刷新组件 -->
            <show-skills :key='state.key'/>
          </el-collapse-item>

          <el-collapse-item title="查看/编辑成果" name="4">
            <show-achievements
              :achievements='state.achievements'
              @refresh='refresh'
            />
          </el-collapse-item>

        </el-collapse>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script lang="js">
import {defineComponent, onMounted, reactive} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter,} from 'vue-router'
import {key} from '@/store'
import ArticleScrollPage from '@/views/articles/ArticleScrollPage.vue'
import { ElMessage } from 'element-plus'
import ColumnPage from '@/views/column/ColumnsPage.vue'
import CardMe from '@/components/card/CardMe.vue'
import WikiScrollPage from '@/views/articles/wiki/WikiScrollPage.vue'
import AchievementCollect from '@/views/profile/achievement/AchievementCollect.vue'
import ShowSkills from '@/views/profile/ShowSkills.vue'
import ShowAchievements from '@/views/profile/ShowAchievements.vue'
import {getAchievements} from '@/api/graph'
import EditSkill from '@/views/profile/skill/EditSkill.vue'
import ShowUserGraph from '@/views/profile/ShowUserGraph.vue'

export default defineComponent({
  components: {
    ArticleScrollPage,
    ColumnPage,
    CardMe,
    WikiScrollPage,
    AchievementCollect,
    ShowSkills,
    ShowAchievements,
    EditSkill,
    ShowUserGraph,
  },
  name: 'Profile',
  data(){
    return {
      activeName: '', // tab
      activeNames: ['3', '4'], // collapse item
    }
  },
  async created(){
    if(localStorage.getItem('profile-tab')){ //获取上一次打开的tab
      this.activeName = localStorage.getItem('profile-tab')
    }
    await this.$store.dispatch('getDomains')
    console.log('$store.state.graph.domains:', this.$store.state.graph.domains)
    console.log('domain2name:', this.$store.state.graph.domain2name)
  },
  methods: {
    handleClick(tab){
      console.log(tab.props.name)
      localStorage.setItem('profile-tab', tab.props.name)
    },
  },
  setup(props, context){

    const store = useStore(key)
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      // is_current_user: false, //前端不用判断是不是当前用户了，因为后端会判断哪些数据是属于当前请求的用户的
      article: {
        query: {
          tagId: '',
          categoryId: '',
          authorId: route.params.id,
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
          tagId: '',
          categoryId: '',
          authorId: route.params.id,
        },
        page: { //页面情况及搜索文章限制
          pageSize: 5, //每次获取5篇文章
          pageNumber: 1, //当前的下一页是第几页
          name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
          sort: 'desc', //降序
        },
      },
      column: {
        query: {
          tagId: '',
          authorId: '',
        },
        page: {
          pageSize: 10, //每次获取5篇
          pageNumber: 1, //当前的下一页是第几页
          name: 'a.createDate', //根据创建日期，配合后端使用，因为后端的hql是 from Article a
          sort: 'desc' //降序
        }
      },
      skillForm: {
        id: '',
        label: '',
        achievements: [],
        properties: {
          title: '',
          summary: '',
          link: '',
          note: '',
          time: '', //完成时间
        },
        domains: [],
        ori_domains: [],
      },
      achievements: [],
      key: 0,

    })

    const getPersonalAchievements = async () => {
      const data = await getAchievements(store.state.user.id)
                          .catch(err=>console.log('err:', err))
      console.log(data)
      const achievements = data.data
      if(!achievements)
        return
      achievements.forEach((achieve) => {
        if(achieve.childrenNodes){
          achieve.imgs = achieve.childrenNodes.filter((item) => {
            return item.label == 'image'
          })
          achieve.videos = achieve.childrenNodes.filter((item) => {
            return item.label == 'video'
          })
          achieve.domains = achieve.childrenNodes.filter((item) => {
            return item.label == 'domain'
          })
          // achieve.domains.forEach((item) => item.id) //抽风
          achieve.domains = achieve.domains.map((item) => item.id)

          delete achieve.childrenNodes
        }
        else {
          achieve.imgs = []
          achieve.videos = []
          achieve.domains = []
        }
        achieve.ori_domains = achieve.domains.slice()
        achieve.editMode = false
      })
      achievements.sort(function(a,b){
        console.log(new Date(a.properties.create_time))
        console.log(new Date(b.properties.create_time))
        console.log(new Date(a.properties.create_time)< new Date(b.properties.create_time))
        return new Date(a.properties.create_time)< new Date(b.properties.create_time)})
      console.log('achievements:', achievements)
      state.achievements = achievements
    }

    onMounted(async () => {
      store.dispatch('getUserInfo')
        .then(() => {
          console.log('user:', store.state.user)
          getPersonalAchievements()
        })
        .catch(res => {
          console.log(res)
          ElMessage({
            type: 'warning',
            message: '请先登录',
          })
          router.push('/')
          return;
        })
      return;
    })

    const refresh = () => {
      getPersonalAchievements()
      state.skillForm = {
        id: '',
        label: '',
        achievements: [],
        properties: {
          title: '',
          summary: '',
          link: '',
          note: '',
          time: '', //完成时间
        },
        domains: [],
        ori_domains: [],
      }

      state.key++ //用来强制刷新组件
    }

    return {
      state,
      refresh,
    }
  }
})
</script>
