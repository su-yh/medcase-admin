import request from '@/utils/request'
import adminRequest from '@/utils/adminRequest'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return adminRequest({
    url: '/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  }).then(response => ({
    token: response.token
  }))
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return adminRequest({
    url: '/getInfo',
    method: 'get'
  }).then(response => ({
    user: response.user,
    roles: response.roles,
    permissions: response.permissions,
    pwdChrtype: response.pwdChrtype,
    isDefaultModifyPwd: response.defaultModifyPwd,
    isPasswordExpired: response.passwordExpired
  }))
}

// 解锁屏幕
export function unlockScreen(password) {
  return request({
    url: '/unlockscreen',
    method: 'post',
    data: { password }
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
