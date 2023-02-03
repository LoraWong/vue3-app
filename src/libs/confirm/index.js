import { h, render } from 'vue'
import confirmComponent from './confirm.vue'

/**
 * @description: 函数调用 confirm组件
 * @param {*} title 标题（非必须）（若 函数只传入一个参数，则 默认设置为 content
 * @param {*} content 描述（必须，默认项
 * @param {*} cancelText 取消按钮文本（非必须
 * @param {*} confirmText 确认按钮文本（非必须
 */
export const confirm = (title, content, cancelText, confirmText) => {
  return new Promise((resolve, reject) => {
    // 若 函数只传入一个参数，则 默认设置为 content()
    if (title && !content) {
      content = title
      title = ''
    }
    // 点击 确认按钮事件
    const confirmHandler = () => {
      console.log('resolve');
      resolve()
    }
    // 点击 取消按钮事件
    const cancelHandler = () => {
      console.log('reject');
      reject()
    }
    // 关闭 confirm 事件
    const close = () => {
      // 从 body 中删除 confirm
      render(null, document.body)
    }
    // 1.使用 h函数 创建vnode
    const vnode = h(confirmComponent, {
      title,
      content,
      cancelText,
      confirmText,
      cancelHandler,
      confirmHandler,
      close,
    })
    // 2.使用 render函数 渲染组件 到body中
    render(vnode, document.body)
  })
}
