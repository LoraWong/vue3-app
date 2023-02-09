<template>
  <div class="py-2 h-[80vh] flex flex-col">
    <h3 class="text-base text-zinc-900 dark:text-zinc-200 font-bold mb-2 px-1">选择支付方式</h3>
    <!-- 支付宝 -->
    <div
      class="flex items-center px-2 py-2 border-b border-b-zinc-200 dark:border-b-zinc-600 active:bg-zinc-200 dark:active:bg-zinc-900"
      @click="onAliPay"
    >
      <m-svg-icon name="alipay" class="w-4 h-4"></m-svg-icon>
      <p class="text-base ml-1 text-zinc-800 dark:text-zinc-200" @click="onAliPay">支付宝</p>
    </div>
  </div>
</template>

<script setup>
import {} from 'vue'
import { aliPay } from '@/utils/pay.js'

const props = defineProps({
  payData: {
    type: Object,
    required: true,
  },
})

/**
 * @description: 支付宝支付点击事件
 * 移动端会挂起支付宝App
 */
const onAliPay = async (params) => {
  // 触发支付宝支付, 跳转到第三方
  const { title, desc } = props.payData
  await aliPay(title, desc)
}
</script>

<style lang="scss" scoped></style>
