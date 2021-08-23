
<template>
  <div>

    <!-- <el-backtop target=".layout" :bottom="100">
      <div
        style="{
          height: 100%;
          width: 100%;
          background-color: #f2f5f6;
          box-shadow: 0 0 6px rgba(0,0,0, .12);
          text-align: center;
          line-height: 40px;
          color: #1989fa;
        }"
      >
        UP
      </div>
    </el-backtop> -->

    <i
      v-show="state.isShowBtn"
      @click="topFunction"
      class="el-icon-arrow-up"
    ></i>
  </div>
</template>


<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";

export default defineComponent({
  name: "ArrowUp",
  setup() {
    const state = reactive({ //创建响应式数据
      isShowBtn: false,
    });

    onMounted(() => { //在mounted时被调用，代替原本的mounted
      // 当网页向下滑动 20px 出现"返回顶部" 按钮
      window.onscroll = (): void => {
        // console.log('scrolltop:', window.document.body.scrollTop)
        // console.log('top:', window.document.documentElement.scrollTop)
        if (
          window.document.body.scrollTop > 100 ||
          window.document.documentElement.scrollTop > 100
        ) {
          state.isShowBtn = true;
        } else {
          state.isShowBtn = false;
        }
      };
    });

    const topFunction = (): void => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    return {
      state,
      topFunction
    };
  },
});
</script>

<style scoped>
.el-icon-arrow-up {
  position: fixed;
  bottom: 50px;
  right: 40px;
  z-index: 99;
  border: none;
  outline: none;
  background-color: rgb(119, 118, 118);
  cursor: pointer;
  padding: 15px;
  color: white;
  border-radius: 50%;
}

.el-icon-arrow-up:hover {
  background-color: #555;
}
</style>

