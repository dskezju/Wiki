<template>
  <router-link to="/">
    <img
      class="logo"
      src="../assets/logo.jpg"
      alt=""
    >
  </router-link>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'Logo',
})
</script>

<style scoped>
.logo {
  height: 50px;
  margin: 0;
  border-radius: 50%;
  margin-top: 5px;
}
</style>
