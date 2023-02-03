import messageComponent from './message.vue'
import { h, render } from 'vue'

/**
 * @description: 函数调用 message组件
 */
export const message = (type, content, duration = 3000) => {
  /**
   * @description: 关闭回调
   */
  const onDestroy = () => {
    // 销毁组件
    render(null, document.body)
  }

  // vnode
  const vnode = h(messageComponent, {
    type,
    content,
    duration,
    destroy: onDestroy,
  })

  // 渲染DOM
  render(vnode, document.body)
}
