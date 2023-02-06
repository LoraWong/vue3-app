<template>
  <div class="h-screen">
    <header-vue class="h-header" />
    <div class="h-main" >
      <main-vue/>
    </div>
    <floating-vue />
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>

<script setup>
import {} from 'vue'
import {} from 'vue-router'
import headerVue from './components/Header/index.vue'
import floatingVue from './components/floating.vue'
import mainVue from './components/main.vue'
</script>

<style lang="scss" scoped></style>
