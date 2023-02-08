<template>
  <div>
    <span id="qqLoginBtn" v-show="false"></span>
    <m-svg-icon class="w-4 cursor-pointer" name="qq" @click="onQQLogin"></m-svg-icon>
  </div>
</template>

<script>
// QQ登录的第三方URL（对应参数 client_id、 redirect_uri）需要根据自己注册的账号填写
const QQ_LOGIN_URL =
  'https://graph.qq.com/oauth2.0/authorize?client_id=101998494&response_type=token&scope=all&redirect_uri=https%3A%2F%2Fimooc-front.lgdsunday.club%2Flogin'
</script>

<script setup>
import { onMounted } from 'vue'
import { isMobileTerminal } from '@/utils/flexible'
import broadcast from './broadcast'
import { oauthLogin } from './oauth'
import { LOGIN_TYPE_QQ } from '@/constants'

/**
 * 1. 点击qq登录图标，
 * 2. window.open打开新窗口，显示第三方qq开放平台的URL，展示二维码(需要进行QQ登录挂起，这是 QQ SDK 的必须操作)
 * 3. 打开app扫码成功
 * 4. 新窗口跳转到开发者指定URL，执行登录成功的回调，在该地址中和回调参数中获取到登录用户数据
 * 注意： 此时扫码登录之后，进入的地址为 线上的回调地址，所以此处调试必须在线上进行。上传当前的代码到线上，才能进行下一步调试。没有线上服务器，后续操作可以先不去完成，等待实际工作中需要对接时，再去进行查看。
 * 5. 跨页面传输用户数据(pc端)
 * 6. 携带第三方数据执行登录，根据返回的数据判断 该用户是否为已注册用户：
 *  已注册：直接登录
 *  未注册：执行注册（让用户输入 用户名/手机号等唯一标识，执行注册，再登录
 */

/**
 * @description: QQ登录挂起，这是 QQ SDK 的必须操作
 */
onMounted(() => {
  QC.Login(
    {
      btnId: 'qqLoginBtn', //插入按钮的节点id
    },
    // tag:登录成功的回调, 注意，这个回调只会在《登录回调页面中被执行》
    // 登录存在缓存，登录成功一次之后，下次进入会自动重新登录（即：触发该方法，所以我们应该在离开登录页面时，注销登录）
    // 因为 QQ 的自动登录机制，所以此时再次打开 https://imooc-front.lgdsunday.club/login 地址，在控制台中会打印出上次登录的用户信息
    (data, ops) => {
      // 1, 注销登录，防止下次打开URL时，再次触发 登录成功 回调
      QC.login.signOut()
      // 2, 从回调地址中获取当前用户唯一标识，判断用户是否已注册(在开发者的应用中)
      // 回调地址示例：https://imooc-front.lgdsunday.club/login#accessToken=00E8E16C078292882EE83C5ABE6FE07C&expires_in=777600
      // 注意！： 此时扫码登录之后，进入的地址为 线上的回调地址，所以此处调试必须在线上进行。上传当前的代码到线上，才能进行下一步调试。
      const accessToken = /accessToken=((.*))&expires_in/.exec(window.location.hash)[1]
      // exec() 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null。location.hash返回 url #后面的参数

      // 3, 拼接获取到的数据
      const { nickname, figureurl_qq_2 } = data
      const oauthObj = {
        nickname, // qq名称
        figureurl_qq_2, // qq头像
        accessToken,
      }

      // 4, 移动端:
      // 一个页面展示整屏内容，可能无法打开新窗口，而是直接覆盖原页面(比如APP中运行H5)，依次展示原页面、QQ登录挂起页面、回调页面；所以无需跨页面传输
      // window.close() : pc端没问题，但在移动端部分浏览器无效（如uc浏览器）
      // 可以通过 isMobileTerminal 进行判断。但是不判断也不会出现错误。（移动端场景比较复杂，建议保留以避免出现意料之外的错误）
      // if (isMobileTerminal) {
      //   // 移动端，在当前页面中（回调页面），进行登录操作（无需跨页面传输
      //   oauthLogin(LOGIN_TYPE_QQ, oauthObj)
      //   return
      // }
      oauthLogin(LOGIN_TYPE_QQ, oauthObj)

      // tag: 4, PC端：
      // 因为 QQ登录会在一个新的窗口中进行，用户扫码登录成功之后会回调《新窗口的 QC.Login 第二参数 cb》，而不会回调到原页面。 * 所以我们需要在《新窗口中通知到原页面》，涉及到 JS 的跨页面通讯，
      // 在回调页面中，向login原页面传输数据（跨页面传输
      broadcast.send(oauthObj)
      // PC端下，关闭新窗口
      window.close()
    }
  )
})

/**
 * @description: 点击QQ登录按钮事件
 */
const onQQLogin = () => {
  openQQWindow()
}

/**
 * @description: 打开新页面，展示QQ登录二维码
 */
const openQQWindow = async () => {
  window.open(
    QQ_LOGIN_URL,
    'oauth2Login_10609',
    'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes'
  )
  // PC: 在回调页面中，向login原页面传输数据成功后的回调
  // 可以通过 isMobileTerminal 进行判断。但是不判断也不会出现错误。（移动端场景比较复杂，建议保留以避免出现意料之外的错误）
  // if (!isMobileTerminal) {
  //   broadcast.wait().then((oauthObj) => {
  //     broadcast.clear()
  //     // 执行登录操作（验证是否已注册)，已注册：直接登录、跳转到首页；未注册：携带第三方数据跳转到注册页
  //     oauthLogin(LOGIN_TYPE_QQ, oauthObj)
  //   })
  // }
  broadcast.wait().then(async (oauthObj) => {
    broadcast.clear()
    // 执行登录操作（验证是否已注册)，已注册：直接登录、跳转到首页；未注册：携带第三方数据跳转到注册页
    await oauthLogin(LOGIN_TYPE_QQ, oauthObj)
  })
}
</script>

<style lang="scss" scoped></style>
