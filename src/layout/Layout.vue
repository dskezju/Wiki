<template>
  <div class="container">
    <!-- <sakula/> -->
    <Nav/>
    <div class="layout">
      <router-view />
      <!-- 作者介绍信息，根据导航路径和是否移动端控制显示 -->
      <CustomSlider v-if="state.isShowSlider"></CustomSlider>
    </div>
    <ArrowUp></ArrowUp>
    <Footer v-if="state.isShowNav"></Footer>
  </div>
</template>

<script lang="ts">
import Sakula from '@/views/Sakula.vue'
import { defineComponent, defineAsyncComponent, reactive, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { isMobileOrPc } from "@/utils/utils";

// 移动端 rem 单位适配
if (isMobileOrPc()) {
  // width * 100 / 750 = width / 7.5
  // 1rem = 100px
  var width = window.screen.width;
  window.document.getElementsByTagName("html")[0].style.fontSize =
    width / 7.5 + "px";
}

export default defineComponent({
  name: "App",
  data(){
    return {
      value: '',
    }
  },
  components: {
    Nav: defineAsyncComponent(() => import("@/layout/Nav.vue")), //vue3中声明异步组件
    CustomSlider: defineAsyncComponent(
      () => import("@/layout/CustomSlider.vue")
    ),
    Footer: defineAsyncComponent(() => import("@/layout/Footer.vue")),
    ArrowUp: defineAsyncComponent(() => import("@/layout/ArrowUp.vue")),
    Sakula,
  },
  watch: {
    $route: function (val: any, oldVal: any) {
      this.routeChange(val, oldVal);
    },
  },
  setup() {
    const state = reactive({
      isShowNav: false,
      isShowSlider: false,
    });

    // const router = useRouter();
    const route = useRoute();

    const routeChange = (val: any, oldVal: any): void => {
      const referrer: any = document.getElementById("referrer");
      if (val.path === "/") { //主页不显示导航栏
        state.isShowNav = false;
        referrer.setAttribute("content", "always");
      } else {
        state.isShowNav = true;
        referrer.setAttribute("content", "never");
      }
      const navs = [ //在这些导航里显示个人介绍slider
        "/articles",
        "/archive",
        "/column",
        "/timeline",
        '/profile',
      ];
      if (navs.find(nav => val.path.startsWith(nav))) {
        state.isShowSlider = true;
      } else {
        state.isShowSlider = false;
      }
      if (isMobileOrPc()) {
        state.isShowSlider = false;
      }
    };

    onMounted(() => {
        routeChange(route, route);
    })

    return {
      state,
      routeChange,
    };
  },
});
</script>

<style lang="less">
// @import url("./less/monokai_sublime.less"); //highlight的自定义样式，是用marked渲染后再用它高亮
@import url("@/less/index.less");
@import url("@/less/mobile.less");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  // width: 1200px;
  padding-top: 31px;
}
img {
  vertical-align: bottom;
}
</style>
