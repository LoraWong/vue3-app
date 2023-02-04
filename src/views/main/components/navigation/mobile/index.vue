<template>
  <div class="bg-white sticky top-0 left-0 z-10 dark:bg-zinc-800 duration-500">
    <ul
      class="relative flex overflow-x-auto p-[1vw] text-xs text-zinc-600 dark:text-zinc-300 overflow-hidden scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
      ref="ulTarget"
    >
      <!-- slider -->
      <li
        class="absolute h-[22px] bg-main dark:bg-zinc-300/30 rounded-lg duration-200"
        :style="sliderStyle"
      ></li>
      <!-- hamburger -->
      <li
        class="absolute top-0 right-0 h-3 px-1 flex items-center z-30 bg-white dark:bg-zinc-800 shadow-l-white dark:shadow-none"
        @click="onShowPopup"
      >
        <m-svg-icon
          name="hamburger"
          class="w-1.5 h-1.5"
          fillClass="dark:fill-zinc-200"
        ></m-svg-icon>
      </li>
      <li
        v-for="(item, index) in categoryStore.category"
        :key="item.id"
        class="flex-shrink-0 px-1.5 py-0.5 last:mr-4 z-20"
        :class="{ 'text-zinc-100': appStore.currentCategoryIndex === index }"
        :ref="setItemRef"
        @click="onItemClick(item)"
      >
        {{ item.name }}
      </li>
    </ul>
    <!-- popup -->
    <m-popup v-model="isPopupShow" class="rounded-t-md">
      <menu-vue @onItemClick="onItemClick"></menu-vue>
    </m-popup>
  </div>
</template>

<script setup>
import { ref, onBeforeUpdate, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import menuVue from '@/views/main/components/menu/index.vue'

import { useCategoryStore } from '@/store/modules/category.js'
import { useAppStore } from '@/store/modules/app.js'

const categoryStore = useCategoryStore()
const appStore = useAppStore()

/**
 * popup相关
 */
const isPopupShow = ref(false)
const onShowPopup = () => {
  isPopupShow.value = true
}

/**
 * slider 相关
 */
/**
 * slider 样式（动态修改
 */
const sliderStyle = ref({
  transform: 'translateX(0px)',
  width: '54px',
})

/**
 * 获取 所有  v-for渲染 的li
 * vue3中获取所有 v-for渲染 的DOM元素，ref需要绑定一个函数, 这个函数接收一个参数el, 即为 DOM元素
 * v-for循环多少次，该函数就执行多少次（DOM元素更新，该函数也会执行
 * @param {*} el DOM元素
 */
let itemRefs = []
const setItemRef = (el) => {
  // console.log("🚀 ~ file: index.vue:56 ~ setItemRef ~ el", el)
  if (el) {
    itemRefs.push(el)
  }
}

/**
 * 数据更新后, DOM更新之前 执行回调
 */
onBeforeUpdate(() => {
  // 清空itemRefs，防止 DOM重复添加
  itemRefs = []
})

// 获取 ul 元素
const ulTarget = ref(null)
// ul 的横向滚动偏离位置（vueuse中的 useScroll方法 获取响应式的滚动偏离位置
const { x: ulScrollLeft } = useScroll(ulTarget)

/**
 * 监听 currentCategoryIndex
 */
watch(
  () => appStore.currentCategoryIndex,
  (val) => {
    // Element.getBoundingClientRect() 方法返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置
    const rect = itemRefs[val].getBoundingClientRect()
    const { left, width } = rect
    // console.log("🚀 ~ file: index.vue:90 ~ watch ~ rect", rect)
    // slider移动的距离 = ul 横向滚动偏离位置ulScrollLeft + slider相对于视口的左侧距离left （ ul设置了 padding，还要减去 padding-left值
    // 修改 slider 样式
    sliderStyle.value = {
      transform: `translateX(${ulScrollLeft.value + left - 5}px)`,
      width: `${width}px`,
    }
  }
)

/**
 * 分类 点击事件
 */
const onItemClick = (item) => {
  // 修改 item
  appStore.changeCurrentCategory(item)
  console.log(item)
  // 关闭 popup
  if (isPopupShow.value) {
    isPopupShow.value = false
  }
}
</script>

<style lang="scss" scoped></style>
