/**
 * @description: 表单校验函数
 * @param {string} val input中输入的内容
 * @return {boolean, string} true表示校验通过; string为提示
 */

export const validateUsername = (val) => {
  if (!val) {
    return '请填写用户名'
  }
  //用户名正则，4到16位（字母，数字，下划线）
  let userNamePattern = /^[a-zA-Z0-9_-]{4,16}$/
  if (userNamePattern.test(val)) {
    return true
  } else {
    return '用户名格式有误，必须4到16位（包括字母、或数字、或下划线）'
  }
}

export const validatePassword = (val) => {
  if (!val) {
    return '请填写密码'
  }

  if (val.length < 6 || val.length > 12) {
    return '密码应该在 6-12 位之间'
  }
  return true
}

export const validateConfirmPassword = (val, password) => {
  if (!val) {
    return '请确认密码'
  }
  if (val !== password[0]) {
    return '两次密码输入必须一致'
  }
  return true
}

export const validateAgreement = (val) => {
  if (!val) {
    return '请勾选协议'
  } else {
    return true
  }
}
