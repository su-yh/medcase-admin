import adminRequest from '@/utils/adminRequest'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return adminRequest({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return adminRequest({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  }).then(response => ({
    data: response.data,
    postIds: response.postIds,
    roleIds: response.roleIds,
    roles: response.roles,
    posts: response.posts
  }))
}

// 新增用户
export function addUser(data) {
  return adminRequest({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return adminRequest({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return adminRequest({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return adminRequest({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return adminRequest({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return adminRequest({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return adminRequest({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return adminRequest({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return adminRequest({
    url: '/file/upload',
    method: 'post',
    params: { business: 'avatar' },
    headers: { 'Content-Type': 'multipart/form-data', repeatSubmit: false },
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return adminRequest({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return adminRequest({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return adminRequest({
    url: '/system/user/deptTree',
    method: 'get'
  }).then(data => ({ data }))
}
