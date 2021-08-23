import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from '@/store'
import router from "./router";
import mixin from "./mixins";
import '@/assets/icon/iconfont.css' //引入图标
import lodash from 'lodash'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'


const app = createApp(App) //相当于原来的new Vue({})
app.use(ElementPlus)


import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

// Prism
// import Prism from 'prismjs';
// // highlight code
// import 'prismjs/components/prism-json';
// import 'prismjs/themes/prism.css'

import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index';
import '@kangc/v-md-editor/lib/plugins/tip/tip.css';
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-dark.css'

VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

// VMdEditor.use(vuepressTheme, {
//   Prism,
// });

VMdEditor.use(createHighlightLinesPlugin());
VMdEditor.use(createTipPlugin());

VMdEditor.use(createEmojiPlugin());
VMdEditor.use(createKatexPlugin());
VMdEditor.use(createTodoListPlugin());
VMdEditor.use(createLineNumbertPlugin());
VMdEditor.use(createCopyCodePlugin());
VMdEditor.use(createAlignPlugin());

app.use(VMdEditor);


//全局属性配置，每个component都会有，相当于Vue.prototype.
// app.config.globalProperties.$message = ElMessage;
// app.config.globalProperties.$loading = ElLoading.service;
app.config.globalProperties.$_ = lodash
// app.config.globalProperties.productionTip = false;
// app.config.globalProperties.$https = service;
// app.config.globalProperties.$urls = urls;

//安装store和router，代替了vue.use(Vuex/VueRouter)？
app.use(store, key)
app.use(router)
app.mount('#app');
