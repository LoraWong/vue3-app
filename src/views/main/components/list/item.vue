<template>
  <div class="bg-white dark:bg-zinc-900 xl:dark:bg-zinc-800 rounded z-10 pb-1 duration-500">
    <div
      class="relative w-full rounded cursor-zoom-in group"
      :style="{ backgroundColor: randomColor() }"
      @click="onToDetailClick"
      ref="imgContainer"
    >
      <img
        v-lazy
        :src="data.photo"
        class="w-full rounded bg-transparent"
        :style="{ height: (width / data.photoWidth) * data.photoHeight + 'px' }"
        ref="imgTarget"
      />
      <!-- 遮罩层 -->
      <div
        class="hidden xl:block w-full h-full opacity-0 bg-zinc-300/60 absolute top-0 left-0 z-20 rounded group-hover:opacity-100 duration-300"
      >
        <m-button class="absolute top-1.5 left-1.5" size="small">分享</m-button>
        <m-button
          class="absolute top-1.5 right-1.5"
          type="info"
          icon="heart"
          iconClass="fill-zinc-900 dark:fill-zinc-200"
        ></m-button>
        <m-button
          class="absolute bottom-1.5 left-1.5 bg-zinc-100/70"
          type="info"
          size="small"
          icon="download"
          iconClass="fill-zinc-900 dark:fill-zinc-200"
          @click="onDownload"
        ></m-button>
        <m-button
          class="absolute bottom-1.5 right-1.5 bg-zinc-100/70"
          type="info"
          size="small"
          icon="full"
          iconClass="fill-zinc-900 dark:fill-zinc-200"
          @click="onImgFullscreen"
        ></m-button>
      </div>
    </div>
    <!-- author -->
    <div class="flex items-center mt-1 px-1">
      <img class="h-2 w-2 rounded-full" :src="data.avatar" alt="" />
      <span class="text-sm text-zinc-500 ml-1">{{ data.author }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { randomColor } from '@/utils/color.js'
import { saveAs } from 'file-saver'
import { message } from '@/libs'
import { useFullscreen, useElementBounding } from '@vueuse/core'

const props = defineProps({
  // 单个 Item 数据
  data: {
    type: Object,
    required: true,
  },
  width: {
    type: Number,
  },
})

const emits = defineEmits(['click'])

const imgTarget = ref(null)
const imgContainer = ref()
/**
 * @description: 图片下载
 */

const onDownload = () => {
  // 提示消息
  message('success', '图片开始下载')
  setTimeout(() => {
    // 图片链接
    // todo: 点击下载，禁止链接跳转
    saveAs(props.data.photoDownLink)
  }, 100)
}

/**
 * @description: 全屏
 */

// enter: 进入全屏
const { enter: onImgFullscreen } = useFullscreen(imgTarget)

/**
 * @description: 点击Item，显示 detail组件
 * 记录图片的中心点（X|Y位置 + 宽|高的一半）
 * 通知父组件跳转到 detail页面
 */
const onToDetailClick = () => {
  // 记录图片的中心点（X|Y位置 + 宽|高的一半）
  const location = getImgContainerCenter()

  // 通知父组件跳转到 detail页面
  emits('click', {
    id: props.data.id,
    location,
  })
}

/**
 * @description: 记录图片的中心点（X|Y位置 + 宽|高的一半）
 */
// vueuse 获取元素信息
// const {
//   x: imgContainerX,
//   y: imgContainerY,
//   width: imgContainerWidth,
//   height: imgContainerHeight,
// } = useElementBounding(imgTarget)

const getImgContainerCenter = () => {
  // 获取元素位置（点击 Item再计算，如果Item挂载就计算，则每个挂载的Item都要计算，不利于性能优化
  //  在这里 为什么用 vueuse 获取不到元素信息？？？？
  // 响应式数据 必须在 setup里面
  // 解决：不要用vueuse，用原生 API获取元素信息（非响应式数据
  // const {
  //   x: imgContainerX,
  //   y: imgContainerY,
  //   width: imgContainerWidth,
  //   height: imgContainerHeight,
  // } = useElementBounding(imgTarget)

  // 原生 API
  const { x, y, width, height } = imgTarget.value.getBoundingClientRect()
  const translateX = parseInt(x + width / 2)
  const translateY = parseInt(y + height / 2)

  // 计算元素中心位置
  // const translateX = parseInt(imgContainerX.value + imgContainerWidth.value / 2)
  // const translateY = parseInt(imgContainerY.value + imgContainerHeight.value / 2)

  return {
    translateX,
    translateY,
  }
}



</script>

<style lang="scss" scoped>
/* 处理img破图/图片裂开 */
img[src=''],
img:not([src]) {
  opacity: 0;
}
</style>
