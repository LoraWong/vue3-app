/**
 * @description: 获取所有 img 元素
 */

export const getImgElements = (elementList) => {
  const imgElements = []
  elementList.forEach((item) => {
    imgElements.push(...item.getElementsByTagName('img'))
  })

  return imgElements
}

/**
 * @description: 获取 所有 图片链接， 返回数组
 */
export const getImageUrls = (imgElementsList) => {
  return imgElementsList.map((item) => {
    return item.src
  })
}

/**
 * @description: 图片预加载，监听图片加载完成
 */
export const imgsPreload = (imgUrlList) => {
  let promiseList = []
  imgUrlList.forEach((item, index) => {
    // 确保 所有 图片加载完成（异步
    promiseList[index] = new Promise((resolve, reject) => {
      // 创建 一个 img 元素
      const img = new Image()
      // 监听图片加载完成
      img.onload = () => {
        img.onload = null
        resolve({ img, index })
      }
      // test
      // complete 是一个布尔值，表示图片是否完全加载完成。
      // if (img.complete) {
      //   //图片已经加载过了，可以使用图片
      //   console.log('图片已经加载过了')
      //   resolve({ img, index })
      // } else {
      //   // 监听图片加载完成
      //   img.onload = () => {
      //     img.onload = null
      //      console.log('监听图片加载完成')
      //     resolve({ img, index })
      //   }
      // }
      // 设置 图片 地址（最好是先定义onload，再赋值src，不然会出现资源返回，但是onload还没有挂载的情况
      img.src = item
    })
  })
  return Promise.all(promiseList)
}

/**
 * @description: 获取 最小高度 的列
 */
export const getMinHeightColumn = (columnHeightObj) => {
  // 获取 最小高度
  const minHeight = getMinHeight(columnHeightObj)
  // 获取 最小高度所在列 的 index
  return Object.keys(columnHeightObj).find((key) => columnHeightObj[key] === minHeight)
}

/**
 * @description: 获取 列的最小高度
 */
export const getMinHeight = (columnHeightObj) => {
  // Object.values() 方法返回一个 可枚举属性值 的数组
  const columnHeighArr = Object.values(columnHeightObj)
  return Math.min(...columnHeighArr)
}

/**
 * @description: 获取 列的最大高度
 */
export const getMaxHeight = (columnHeightObj) => {
  const columnHeighArr = Object.values(columnHeightObj)
  return Math.max(...columnHeighArr)
}
