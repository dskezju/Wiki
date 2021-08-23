import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import Articles from '@/views/articles/Articles.vue'
import {getToken, setToken} from '@/request/token'
import {store} from '@/store'
import {ElMessage} from 'element-plus'
import {VUE_APP_LOGIN_URL, VUE_APP_BACK_URL} from '@/utils/constants'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/hello',
    component: () => import('@/views/HelloWorld.vue')
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue')
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/articles',
    children: [
      {
        path: "home",
        name: "Home",
        component: Home,
      },
      {
        path: "articles",
        name: "articles",
        // route level code-splitting
        // this generates a separate chunk (articles.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Articles,
        //  () =>
        //   import(/* webpackChunkName: "articles" */ "@/views/Articles.vue")
      },
      {
        path: "archives",
        name: "archives",
        component: () =>
          import(/* webpackChunkName: "archive" */ "@/views/Archives.vue")
      },
      {
        path: 'archive/:year/:month',
        name: 'archiveDetail',
        component: () => import('@/views/ArchiveDetail.vue')
      },
      {
        path: "timeline",
        name: "timeline",
        component: () =>
          import(/* webpackChunkName: "timeline" */ "@/views/Timeline.vue")
      },
      {
        path: "column",
        name: "column",
        component: () =>
          import(/* webpackChunkName: "project" */ "@/views/Column.vue")
      },
      {
        path: "view/:id",
        name: "viewArticle",
        component: () =>
          import(/* webpackChunkName: "articleDetail" */ "@/views/articles/ArticleDetail.vue")
      },
      {
        path: ':type/:id',
        name: 'type',
        component: () => import('@/views/CategorizedArticles.vue')
      },
      {
        path: 'edit/article/:id',
        name: 'edit',
        component: () => import('@/views/BlogWrite.vue')
      },
      {
        path: 'edit/column/:id',
        name: 'editColumn',
        component: () => import('@/views/ColumnWrite.vue')
      },
      {
        path: 'profile/:id',
        name: 'profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: 'write',
        name: 'write',
        component: () => import('@/views/Write.vue')
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404.vue')
  },

];

//很奇怪有这个可以运行但打包会失败
// console.log('process.env:', process.env);

const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL),
    history: createWebHistory(process.env.BASE_URL), //代替原本的mode: history
    routes,
});


const handleAuthError = (next) => {
  ElMessage({
    type: 'error',
    showClose: true,
    message: '验证失败'
  })
  store.dispatch('fedLogOut').catch((err)=>{
    console.log(err)
  })
}

router.beforeEach(async (to, from, next) => { //权限控制

  console.log('in beforeEach, to:', to)
  console.log('from:', from)
  console.log('process.env:', process.env)

  if(to.path == '/login'){ //是去/login的
    if(getToken()){ //已经有登录token了，不能去

    }
    else if(to.query.loginToken){ //从外部携带token过来的，就重新获取用户信息，以防外部身份更换
      console.log('loginToken:', to.query.loginToken)
      setToken(to.query.loginToken as string) //token保存
      store.commit('SET_TOKEN', to.query.loginToken)

      await store.dispatch('getUserInfo') //验证token，获取用户信息
            .catch(() => { //验证失败，删除token等一切个人信息
              handleAuthError(next)
            })
    }
    next({path: '/'}) //最后都重定向到/
  }
  else if (getToken()) { //不是去login的，如果有登录token
    console.log('token:', getToken())
    if (store.state.user.account.length === 0) { //如果没有account信息
      await store.dispatch('getUserInfo') //向后台获取用户信息
            .catch(() => {
              handleAuthError(next)
            }) //验证失败
    }
    next() //不管有没有获取到都跳转
  }
  else { //没有token，直接进入网，如果没有.catch，name由getUserInfo里reject的话就会直接在console上报错
    await store.dispatch('getUserInfo').catch(err => console.log(err))
    //而这后面的代码哪怕前面失败了，在处理完catch后依旧会执行
    console.log('in beforeeach, user:', store.state.user)
    next()
  }
})


export default router
