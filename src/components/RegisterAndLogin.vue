<template>
  <div style="background:'white';">
    <el-dialog
      title="登录"
      :width="isMobile ? '90%' : '40%'"
      v-model="state.dialogModel"
      @close="cancel"
      :show-close="true"
      class='dialog'
    >
      <!-- 登录的表单部分 -->
      <el-form
        ref='form'
        :model="state.params"
        :rules="state.rules"
      >
        <el-formItem
          label="用户名"
          prop="account"
          :label-width="state.formLabelWidth"
        >
          <el-input
            v-model="state.params.account"
            placeholder="用户名"
            autocomplete="off"
          >
          </el-input>
        </el-formItem>
        <el-formItem
          label="密码"
          prop="password"
          :label-width="state.formLabelWidth"
        >
          <el-input
            type="password"
            placeholder="密码"
            v-model="state.params.password"
            autocomplete="off"
          ></el-input>
        </el-formItem>

        <!-- 根据handleFlag来决定要不要显示注册的表单部分 -->
        <!-- <el-formItem
          v-if="handleFlag === 'register'"
          label="昵称"
          :label-width="state.formLabelWidth"
        >
          <el-input
            v-model="state.params.name"
            placeholder="用户名或昵称"
            autocomplete="off"
          ></el-input>
        </el-formItem>
        <el-formItem
          v-if="handleFlag === 'register'"
          label="手机"
          :label-width="state.formLabelWidth"
        >
          <el-input
            v-model="state.params.phone"
            placeholder="手机号"
            autocomplete="off"
          ></el-input>
        </el-formItem>
        <el-formItem
          v-if="handleFlag === 'register'"
          label="简介"
          :label-width="state.formLabelWidth"
        >
          <el-input
            v-model="state.params.desc"
            placeholder="个人简介"
            autocomplete="off"
          ></el-input>
        </el-formItem> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <!-- <el-button
          type="success"
          @click="handleOAuth"
        >github 授权登录</el-button> -->

        <!-- 根据handleFlag是login还是register显示对应的按钮 -->
        <el-button
          v-if="handleFlag === 'login'"
          :loading="state.btnLoading"
          type="primary"
          @click="submit"
        >登 录</el-button>

        <el-button
          v-if="handleFlag === 'register'"
          :loading="state.btnLoading"
          type="primary"
          @click="submit"
        >注 册</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, ref, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { key } from '../store'
// import config from "../utils/config";
import { RegAndLogParams, UserInfo } from "../types/index";
import {register, login} from '@/api/login'

export default defineComponent({
  name: "RegisterAndLogin",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    handleFlag: {
      type: String,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["ok", "cancel"],
  methods: {
    async submit (): Promise<void> {
      this.$refs.form.validate( async (valid) => {
        if (valid) {
          this.state.btnLoading = true;
          if (this.state.handleFlag === "register") {
            // data = await register(this.state.params);
          }
          else {
            try {
              await this.$store.dispatch('login', this.state.params)
              await this.$store.dispatch('getUserInfo') //login只会setToken
                      .catch(err => console.log(err))
              this.$emit("ok", false);
              ElMessage({
                message: "login success!",
                type: "success",
              });
            }
            catch {
              ElMessage({
                type: 'error',
                message: '登录失败',
              })
            }
            this.state.btnLoading = false;
          }
        }
      })
    },
  },
  setup(props, context) {
    const store = useStore(key);
    const state = reactive({
      dialogModel: props.visible,
      btnLoading: false,
      loading: false,
      formLabelWidth: props.isMobile ? "40px" : "70px",
      params: {
        account: "",
        name: "",
        password: "",
        email: '',
        phone: "",
        desc: "",
      } as any,
      rules: {
        account: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
      }
    });

    const route = useRoute();
    // const handleOAuth = (): void => {
    //   // 保存授权前的页面链接内容
    //   let preventHistory: object = {
    //     name: route.name,
    //     query: route.query,
    //   };
    //   window.sessionStorage.preventHistory = JSON.stringify(preventHistory);
    //   // window.location.href = 'https://github.com/login/oauth/authorize?client_id=6de90ab270aea2bdb01c&redirect_uri=http://biaochenxuying.cn/login'
    //   window.location.href = `${config.oauth_uri}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}`;
    // };

    const form = ref(null) //ref在mounted之前都是null，在setup里的函数里拿到也就是null

    const cancel = (): boolean => {
      context.emit("cancel", false);
      return false;
    };

    watch(props, (val, oldVal) => {
      state.dialogModel = val.visible;
    });

    return {
      state,
      // handleOAuth,
      // submit,
      cancel,
    };
  },
});
</script>
<style scoped>
.dialog-footer {
  text-align: right;
}
.dialog {
  background: white;
}
</style>
