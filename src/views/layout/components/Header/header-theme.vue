<template>
  <m-popover placement="bottom-left">
    <!-- 具名插槽：触发弹出层 -->
    <template #reference>
      <m-svg-icon
       :name="svgIconName"
        class="w-4 h-4 p-1 cursor-pointer rounded hover:bg-zinc-100/30 hover:scale-105 duration-200"
        fillClass="fill-zinc-900 dark:fill-zinc-300"
      ></m-svg-icon>
    </template>
    <!-- 匿名插槽：弹出层内容 -->
    <div class="w-[110px]">
      <div
        class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60"
        v-for="item in themeArr"
        :key="item.key"
        @click="onItemClick(item)"
      >
        <m-svg-icon
          :name="item.icon"
          class="w-1.5 h-1.5 mr-1"
          fillClass="dark:fill-zinc-300"
        ></m-svg-icon>
        <span class="text-zinc-900 dark:text-zinc-300 text-sm">{{ item.name }}</span>
      </div>
    </div>
  </m-popover>
</template>
<script>
import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/constants'
/**
 * @description: popover组件 数据源
 */
const themeArr = [
  {
    id: 0,
    type: THEME_LIGHT,
    icon: 'theme-light',
    name: '极简白',
  },
  {
    id: 1,
    type: THEME_DARK,
    icon: 'theme-dark',
    name: '极夜黑',
  },
  {
    id: 2,
    type: THEME_SYSTEM,
    icon: 'theme-system',
    name: '跟随系统',
  },
]
</script>
<script setup>
import { computed } from 'vue'

import {} from 'vue-router'
import { useThemeStore } from '@/store/modules/theme.js'

const themeStore = useThemeStore()

// 监听 主题切换 行为
// 将 选中的主题 保存到 state中，并进行本地缓存
// 根据保存的主题，切换 icon图标
// 根据保存的主题，修改 html标签中的 class类名

/**
 * @description: 点击 切换主题
 */
const onItemClick = (theme) => {
  // 保存到 state中
  themeStore.changeTheme(theme.type)
}

/**
 * @description: 展示图标
 */
const svgIconName = computed(() => {
  // 查找当前 主题 的 icon图标
  const currentTheme = themeArr.find((theme) => theme.type === themeStore.themeType)
  return currentTheme.icon
})
</script>

<style lang="scss" scoped></style>
