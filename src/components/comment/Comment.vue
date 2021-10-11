<template>
  <!-- v-model为true时显示 -->
  <el-dialog
    title="评论"
    width="60%"
    v-model="state.dialogDodel"
    @close="cancel"
  >
    <el-form>
      <el-form-item>
        <el-input
          type="textarea"
          v-model="state.content"
          placeholder="文明社会，理性评论"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" >
      <el-button type="default" @click="cancel" >取消</el-button>
      <el-button type="primary" @click="handleOk" >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, reactive, watch } from "vue";
import { useStore } from 'vuex'
import { key } from '@/store'
import {publishComment} from '@/api/comment'

export default defineComponent({
  name: "Comment",
  props: {
    visible: { //控制是否显示，用于在点击回复时显示
      type: Boolean,
      default: false,
    },
    parent_id: {
      type: String,
      default: "",
    },
    article_id: {
      type: String,
      default: "",
      required: true,
    },
    to_user: {
      // type: any,
      default: {},
    },
  },
  emits: ["ok", "cancel"],
  setup(props, context) {
    const state = reactive({
      dialogDodel: props.visible,
      btnLoading: false,
      content: "",
    });

    const store = useStore(key)

    const cancel = (): boolean => { // ts，返回值为boolean
      context.emit("cancel", false); //点击取消，触发外部的cancel事件，只是隐藏了，内容没有消失
      return false;
    };

    //声明是异步的，且async函数中返回值会被自动调用Promise.resolve()，所以返回的是Promise
    const handleOk = async (): Promise<void> => {
      if (!state.content) {
        ElMessage({
          message: "评论内容不能为空",
          type: "error",
        });
        return;
      }

      //sessionStorage是会话级别的存储，会话结束就销毁
      if (!store.state.user.token) {
        ElMessage({
          message: "登录才能评论，请先登录！",
          type: "warning",
        });
        return;
      }
      state.btnLoading = true;
      //await只能在async中调用，表示等待一个表达式完成，如果等到的是一个Promise
      //就会阻塞后面的代码直到Promise里调用resolve，相当于里面调用resolve(val)，然后将val作为await的返回值，
      //然后执行之后的代码，就不用.then了，如果表达式返回Promise则可以有.catch，代替了原本Promise链式，看上去像同步其实是异步
      //写成Promise应该是 service.post().then(val=>{state.btnLoading=false; ...})
      await publishComment({
        article: {
          id: props.article_id
        },
        parent: {
          id: props.parent_id
        },
        toUser: props.to_user,
        content: state.content,
      });
      //上面的异步操作完成后才执行下面的，相当于原本的.then里面的
      state.btnLoading = false;
      state.content = "";
      context.emit("ok", false); //触发外部的ok事件
      ElMessage({
        message: "操作成功",
        type: "success",
      });
    };

    watch(props, (val, oldVal) => {
      state.dialogDodel = val.visible;
    });

    return {
      state,
      cancel,
      handleOk,
    };
  },
});
</script>
<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
