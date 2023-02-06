<template>
  <mobile-header-search v-if="isMobileTerminal"></mobile-header-search>
  <pc-header-search v-else></pc-header-search>
</template>

<script setup>
import mobileHeaderSearch from './mobile-header-search/index.vue'
import pcHeaderSearch from './pc-header-search/index.vue'
import { isMobileTerminal } from '@/utils/flexible'
</script>

<style lang="scss" scoped></style>
