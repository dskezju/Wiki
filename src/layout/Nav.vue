<template>
  <div>
    <!-- 如果当前不是在Mobile设备上 -->
    <div v-if="!state.isMobile" class="nav">
      <div class="nav-content">
        <el-row :gutter="24">
          <el-col :span="2">
            <!-- logo，指向首页 -->
            <logo/>
          </el-col>
          <el-col :span="18">
            <!-- :router为true表示启用vue-router，以index作为path进行跳转 -->
            <el-menu
              :router="true"
              :default-active="state.activeIndex"
              active-text-color="#409eff"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <!-- 遍历list里所有导航，显示名称，route为路径对象 -->
              <el-menuItem
                v-for="l in state.list"
                :route="l.path"
                :index="l.index"
                :key="l.index"
              >
                {{l.name}}
              </el-menuItem>

              <el-col :span="4" :offset="4">
                <el-menu-item @click='clickWrite'>
                  <i class="el-icon-edit"></i>
                  创作
                </el-menu-item>
              </el-col>

              <el-col v-if="userInfo.id" :span="4" :offset="3">
                <el-menu-item :index="'/profile/'+userInfo.id">
                  <i class="el-icon-s-custom"></i>
                  个人中心
                </el-menu-item>
              </el-col>

            </el-menu>
          </el-col>

          <!-- 如果用户已登录 -->
          <el-col v-if="userInfo.id" :span="2" :offset="0" >
            <div class="nav-right">
              <!-- 头像，样式不会设置就不加了 -->
              <!-- <avatar :src="userInfo.avatar"/> -->

              <el-dropdown @command="handleDropdown">
                <!-- 用户名 -->
                <span class="el-dropdown-link">
                  {{userInfo.name}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <!-- 下拉的登出按钮 -->
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="logout">登 出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

            </div>
          </el-col>

          <!-- 用户没有登录，显示登录和注册 -->
          <el-col v-else :span="4" >
            <div class="nav-right">
              <el-button
                size="small"
                type="primary"
                @click="handleClick('login')"
              >
                登录
              </el-button>
              <el-button
                size="small"
                disabled
                type="danger"
                @click="handleClick('register')"
              >
                注册
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 否则，是在Mobile中显示，则导航折叠到侧边栏中，且点击右上角才显示 -->
    <div v-else class="nav" >
      <div class="nav-mobile">
        <!-- logo -->
        <div class="nav-mobile-logo">
          <logo/>
        </div>

        <div class="title">{{state.title}}</div>

        <!-- 点击显示导航栏 -->
        <div class="menu" @click="handleMenu" >
          <i class="el-icon-menu"></i>
        </div>
      </div>

      <!-- 显示导航栏，没用el-menu，而是自己做了一个，统一用handleClickMenu -->
      <div
        v-if="state.isShow"
        class="nav-mobile-content"
        :class="{'enter-slideUp': state.enterSlideUp,'leave-slideDown': state.leaveSlideDown}"
      >
        <div class="list">
          <div
            @click="handleClickMenu('')"
            class="item"
          >
            <router-link to="/">首 页</router-link>
          </div>
          <div
            @click="handleClickMenu('/articles')"
            class="item"
          >
            <router-link to="/articles">文 章</router-link>
          </div>
          <div
            @click="handleClickMenu('/archives')"
            class="item"
          >
            <router-link to="/archives">归 档</router-link>
          </div>
          <div
            @click="handleClickMenu('/project')"
            class="item"
          >
            <router-link to="/project">项 目</router-link>
          </div>
          <div
            @click="handleClickMenu('/timeline')"
            class="item"
          >
            <router-link to="/timeline">历 程</router-link>
          </div>
          <!-- 判断用户是否已登录 -->
          <div
            @click="handleClickMenu('/login')"
            class="item"
          >
            <span v-if="userInfo.id">{{ userInfo.name }}</span>
            <span v-else>登 录</span>
          </div>
          <div
            v-if="userInfo.id"
            @click="handleClickMenu('/logout')"
            class="item"
          >
            登 出
          </div>
        </div>
      </div>
    </div>

    <!-- 这个div没有内容，但width和height都是100%，即为任意空白 -->
    <div
      v-if="state.isShow"
      class="mask"
      :class="{'mask-fade-out': state.leaveSlideDown}"
      @click="handleHideMenu"
    ></div>

    <!-- 登录和注册不跳转，直接在本页面显示 -->
    <RegisterAndLogin
      :visible="state.visible"
      :isMobile="state.isMobile"
      :handleFlag="state.handleFlag"
      @ok="handleOk"
      @cancel="handleCancel"
    ></RegisterAndLogin>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import { key } from "@/store";
import { isMobileOrPc, getQueryStringByName } from "@/utils/utils";
import { UserInfo, NavListItem } from "@/types/index";
import {getUserInfo} from '@/api/login'

export default defineComponent({
  name: "Nav",
  components: {
    RegisterAndLogin: defineAsyncComponent(
      () => import("@/components/RegisterAndLogin.vue")
    ),
    Logo: defineAsyncComponent(
      () => import("@/components/Logo.vue")
    ),
    Avatar: defineAsyncComponent(
      () => import('@/components/Avatar.vue')
    )
  },
  computed: {
    userInfo(): UserInfo {
      let user: any = this.$store.state.user
      console.log('user:', user)
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        account: user.account,
      };
    },
  },
  methods: {

  },
  watch: {
    $route: {
      handler(val: any, oldVal: any) {
        this.routeChange(val, oldVal); //改变选中的导航的样式和Mobile中的网页标题
      },
      immediate: true,
    },
    '$store.state.user': {
      handler(newval){
        console.log('new user:', newval)
      },
      deep: true,
    },
  },
  mounted() {
    this.routeChange(this.$route, this.$route);
    this.getUser(); //获取用户信息
  },
  setup(props, context) {
    const store = useStore(key);
    const router = useRouter();
    const state = reactive({
      visible: false, //是否显示登录或注册部分
      handleFlag: "", //处理的是登录还是注册
      title: "首页",
      list: [
        {
          index: "1",
          path: "/",
          name: "首页",
        },
        {
          index: "2",
          path: "/articles",
          name: "文章",
        },
        {
          index: "3",
          path: "/archives",
          name: "归档",
        },
        {
          index: "4",
          path: "/column",
          name: "专栏",
        },
        {
          index: "5",
          path: "/timeline",
          name: "历程",
        },
      ] as Array<NavListItem>,
      activeIndex: "0", //活跃导航
      enterSlideUp: false, //Mobile模式的导航栏的开启与关闭时的样式控制
      leaveSlideDown: false,
      isShow: false, //Mobile模式的显示导航栏
      isMobile: isMobileOrPc(), //是否是Mobile
    });

    //改变选中的导航的样式和Mobile中的网页标题
    const routeChange = (val: any, oldVal: any) => {
      let flag = 0
      for (let i = 0; i < state.list.length; i++) {
        const l: NavListItem = state.list[i];
        if (l.path === val.path) {
          state.activeIndex = i + 1 + "";
          state.title = l.name;
          flag = 1
          break;
        }
      }
      if(!flag){
        state.activeIndex = -1 + ''
      }
    };

    //选择导航时调用
    const handleSelect = (val: string, oldVal: string): void => {
      state.activeIndex = val; //改变activeIndex
    };

    //登录和注册组件的OK和Cancel
    const handleOk = (value: boolean): void => {
      state.visible = value;
      // location.reload() //刷新窗口，因为实在子组件里更新的user，没有在这里watch到？
    };

    const handleCancel = (value: boolean): void => {
      state.visible = value;
    };

    //点击登录或注册时，显示相应部分
    const handleClick = (value: string): void => {
      state.handleFlag = value;
      state.visible = true;
    };

    //登出
    const handleLogout = (): void => {
      store.dispatch("logout").then(()=>{
          ElMessage({
            type: 'success',
            message: 'logout success!',
            showClose: true,
          })
        });
    }

    const handleDropdown = (command): void => {
      console.log(command)
      if(command == 'logout'){
        handleLogout()
      }
    };

    //处理Mobile时的导航栏按钮，包括登录注册等
    const handleClickMenu = (route?: string): void => {
      state.isShow = false;
      if (route === "/login") {
        state.handleFlag = "login";
        state.visible = true;
      }
      if (route === "/logout") {
        handleLogout();
      }
    };

    const handleMenu = (): void => {
      state.isShow = true;
      state.enterSlideUp = true;
    };

    const clickWrite = (): void => {
      if(store.state.user.id > 0){
        router.push('/write')
      }
      else{
        ElMessage({
          type: 'error',
          message: '请先登录',
          showClose: true,
        })
      }
    }

    //获取用户
    const getUser = async (): Promise<void> => {
      const loading: any = ElLoading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)",
      });
      getUserInfo() //如果加await，name失败的时候就永远无法进入下面的代码
      loading.close();

      // let preventHistory = JSON.parse(window.sessionStorage.preventHistory);
      // if (preventHistory) {
      //   router.push({
      //     path: preventHistory.name,
      //     query: preventHistory.query,
      //   });
      // }
    };

    //Mobile时的点击任意空白隐藏导航栏
    const handleHideMenu = (): void => {
      state.enterSlideUp = false;
      state.leaveSlideDown = true;
      setTimeout(() => {
        state.leaveSlideDown = false;
        state.isShow = false;
      }, 300);
    };

    return {
      state,
      handleCancel,
      handleOk,
      handleClick,
      handleLogout,
      handleClickMenu,
      handleMenu,
      getUser,
      handleSelect,
      routeChange,
      handleHideMenu,
      handleDropdown,
      clickWrite,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.nav-mobile {
  display: flex;
  line-height: 60px;
  .nav-mobile-logo {
    flex: 1;
    margin-top: 5px;
    margin-left: 10px;
  }
  .title {
    flex: 3;
    font-size: 24px;
  }
  .menu {
    flex: 1;
    font-size: 34px;
    color: #409eff;
  }
}
.nav-mobile-content {
  font-size: 0.3rem;
  height: 7.3rem;
  width: 100%;
  background-color: #fff;
  .list {
    .item {
      line-height: 0.8rem;
      color: #303133;
      border-bottom: 1px solid #eee;
      a {
        display: block;
        width: 100%;
        color: #409eff;
        text-decoration-line: none;
      }
    }
  }
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  .nav-content {
    width: 1200px;
    margin: 0 auto;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .el-menu--horizontal > .el-menu-item {
    cursor: pointer;
    color: #333;
  }
  .nav-right {
    position: relative;
    padding-top: 15px;
    text-align: right;
    .el-dropdown {
      cursor: pointer;
      padding-right: 60px;
    }
    .user-img {
      position: absolute;
      top: -15px;
      right: 0;
      width: 50px;
      border-radius: 50%;
    }
    .avatar { //覆盖默认样式
      top: 6px;
      width: 45px;
      height: 45px;
      border: 1px solid #ddd;
      border-radius: 50%;
      vertical-align: middle;
      display: inline-block;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}

.enter-slideUp,
.leave-slideDown {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1010;
}

.enter-slideUp {
  overflow: auto;
  visibility: visible;
  z-index: 1001;
  animation: slideUp 0.3s forwards;
}
.leave-slideDown {
  visibility: visible;
  z-index: 1001;
  animation: slideDown 0.3s forwards;
}
@keyframes slideUp {
  from {
    transform: translate3d(0, 100%, 0);
    opacity: 0.1;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes slideDown {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
}
.mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
}
.mask-fade-out {
  animation: maskFadeOut 0.4s forwards;
}
@keyframes maskFadeOut {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 0;
  }
}
</style>
