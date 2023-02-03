import { computed } from 'vue'
import { PC_DEVICE_WIDTH } from '@/constants'
import { useWindowSize } from '@vueuse/core'

/**
 * useWindowSize 获取 一个响应式的页面宽高
 */
const {width} = useWindowSize()  

/**
 * 判断当前设备是否为移动设备：屏幕宽度是否 小于 指定宽度（1280
 * 因为我们要在后面进行 响应式的视图处理 所以此处通过 宽度 进行移动端判断！！！
 * @return {*} true / false
 */
export const isMobileTerminal = computed(() => {
  console.log(width.value);
  return width.value < PC_DEVICE_WIDTH
})

/**
 * 在实际开发中更建议通过设备来进行判断
 */
/* export const isMobileTerminal = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
     navigator.userAgent
  )
})
 */


/**
 * 动态 rem
 * 根据屏幕宽度，进行动态计算，将计算值 作为 根元素font-size值
 */
export const initRem = () => {
  
  // 监听 html文档 解析完成的事件（html 加载完 才能拿到 html 元素
  document.addEventListener('DOMContentLoaded', () =>{
    useRem()
  })
}

export const useRem = ()=>{
  // 定义最大的font-size
  const MAX_FONT_SIZE = 40
  // 根据屏幕宽度，进行计算
  // 获取 html元素
  const html = document.querySelector('html')
  // 计算 font-size: 屏幕宽度 / 100
  // innerWidth 返回以像素为单位的窗口的内部宽度
  let fontSize = window.innerWidth / 10
  fontSize = fontSize < MAX_FONT_SIZE ? fontSize : MAX_FONT_SIZE
  // 将计算值 作为 根元素font-size值
  html.style.fontSize = `${fontSize}px`
}
