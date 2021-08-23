<template>
  <div class='div-add-tag'>
    <el-form>
      <el-form-item label="文章类别" prop="tags">
        <el-tag v-for='c in categories' :key='c'>{{c.categoryName}}</el-tag>
      </el-form-item>
    </el-form>
    <el-divider/>

    <!-- 显示动态添加的标签 -->
    <el-tag
      :key="c"
      v-for="c in dynamicCategories"
      closable
      :disable-transitions="false"
      @close="handleClose(c)"
    >
      {{c.categoryName}}
    </el-tag>

    <!-- 一个输入框用来增加标签 -->
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <!-- 点击换成上面的输入框 -->
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增类别</el-button>

    <p style='margin-top:30px'>
      <el-button type="primary" @click='submit'>提交</el-button>
    </p>
  </div>
</template>

<script lang='ts'>
import {getAllCategories, addCategories} from '@/api/category'
import { ElMessage } from 'element-plus';

export default {
  name: 'AddCategory',
  data() {
    return {
      dynamicCategories: [],
      inputVisible: false,
      inputValue: '',
      categories: [],
    };
  },
  emits: ['ok'],
  async created(){ //加载标签
    const data = await getAllCategories().catch(err => {
      ElMessage({ type: 'error', message: '获取类别失败', })
    }) as any
    this.categories = data.data
    console.log(data)
  },
  methods: {
    async submit(){
      //去除重复数据
      const categories = this.dynamicCategories.filter(dynamicCategory => {
        return !this.categories.find(item => item.categoryName == dynamicCategory.categoryName)
      })
      if(categories.length != this.dynamicCategories.length){
        ElMessage({
          type: 'warning',
          message: '存在重复数据！'
        })
      }
      if(categories.length > 0){
        await addCategories(categories)
        ElMessage({
          type: 'success',
          message: '操作成功！',
        })
        this.$emit('ok')
      }

    },
    handleClose(c) { //删除该tag
      this.dynamicCategories.splice(this.dynamicCategories.indexOf(c), 1);
    },

    showInput() { //关闭按钮，显示输入框
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() { //确定增加标签
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicCategories.push({categoryName: inputValue, cover: ''});
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>

<style>
.div-add-tag {
  margin-top: 10px;
}
.el-tag { /**这样从第二个el-tag开始才会生效 */
  margin-right: 10px;
  margin-top: 10px;
}
.el-tag + .button-new-tag { /**el-tag之后的button-new-tag才会生效 */
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
