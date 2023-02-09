<template>
  <div class="h-full bg-zinc-200 dark:bg-zinc-800 duration-400 xl:pt-1">
    <div
      class="mx-auto h-full pt-[50%] px-1 bg-white dark:bg-zinc-900 duration-400 xl:h-[360px] xl:rounded-sm xl:py-10 xl:border-zinc-200 xl:dark:border-zinc-600 xl:border-[1px] xl:px-4 xl:max-w-screen-lg"
    >
      <div v-if="JSON.stringify(isSuccess) !== 'null'" class="flex justify-center items-center">
        <m-svg-icon v-if="isSuccess" name="pay-success" class="w-8 h-8 mr-4"></m-svg-icon>
        <m-svg-icon v-if="!isSuccess" name="pay-fail" class="w-8 h-8 mr-4"></m-svg-icon>
        <p class="text-ml text-zinc-900 dark:text-zinc-200">
          {{ isSuccess ? '支付成功' : '支付失败' }}
        </p>
      </div>

      <m-button class="w-full mt-8 mx-auto dark:bg-zinc-800 xl:w-[120px]" @click="onConfirm"
        >确定</m-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPayResult } from '@/api/pay'
import { useUserStore } from '@/store/modules/user.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

/**
 * @description: 该页面为 支付成功后的回调页面, URL中携带query参数
 * 注意！调试需要在线上进行
 * 1.从URL中获取订单号
 * 2.携带订单号，获取支付结果，根据支付结果展示对应信息
 * 3. 点击确认按钮，重新获取用户信息，跳转到首页
 */

// 支付是否成功
const isSuccess = ref(null)

/**
 * @description: 获取支付结果
 */
const getPayResultData = async () => {
  // 从URL中获取订单号, 发请求获取支付结果
  const res = await getPayResult(route.query.out_trade_no)
  isSuccess.value = res
}
getPayResultData()

/**
 * @description: 确定按钮点击事件
 */
const onConfirm = async () => {
  // 重新获取用户信息
  await userStore.getUserInfo()
  // 跳转到首页
  router.push('/')
}
</script>

<style lang="scss" scoped></style>
