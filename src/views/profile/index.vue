<template>
  <div class="h-full bg-zinc-200 dark:bg-zinc-800 duration-400 overflow-auto xl:pt-1">
    <div
      class="relative max-w-screen-lg mx-auto bg-white dark:bg-zinc-900 duration-400 xl:rounded-sm xl:border-zinc-200 xl:dark:border-zinc-600 xl:border-[1px] xl:px-4 xl:py-2 pb-5"
    >
      <!-- 移动端 navbar -->
      <m-navbar sticky v-if="isMobileTerminal" :clickLeft="onNavbarLeftClick" class="bg-gradient">
        个人资料
      </m-navbar>
      <!-- pc 端 -->
      <div v-else class="text-lg font-bold text-center mb-4 dark:text-zinc-300">个人资料</div>
      <div class="h-full w-full px-1 pb-4 text-sm mt-2 xl:w-2/3 xl:pb-0">
        <!-- 头像 -->
        <div class="py-1 xl:absolute xl:right-[16%] xl:text-center">
          <span
            class="w-8 inline-block mb-2 font-bold text-sm dark:text-zinc-300 xl:block xl:mx-auto"
            >我的头像</span
          >
          <!-- 头像部分 -->
          <div
            class="relative w-[80px] h-[80px] group xl:cursor-pointer xl:left-[50%] xl:translate-x-[-50%]"
            @click="onAvatarClick"
          >
            <img
              v-lazy
              :src="userStore.userInfo.avatar"
              alt=""
              class="rounded-[50%] w-full h-full xl:inline-block"
            />
            <div
              class="absolute top-0 rounded-[50%] w-full h-full bg-[rgba(0,0,0,.4)] hidden xl:group-hover:block"
            >
              <m-svg-icon name="change-header-image" class="w-2 h-2 m-auto mt-2"></m-svg-icon>
              <div class="text-xs text-white dark:text-zinc-300 scale-90 mt-0.5">点击更换头像</div>
            </div>
          </div>
          <!-- 隐藏域（上传头像图片） -->
          <input
            v-show="false"
            ref="inputFileTarget"
            type="file"
            accept=".png, .jpeg, .jpg, .gif"
            @change="onSelectImgHandler"
          />
          <p class="mt-1 text-zinc-500 dark:text-zinc-400 text-xs xl:w-10">
            支持 jpg、png、jpeg 格式大小 5M 以内的图片
          </p>
        </div>
        <!-- 用户名 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">用户名</span>
          <m-input
            :modelValue="userStore.userInfo.nickname"
            @update:modelValue="changeStoreUserInfo('nickname', $event)"
            class="w-full"
            type="text"
            max="20"
          ></m-input>
        </div>
        <!-- 职位 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">职位</span>
          <m-input
            :modelValue="userStore.userInfo.title"
            @update:modelValue="changeStoreUserInfo('title', $event)"
            class="w-full"
            type="text"
          ></m-input>
        </div>
        <!-- 公司 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">公司</span>
          <m-input
            :modelValue="userStore.userInfo.company"
            @update:modelValue="changeStoreUserInfo('company', $event)"
            class="w-full"
            type="text"
          ></m-input>
        </div>
        <!-- 个人主页 -->
        <div class="py-1 xl:flex xl:items-center xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">个人主页</span>
          <m-input
            :modelValue="userStore.userInfo.homePage"
            @update:modelValue="changeStoreUserInfo('homepage', $event)"
            class="w-full"
            type="text"
          ></m-input>
        </div>
        <!-- 个人介绍 -->
        <div class="py-1 xl:flex xl:my-1">
          <span class="w-8 block mb-1 font-bold dark:text-zinc-300 xl:mb-0">个人介绍</span>
          <m-input
            :modelValue="userStore.userInfo.introduction"
            @update:modelValue="changeStoreUserInfo('introduction', $event)"
            class="w-full"
            type="textarea"
            max="50"
          ></m-input>
        </div>
        <!-- 保存修改 -->
        <m-button
          size="small"
          class="  w-4/5 mt-2 mb-4 dark:text-zinc-300 dark:bg-zinc-800 xl:w-[160px] xl:ml-[50%] xl:translate-x-[-50%]"
          @click="onChangeProfile"
          >保存修改</m-button
        >
        <!-- 移动端退出登录 -->
        <m-button
          v-if="isMobileTerminal"
          :loading="loading"
          size="small"
          class="w-4/5 dark:text-zinc-300 dark:bg-zinc-800 xl:w-[160px] xl:ml-[50%] xl:translate-x-[-50%]"
          @click="onLogoutClick"
        >
          退出登录
        </m-button>
      </div>
    </div>
    <!-- 修改头像弹出层 -->
    <!-- pc端 -->
    <m-dialog v-if="!isMobileTerminal" v-model="dialogIsVisible" title="修改头像">
      <change-avatar-vue
        :imgUrl="currentAvatarURL"
        @close="dialogIsVisible = false"
        v-model:current-changed-blob="currentChangedBlob"
      ></change-avatar-vue>
    </m-dialog>
    <!-- 移动端（注意！popup组件不会销毁，所以需要在 显示时再指定高度 -->
    <m-popup v-else v-model="dialogIsVisible" :class="{ 'h-full': dialogIsVisible }">
      <change-avatar-vue
        :imgUrl="currentAvatarURL"
        @close="dialogIsVisible = false"
        v-model:current-changed-blob="currentChangedBlob"
      ></change-avatar-vue>
    </m-popup>
  </div>
</template>

<script>
export default {
  name: 'profile',
}
</script>

<script setup>
import { ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useUserStore } from '@/store/modules/user.js'
import { isMobileTerminal } from '@/utils/flexible.js'
import { confirm, message } from '@/libs'
import { useRouter } from 'vue-router'
import ChangeAvatarVue from './components/change-avatar.vue'
import { getOSSClient } from '@/utils/sts.js'
import { useAppStore } from '@/store/modules/app.js'

const appStore = useAppStore()
const userStore = useUserStore()

const router = useRouter()

// 隐藏域
const inputFileTarget = ref(null)

const loading = ref(false)

/**
 * @description: 修改store中的数据
 */
const changeStoreUserInfo = (key, value) => {
  userStore.userInfo[key] = value
}

// 控制 dialog显示隐藏
const dialogIsVisible = ref(false)
// 选中的图片
const currentAvatarURL = ref('')
// 裁剪后的图片
const currentChangedBlob = ref(null)
/**
 * 更换头像点击事件
 */
const onAvatarClick = () => {
  // 触发隐藏域 点击事件，弹出文件选择窗口
  inputFileTarget.value.click()
}

/**
 * 头像文件选择之后的回调
 * 注意！当两次选中同一个文件时，input change回调不会再触发，因此每次文件选择完成之后，需要重置 input隐藏域的value值
 */
const onSelectImgHandler = () => {
  // 获取选中的文件
  const imgFile = inputFileTarget.value.files[0]
  // 生成 blob对象（返回一个图片URL
  const blob = URL.createObjectURL(imgFile)
  // 保存
  currentAvatarURL.value = blob
  // 重置 input隐藏域的value值
  // inputFileTarget.value.value = null
  // 显示 dialog, 展示选中的图片
  dialogIsVisible.value = true
}

/**
 * @description: 关闭 dialog后 重置隐藏域的value值（防止：两次选中同一个文件时，change回调不会再触发
 */
watch(dialogIsVisible, (val) => {
  if (!val) {
    inputFileTarget.value.value = null
  }
})

/**
 * @description: 图片OSS上传
 */
// OSS实例
let ossClient
const putObjToOSS = async (file) => {
  try {
    if (!ossClient) {
      // 生成 OSS实例
      ossClient = await getOSSClient()
    }
    // 上传 put( 存放路径, 文件)；存放路径(包含名称)：images/用户名/xxx.格式
    // 文件格式：blob对象的type属性 'image/png' ,从type属性中截取
    const fileType = file.type.split('/').splice(-1, 1)
    const filename = `${userStore.userInfo.username}/${Date.now()}.${fileType}`
    // 返回文件信息（url: http://imooc-front.oss-cn-beijing.aliyuncs.com/images/testname/1675522906581.png
    const res = await ossClient.put(`images/${filename}`, file)
    return res
  } catch (error) {
    message('error', error)
  }
}

/**
 * @description: 保存修改 点击事件
 */
const onChangeProfile = async () => {
  loading.value = true
  try {
    //todo: 避免重复上传，怎么判断profile是否被修改？没有修改则无需上传图片、无需上传到服务器
    // 图片上传到 阿里云 OSS
    if (currentChangedBlob.value) {
      console.log('OSS')
      const res = await putObjToOSS(currentChangedBlob.value)
      // 图片保存到 store
      userStore.userInfo.avatar = res.url
    }

    // 数据上传到服务端
    await userStore.setUserInfo(userStore.userInfo)
    message('success', '修改成功！')
    // 清空blob
    currentChangedBlob.value = null
  } catch (error) {
    message('error', error)
  }
  loading.value = false
}

/**
 * 移动端后退处理
 */
const onNavbarLeftClick = async () => {
  // 修改路由过渡类型
  appStore.changeRouterType('back')
  router.back()
}

/**
 * 移动端：退出登录
 */
const onLogoutClick = () => {
  confirm('确定要退出登录吗？').then(() => {
    userStore.logout()
  })
}

/**
 * @description: 在当前位置的组件将要离开时触发(该组件路由缓存)
 * 组件路由守卫
 */
onBeforeRouteLeave(() => {
  // 离开profile页面后，重新获取用户信息（如果没有保存profile修改，但store中的数据已经被修改，需要更新

  userStore.getUserInfo()
})
</script>

<style lang="scss" scoped></style>
