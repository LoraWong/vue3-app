<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.fullPath"></component>
    </keep-alive>
  </router-view>
</template>

<script setup>
console.log('main')
// todo: 缓存main组件
</script>

<style lang="scss" scoped></style>
