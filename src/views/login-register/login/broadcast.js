/**
 * @description: 跨页面数据传输
 * 
 * 因为 QQ 登录会在一个新的窗口中进行，用户扫码登录成功之后会回调《新窗口的 QC.Login 第二参数 cb》，而不会回调到原页面。
 * 所以我们需要在《新窗口中通知到原页面》，所以就需要涉及到 JS 的跨页面通讯，而跨页面通讯指的主要就是《同源页面的通讯》
 * 同源页面的通讯方式有很多，我们这里主要介绍：
 * 1. BroadcastChannel  ->  https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel
 * 2. window.onstorage：注意：因A和B同源，故共享localStorage。当A改变localStorage的时候，会触发B的onstorage
 * 
 * broadcastChannel允许同源的不同浏览器窗口，Tab 页，frame 或者 iframe 下的不同文档之间相互通信。通过触发一个 message 事件，消息可以广播到所有监听了该频道的 BroadcastChannel 对象
 * 官方声明 safari 支持 BroadcastChannel ，但是实测 15.3 的版本并不支持 😠，所以我们需要对其进行判定使用，在不支持 BroadcastChannel 的浏览器中，使用 localstorage
 */

// 频道名
const LOGIN_SUCCESS_CHANNEL = 'LOGIN_SUCCESS_CHANNEL'

let broadcastChannel = null
if (!broadcastChannel) {
  broadcastChannel = new BroadcastChannel(LOGIN_SUCCESS_CHANNEL)
}

/**
 * @description: 等待发送消息成功的回调, 返回一个 promise，并携带对应的数据
 */
const wait = () => {
  return new Promise((resolve, reject) => {
    // 监听 消息发送成功状态
    if (broadcastChannel){
      // A发送给B，B接收到数据后，触发onmessage
      broadcastChannel.onmessage() = (event) => {
        resolve(event.data)
      } 
    }else{
      // 当A改变localStorage的时候，会触发B的onstorage
        localStorage.onstorage = (event) => {
          // 每次 localStorage都会触发该回调，要先判断是否为我们需要的 数据
          // key为localStorage中某条记录的key，oldValue为该记录的旧值，newValue为新值
          if(event.key === LOGIN_SUCCESS_CHANNEL){
            resolve(JSON.parse(event.newValue))
          }
        }
      }
  })
}

/**
 * @description: 发送消息
 */
const send = (data) => {
  if (broadcastChannel) {
    // 兼容 broadcastChannel
    broadcastChannel.postMessage(data) 
  } else {
    // 不兼容 broadcastChannel, 使用localstorage
    localStorage.setItem('LOGIN_SUCCESS_CHANNEL', JSON.stringify(data))
  }
}

/**
 * @description: 销毁
 */
const clear = () => {
  if(broadcastChannel){
    broadcastChannel.close()
    broadcastChannel = null
  } else {
    localStorage.removeItem('LOGIN_SUCCESS_CHANNEL')
  }
}

export default {
  wait,
  send,
  clear,
}