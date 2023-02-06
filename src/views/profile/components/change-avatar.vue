<template>
  <div class="overflow-auto flex flex-col items-center">
    <m-svg-icon
      v-if="isMobileTerminal"
      name="close"
      class="w-3 h-3 p-0.5 m-1 ml-auto"
      fillClass="fill-zinc-900 dark:fill-zinc-200 "
      @click="onClose"
    ></m-svg-icon>
    <img :src="imgUrl" alt="" class="block w-20" ref="imageTarget" />
    <m-button size="small" :loading="loading" class="mt-2 w-[50%] xl:w-1/2" @click="onConfirmClick"
      >确定</m-button
    >
  </div>
</template>

<script>
const EMITS_CLOSE = 'close'
const EMITS_CHANGE_BLOB = 'update:currentChangedBlob'
</script>

<script setup>
import { onMounted, ref } from 'vue'
import { isMobileTerminal } from '@/utils/flexible'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { useUserStore } from '@/store/modules/user.js'

const userStore = useUserStore()

const props = defineProps({
  imgUrl: {
    type: String,
    required: true,
  },
  // 裁剪后的图片blob
  currentChangedBlob: {
    required: true,
  },
})

const emits = defineEmits([EMITS_CLOSE, EMITS_CHANGE_BLOB])
const loading = ref(false)
/**
 * @description: 关闭 dialog
 */
const onClose = () => {
  emits(EMITS_CLOSE)
}

/**
 * @description: 确定按钮点击事件
 */
const onConfirmClick = () => {
  // 获取裁剪后的图片
  cropper.getCroppedCanvas().toBlob((blob) => {
    // 裁剪后的 blob 地址
    const imgURL = URL.createObjectURL(blob)
    // 更新 store数据（点击保存修改后 再保存到服务器
    userStore.userInfo.avatar = imgURL
    // 裁剪后的 blob传递给父组件（点击保存修改按钮后，上传到OSS
    emits(EMITS_CHANGE_BLOB, blob)
    
  })
  // mark:关闭 dialog(延时关闭，否则父组件 blob无法修改)
  setTimeout(() => {
    onClose()
  }, 100)
  
}

/**
 * 图片裁剪处理
 */
const imageTarget = ref(null)
let cropper = null
onMounted(() => {
  /**
   * 接收两个参数：
   * 1. 需要裁剪的图片 DOM
   * 2. options 配置对象
   */
  cropper = new Cropper(imageTarget.value, isMobileTerminal.value ? mobileOptions : pcOptions)
})

// 移动端配置对象
const mobileOptions = {
  // 将裁剪框限制在画布的大小
  viewMode: 1,
  // 移动画布，裁剪框不动
  dragMode: 'move',
  // 裁剪框固定纵横比：1:1
  aspectRatio: 1,
  // 裁剪框不可移动
  cropBoxMovable: false,
  // 不可调整裁剪框大小
  cropBoxResizable: false,
}

// PC 端配置对象
const pcOptions = {
  // 裁剪框固定纵横比：1:1
  aspectRatio: 1,
}
</script>

<style lang="scss" scoped></style>
