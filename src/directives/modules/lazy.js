import { useIntersectionObserver } from '@vueuse/core'

/**
 * @description: 图片懒加载
 */
export default {
  mounted(el) {
    // 给 img元素 绑定 v-lazy指令
    // 图片懒加载：在用户无法看到图片时，不加载图片，在用户可以看到图片后加载图片
    // 如何判断用户是否看到了图片：useIntersectionObserver
    // 1.获取当前 img元素的src属性值
    const imgSrc = el.src
    // 2.清除 img元素的src属性值
    el.src = ''

    // 3.元素可见时，再给 scr赋值
    const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        el.src = imgSrc
        // 阻止冒泡
        stop()
      }
    })
  },
}
