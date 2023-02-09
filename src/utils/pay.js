// import store from '@/store'
import { getAliPay } from '@/api/pay'
import { isMobileTerminal } from '@/utils/flexible'

/**
 * @description: 触发支付宝支付
 * @param {*} title 支付标题
 * @param {*} desc 支付描述
 */
export const aliPay = async (title, desc) => {
  // 发请求，获取 encode 的支付地址(编码过的URL)
  // PC端会跳转到第三方页面，展示二维码，支付成功后跳转到指定回调页面；移动端会挂起支付宝App，发起支付
  const { encodeURI } = await getAliPay(title, '0.01', desc, isMobileTerminal.value)
  // 解码URL url跳转
  window.location.href = decodeURIComponent(encodeURI)
}
