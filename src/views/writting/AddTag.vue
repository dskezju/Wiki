<template>
  <div class='div-add-tag'>
    <el-form>
      <el-form-item label="文章标签" prop="tags">
        <el-tag v-for='tag in tags' :key='tag' type='success'>{{tag.tagName}}</el-tag>
      </el-form-item>
    </el-form>
    <el-divider/>

    <!-- 显示动态添加的标签 -->
    <el-tag
      :key="tag"
      v-for="tag in dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)">
      {{tag.tagName}}
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
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增标签</el-button>

    <p style='margin-top:30px'>
      <el-button type="primary" size='medium' @click='submit'>提交</el-button>
    </p>
  </div>
</template>

<script lang='ts'>
import {getAllTags, addTags} from '@/api/tag'
import { ElMessage } from 'element-plus';

export default {
  name: 'AddTag',
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      tags: [],
    };
  },
  props: {
    // force: Number,
  },
  emits: ['ok'],
  async created(){ //加载标签
    console.log('created')
    const data = await getAllTags().catch(err => {
                          ElMessage({ type: 'error', message: '获取标签失败', })
                        }) as any
    this.tags = data.data
    console.log(data)
  },
  methods: {
    async submit(){
      const tags = this.dynamicTags.filter(dynamicTag => {
        return !this.tags.find(item => item.tagName == dynamicTag.tagName)
      })
      if(tags.length != this.dynamicTags.length){
        ElMessage({
          type: 'warning',
          message: '存在重复数据！'
        })
      }
      if(tags.length > 0){
        await addTags(tags)
        ElMessage({
          type: 'success',
          message: '操作成功！',
        })
        this.$emit('ok')
      }

    },
    handleClose(tag) { //删除该tag
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
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
        this.dynamicTags.push({tagName: inputValue, cover: ''});
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
