import { WEI_BO_UID, WEI_BO_APP_KEY } from '@/constants'

/**
 * @description: 微博分享
 * @param {*} imgURL 要分享的图片
 * @param {*} path 网页的链接
 * WEI_BO_UID, WEI_BO_APP_KEY, 注册微博开放平台、创建应用后就可以拿到
 */
export const weiboShare = (imgUrl, path) => {
  window.open(
    `https://service.weibo.com/share/share.php?appkey=${WEI_BO_APP_KEY}&ralateUid=${WEI_BO_UID}&pic=${imgUrl}&title=这张图不错哦，给大家分享一下 ${path}`,
    '_blank'
  )
}
