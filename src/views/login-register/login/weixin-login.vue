<template>
  <div @click="onWeiXinLogin">
    <m-svg-icon class="w-4 cursor-pointer" name="wexin"></m-svg-icon>
    <div id="login-container"></div>
  </div>
</template>

<script setup>
import {} from 'vue'
import { getWXLoginData, getWXLoginToken, getWXLoginUserInfo } from '@/api/sys.js'
import broadcast from './broadcast'
import { oauthLogin } from './oauth'
import { LOGIN_TYPE_WX } from '@/constants'

/* 整个微信登录流程与 QQ 登录流程略有不同，分为以下几步：
// 注意！移动设备（H5）中无法支持微信登录的。因为无法直接通过 H5 吊起微信

通过 微信登录前置数据获取 接口，获取登录数据（比如 APP ID）
根据获取到的数据，拼接得到 open url 地址
打开该地址，展示微信登录二维码
移动端微信扫码确定登录
从回调地址URL中解析 得到用户code 数据(window.location.search)
回调地址示例：https://imooc-front.lgdsunday.club/login?code=xxx&state=xxx
根据 appId、appSecret、code 通过接口获取用户的 access_token
根据 access_token 获取用户信息
通过用户信息触发 oauthLogin 方法 */

/**
 * @description: 扫码成功后，解析数据
 * 回调地址示例：https://imooc-front.lgdsunday.club/login?code=xxx&state=xxx
 * 扫码成功后，login组件重新挂载，此时location.search已经有code数据
 */
if (window.location.search) {
  // 解析search数据中的code
  const code = /code=((.*))&state/.exec(window.location.search)[1]
  if (code) {
    // 将code跨页面传输给 原login页面
    broadcast.send({ code })
  }
  // 关闭窗口
  window.close()
}

/**
 * @description: 点击微信登录按钮事件
 */
const onWeiXinLogin = async () => {
  // 发请求 微信登录前置数据
  const data = await getWXLoginData()
  const { appId, appSecret, redirectUri, scope, state } = data
  // 打开第三方URL，展示登录二维码
  window.open(
    `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`,
    '',
    'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes'
  )

  // 等待 跨页面数据传输成功
  broadcast.wait().then(async (data) => {
    // 拿到回调页面传递过来的 第三方登录用户code
    // 发请求，获取 AccessToken 和 openid
    const { access_token, openid } = await getWXLoginToken({ appId, appSecret, code: data.code })
    // 根据 access_token, openid 获取微信用户信息
    const { nickname, headimgurl } = await getWXLoginUserInfo(access_token, openid)
    // 执行登录操作
    oauthLogin(LOGIN_TYPE_WX, {
      openid,
      nickname,
      headimgurl,
    })
  })
}
</script>

<style lang="scss" scoped></style>
