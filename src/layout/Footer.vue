
<template>
  <div class="footer">
    <div>Wiki App ©2021 Created by Severusq</div>
    <div class="number">
      <i @click="showTool(github)" :title="github.title" class="me-icon-github"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
  data() {
      return {
        qq: {title: 'QQ'},
        github: {
          title: 'github',
          href: "https://github.com/dskezju/Wiki",
        }
      }
    },
    methods: {
      showTool(tool) {
        window.open(tool.href)
      }
    }
});
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  font-weight: bold;
}
</style>

