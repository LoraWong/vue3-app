<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName" @before-enter="beforeEnter" @after-leave="afterLeave">
      <keep-alive :include="virtualTaskStack">
        <component
          :is="Component"
          :key="$route.fullPath"
          :class="{ 'fixed top-0 left-0 w-full z-50': isAnimation }"
        />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script>
// 无需监听路由的各种状态（在 PC 端下）
const NONE = 'none'
// 路由进入
const PUSH = 'push'
// 路由退出
const BACK = 'back'
// 路由跳转的 enum
const ROUTER_TYPE_ENUM = [NONE, PUSH, BACK]
</script>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app.js'

const appStore = useAppStore()

// tag:路由过渡
/**
 *1. 路由过渡类型：push|back|none（pc端不需要过渡；push|back使用不同动画
  在 PC端 时：routerType 始终为 NONE; 在移动端时：routerType 根据进入或退出的状态指定为 push 或者 back
  使用全局状态管理来实现：
  2. 路由过渡类型 存储在store
  3. 每次路由跳转前修改store中的 路由过渡类型: 每次进行 router.push() 操作前，修改 routerType 为 push，在执行 router.back() 操作前，修改 routerType 为 back
  (不要再 libs 中修改，因为 libs 为通用组件; 不要再跳转到 首页 时添加该操作，因为首页为任务栈的 根)
  
  4. 路由前置守卫中，修改过渡动画
 */

//  tag:路由缓存
/**
 * 将路由组件的退出和进入流程看作一个栈（先进后出
 * 1.使用keepAlive组件的 include，只有栈中的组件才需要被缓存
 * 2.路由前置守卫中，组件进入前被添加到 任务栈最后，组件退出后从任务栈中删除(即删除最后一个)
 * update: 判断 路由组件是否已经缓存, 已经缓存，则push时不需要再添加任务；back则删除对应任务
 * 3.进入根任务，则清空栈，只保留根任务（根路由组件
 * 注意！keepAlive组件的 include会根据组件name 选项进行匹配，所以组件如果想要条件性地被 KeepAlive 缓存，就必须显式声明一个 name 选项（name默认为vue文件名（由于任务栈中添加的是router.name，因此被缓存的组件name要与router.name保持一致！
 */

const props = defineProps({
  // 路由跳转的类型，对应 ROUTER_TYPE_ENUM
  routerType: {
    type: String,
    default: NONE,
    validator(val) {
      const result = ROUTER_TYPE_ENUM.includes(val)
      if (!result) {
        throw new Error(`你的 routerType 必须是 ${ROUTER_TYPE_ENUM.join('、')} 中的一个`)
      }
      return result
    },
  },
  // 首页的组件名称，对应任务栈中的第一个组件（首页不能back
  mainComponentName: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()
// 当前动画名称
const transitionName = ref('')

// 虚拟任务栈(根任务：首页)
const virtualTaskStack = ref([props.mainComponentName])

/**
 * @description: 路由前置守卫，初始化时执行、每次路由切换前执行
 */
router.beforeEach((to, from) => {
  // 修改路由过渡类型
  // update：判断 路由组件是否已经缓存, 已经缓存，则push时不需要再添加任务；back则删除对应任务
  const isFind = virtualTaskStack.value.includes(to.name)

  if (props.routerType === PUSH) {
    // 入栈：组件进入前被添加到 任务栈最后
    if (!isFind) {
      // 已经缓存，则push时不需要再添加任务
      console.log('入栈')
      virtualTaskStack.value.push(to.name)
    }
  } else if (props.routerType === BACK) {
    // 出栈：从任务栈中删除该组件
    console.log('出栈')
    const index = virtualTaskStack.value.indexOf(route.name)
    if (index > -1) {
      virtualTaskStack.value.splice(index, 1)
    }
  }

  // if (props.routerType === PUSH) {
  //   // 入栈：组件进入前被添加到 任务栈最后
  //   console.log('入栈')
  //   virtualTaskStack.value.push(to.name)
  //   // appStore.addVirtualTask(to.name)
  // } else if (props.routerType === BACK) {
  //   // 出栈：组件退出后从任务栈中删除
  //   console.log('出栈')
  //   // virtualTaskStack.value.pop()
  //   // appStore.removeVirtualTask(route.name)
  // }

  // 进入根任务(首页，清空栈
  if (to.name === props.mainComponentName) {
    resetVirtualTaskStack()
  }

  // 定义当前动画名称
  transitionName.value = props.routerType

  console.log('currentRouterType', appStore.currentRouterType)
  console.log(props.routerType)

  console.log(
    '🚀 ~ file: index.vue:93 ~ router.beforeEach ~ virtualTaskStack',
    virtualTaskStack.value
  )
})

/**
 * @description: 重置任务栈
 */
const resetVirtualTaskStack = () => {
  virtualTaskStack.value = [props.mainComponentName]
  // appStore.clearVirtualTaskStack(props.mainComponentName)
}

/**
 * @description: 处理过渡动画样式
 * 过渡的组件需要添加 fixed定位，否则前一个组件会压在后一个组件的上方, 无法实现左右无缝切换
 * 过渡开始前，添加样式
 * 过渡开始后，删除样式
 */
const isAnimation = ref(false)

const beforeEnter = () => {
  isAnimation.value = true
}

const afterLeave = () => {
  isAnimation.value = false
}
</script>

<style lang="scss" scoped>
// push页面时：新页面的进入动画
.push-enter-active {
  animation-name: push-in;
  animation-duration: 0.4s;
}
// push页面时：老页面的退出动画
.push-leave-active {
  animation-name: push-out;
  animation-duration: 0.4s;
}
// push页面时：新页面的进入动画
@keyframes push-in {
  0% {
    transform: translate(100%, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
// push页面时：老页面的退出动画
@keyframes push-out {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-50%, 0);
  }
}

// 后退页面时：即将展示的页面动画
.back-enter-active {
  animation-name: back-in;
  animation-duration: 0.4s;
  /* animation-timing-function: ease-in; */
}
// 后退页面时：后退的页面执行的动画
.back-leave-active {
  animation-name: back-out;
  animation-duration: 0.4s;
  /* animation-timing-function: ease-in; */
}
// 后退页面时：即将展示的页面动画
@keyframes back-in {
  0% {
    width: 100%;
    transform: translate(-100%, 0);
  }
  100% {
    width: 100%;
    transform: translate(0, 0);
  }
}
// 后退页面时：后退的页面执行的动画
@keyframes back-out {
  0% {
    width: 100%;
    transform: translate(0, 0);
  }
  100% {
    width: 100%;
    transform: translate(50%, 0);
  }
}
</style>
