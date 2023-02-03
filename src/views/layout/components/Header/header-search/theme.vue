<template>
  <div>
    <div class="text-xs mb-1 text-zinc-400">热门精选</div>
    <div class="flex h-[140px]" v-if="themeData.list.length">
      <div
        class="relative rounded w-[150px] cursor-pointer"
        :style="{
          backgroundColor: randomColor(),
        }"
        @click="onItemClick(themeData.big.title)"
      >
        <img class="h-full w-full object-cover rounded" v-lazy :src="themeData.big.photo" alt="" />
        <p
          class="absolute bottom-0 left-0 w-full h-[45%] flex items-center backdrop-blur rounded px-1 text-white text-xs duration-300 hover:backdrop-blur-none"
        >
          # {{ themeData.big.title }}
        </p>
      </div>
      <div class="flex flex-wrap flex-1 max-w-[860px]">
        <div
          v-for="item in themeData.list"
          :key="item.id"
          class="h-[45%] w-[150px] text-white text-xs relative ml-1.5 mb-1.5 rounded"
          :style="{
            backgroundColor: randomColor(),
          }"
          @click="onItemClick(item.title)"
        >
          <img class="w-full h-full object-cover rounded" v-lazy :src="item.photo" />
          <p
            class="backdrop-blur absolute top-0 left-0 w-full h-full flex items-center px-1 rounded cursor-pointer duration-300 hover:backdrop-blur-none"
          >
            # {{ item.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getThemes } from '@/api/pixels.js'
import { randomColor } from '@/utils/color.js'

const emits = defineEmits(['onItemClick'])

const themeData = ref({
  big: {},
  list: [],
})
const getThemeData = async () => {
  const { themes } = await getThemes()
  themeData.value = {
    big: themes[0],
    list: themes.splice(1, themes.length),
  }
}
getThemeData()

/**
 * @description: 点击某个 theme，触发父组件搜索回调
 */
const onItemClick = (val) => {
  emits('onItemClick', val)
}
</script>

<style lang="scss" scoped></style>
