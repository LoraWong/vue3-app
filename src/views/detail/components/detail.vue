<template>
  <div
    class="fixed left-0 top-0 z-40 w-screen h-screen text-xl bg-white xl:bg-transparent backdrop-blur-3xl overflow-y-auto xl:p-2 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
  >
    <!-- 移动端展示 navbar -->
    <m-navbar v-if="isMobileTerminal">
      {{ pixelData.title }}
      <template #right>
        <m-svg-icon
          name="share"
          class="w-3 h-3"
          fillClass="fill-zinc-900 dark:fill-zinc-200"
        ></m-svg-icon>
      </template>
    </m-navbar>
    <!-- pc端展示 关闭图标 -->
    <m-svg-icon
      v-else
      name="close"
      fillClass="fill-zinc-400"
      class="w-3 h-3 ml-1 p-0.5 cursor-pointer duration-200 rounded-sm hover:bg-zinc-100 absolute right-2 top-2"
    ></m-svg-icon>
    <!-- content -->
    <div class="xl:w-[80%] xl:h-auto xl:mx-auto xl:rounded-lg xl:flex bg-white mb-2 xl:mb-0">
      <img
        class="w-screen mb-2 xl:mb-0 xl:w-3/5 xl:rounded-tl-lg xl:rounded-bl-lg"
        :src="pixelData.photo"
        :style="{ backgroundColor: randomColor() }"
      />
      <div
        class="xl:w-2/5 xl:h-full xl:bg-white xl:dark:bg-zinc-900 xl:rounded-tr-lg xl:rounded-br-lg xl:p-3"
      >
        <div v-if="!isMobileTerminal" class="flex justify-between mb-2">
          <m-svg-icon
            name="share"
            class="w-4 h-4 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 duration-300 rounded"
            fillClass="fill-zinc-900 dark:fill-zinc-200"
          ></m-svg-icon>

          <m-button type="info" icon="heart" iconClass="fill-zinc-900 dark:fill-zinc-200" />
        </div>
        <!-- 标题 -->
        <div class="flex justify-between pr-2">
          <p class="text-base text-zinc-900 dark:text-zinc-200 ml-1 font-bold xl:text-xl xl:mb-5">
            {{ pixelData.title }}
          </p>
          <m-button
            v-if="isMobileTerminal"
            type="info"
            icon="heart"
            iconClass="fill-zinc-900 dark:fill-zinc-200"
          />
        </div>

        <!-- 作者 -->
        <div class="flex items-center mt-1 px-1">
          <img v-lazy class="h-3 w-3 rounded-full" :src="pixelData.avatar" alt="" />
          <span class="text-base text-zinc-900 dark:text-zinc-200 ml-1">{{
            pixelData.author
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getPixelsFromId } from '@/api/pixels.js'
import mNavbar from '@/libs/navbar/index.vue'
import { isMobileTerminal } from '@/utils/flexible.js'
import { randomColor } from '@/utils/color.js'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

/**
 * @description: 获取当前图片数据
 */
const pixelData = ref({})

const getPixelData = async () => {
  const data = await getPixelsFromId(props.id)
  pixelData.value = data
}
getPixelData()
</script>

<style lang="scss" scoped>
/* 处理img破图/图片裂开 */
img[src=''],
img:not([src]) {
  opacity: 0;
}
</style>
