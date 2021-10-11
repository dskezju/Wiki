<template>
  <div class="img-del">
    <el-image
      class="image"
      :src="src"
      fit="cover"
      :preview-src-list="[src]"
    >
    </el-image>

    <div>
      <el-button plain size="small" @click="remove">移除</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ImageWithDelete',
  props: {
    index: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
  },
  emits: ['on-remove'],
  methods: {
    remove(){
      this.$emit('on-remove', this.index);
    }
  }
}
</script>

<style scoped>
.image {
  width: 100px;
  height: 100px;
}

.img-del {
  width: 100px;
  float: left;
  margin-right: 20px;
  text-align:center
}
</style>
