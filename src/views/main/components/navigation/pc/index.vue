<template>
  <div
    class="fixed w-full dark:bg-zinc-800 dark:bg-none bg-gradient-to-l to-white from-main duration-500 z-30"
  >
    <ul
      class="w-[1000px] relative flex flex-wrap justify-center overflow-x-auto overflow-hidden px-[10px] py-1 z-20 text-sm duration-300"
      :class="[isOpen ? 'h-[160px]' : 'h-[56px]']"
    >
      <!-- 展开箭头图标 -->
      <div
        class="absolute right-2 bottom-1 z-20 p-1 rounded cursor-pointer duration-200 hover:bg-zinc-100/30"
        @click="toggleNavigation"
      >
        <m-svg-icon
          :name="isOpen ? 'fold' : 'unfold'"
          fillClass="fill-zinc-900 dark:fill-zinc-300"
          class="w-1 h-1"
        ></m-svg-icon>
      </div>
      <!-- category item -->
      <li
        v-for="(item, index) in categoryStore.category"
        :key="item.id"
        class="px-1 py-0 mb-1 mr-1 text-zinc-900 dark:text-zinc-300 font-bold duration-200 leading-4 rounded-md cursor-pointer hover:bg-hover-main/50"
        :class="[
          {
            'bg-main dark:bg-zinc-900 !text-white dark:text-zinc-300':
              appStore.currentCategoryIndex === index,
          },
        ]"
        @click="onItemClick(item)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {} from 'vue-router'
import { useCategoryStore } from '@/store/modules/category.js'
import { useAppStore } from '@/store/modules/app.js'

const categoryStore = useCategoryStore()
const appStore = useAppStore()
/**
 * @description: navigation 展开收起
 */
const isOpen = ref(false)
const toggleNavigation = () => {
  isOpen.value = !isOpen.value
}

/**
 * @description: 选中分类，显示高亮
 */

const onItemClick = (item) => {
  appStore.changeCurrentCategory(item)
}
</script>

<style lang="scss" scoped></style>
