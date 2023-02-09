<template>
  <div class="w-full text-center bg-white dark:bg-zinc-800 xl:hidden">
    <!-- 特惠提示 -->
    <discounts-vue></discounts-vue>
    <!-- 支付 -->
    <div class="flex justify-between text-xs px-1 py-1">
      <div class="text-left text-zinc-900 dark:text-zinc-200">
        <p class="">
          券后合计：<span class="text-red-600 text-[16px] font-sans font-medium">￥</span
          ><span class="text-red-600 text-[22px] font-sans font-medium">{{ payData.price }}</span>
        </p>
        <p class="text-red-600">优惠券：限时立减 ￥{{ payData.oldPrice - payData.price }}</p>
      </div>
      <m-button size="small" class="w-9 rounded-full" :isActiveAnim="false" @click="onConfirmClick"
        >立即开通</m-button
      >
    </div>
    <m-popup v-model="isOpenPopup" class="rounded">
      <mobile-pay-select-vue :payData="payData"></mobile-pay-select-vue>
    </m-popup>
  </div>
</template>

<script setup>
import discountsVue from '../discounts.vue'
import mobilePaySelectVue from './mobile-pay-select.vue'
import { ref } from 'vue'

defineProps({
  payData: {
    type: Object,
    required: true,
  },
})

/**
 * @description: 点击 立即开通按钮 事件
 */
// popup显示隐藏
const isOpenPopup = ref(false)
const onConfirmClick = () => {
  // 显示 popup
  isOpenPopup.value = true
}
</script>
