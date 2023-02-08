// import store from '@/store'
import { getAliPay } from '@/api/pay'
import { isMobileTerminal } from '@/utils/flexible'

/**
 * @description: 触发支付宝支付
 * @param {*} title 支付标题
 * @param {*} desc 支付描述
 */
const aliPay = async (title, desc) => {
  // 发请求，获取 encode 的支付地址(编码过的URL)
  // 
  const { encodeURL } = await getAliPay(title, '0.01', desc, isMobileTerminal.value)

  // 解码URL url跳转
  window.location.href = decodeURIComponent(encodeURL)
}
