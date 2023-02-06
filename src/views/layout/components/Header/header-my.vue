<template>
  <div>
    <!-- 已登录 -->
    <m-popover v-if="userStore.hasUserInfo" class="flex items-center" placement="bottom-left">
      <template #reference>
        <div
          class="guide-my relative flex items-center p-0.5 rounded-sm cursor-pointer duration-200 outline-none hover:bg-zinc-100/30"
        >
          <!-- 头像 -->
          <img class="w-3 h-3 rounded-sm" :src="userStore.userInfo.avatar" />
          <!-- 下箭头 -->
          <m-svg-icon
            class="h-1 w-1 ml-0.5"
            name="down-arrow"
            fillClass="fill-zinc-900 dark:fill-zinc-300"
          ></m-svg-icon>
          <!-- vip 标记 -->
          <m-svg-icon
            v-if="userStore.userInfo.vipLevel"
            name="vip-level"
            class="w-1.5 h-1.5 absolute right-1.5 bottom-0"
            fillClass="fill-zinc-900 dark:fill-zinc-300"
          ></m-svg-icon>
        </div>
      </template>
      <!-- 弹出框 -->
      <div class="w-[120px] overflow-hidden">
        <div
          class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60"
          v-for="item in menuArr"
          :key="item.id"
          @click="onItemClick(item)"
        >
          <m-svg-icon
            :name="item.icon"
            class="w-1.5 h-1.5 mr-1"
            fillClass="fill-zinc-900 dark:fill-zinc-300"
          ></m-svg-icon>
          <span class="text-zinc-800 dark:text-zinc-300 text-sm">{{ item.title }}</span>
        </div>
      </div>
    </m-popover>
    <!-- 未登录 -->
    <div v-else>
      <m-button class="guide-my" icon="profile" iconColor="#fff" @click="onToLogin"></m-button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user.js'

import { useRouter } from 'vue-router'
import { confirm } from '@/libs'
import { useAppStore } from "@/store/modules/app.js";

const appStore = useAppStore()

const userStore = useUserStore()



// 构建 menu 数据源
const menuArr = [
  {
    id: 0,
    title: '个人资料',
    icon: 'profile',
    path: `/profile/${userStore.userInfo.username}}`,
  },
  {
    id: 1,
    title: '升级 VIP',
    icon: 'vip-profile',
    path: '/member',
  },
  {
    id: 2,
    title: '退出登录',
    icon: 'logout',
    path: '',
  },
]

const router = useRouter()
/**
 * @description: 点击登录，跳转到登录页面
 */
const onToLogin = () => {
  // 修改路由过渡类型
  appStore.changeRouterType('push')
  router.push('/login')
}

/**
 * @description: 退出登录
 */
const onItemClick = (item) => {
  // 有路径则跳转
  if (item.path) {
    // 修改路由过渡类型
    appStore.changeRouterType('push')
    router.push(item.path)
    return
  }
  confirm('您确定要退出登录吗？').then(() => {
    // 清空用户信息
    userStore.logout()
  })
}
</script>

<style lang="scss" scoped></style>
