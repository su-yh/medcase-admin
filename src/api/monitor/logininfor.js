import adminRequest from '@/utils/adminRequest'

// 查询登录日志列表
export function list(query) {
  return adminRequest({
    url: '/monitor/logininfor/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLogininfor(infoId) {
  return adminRequest({
    url: '/monitor/logininfor/' + infoId,
    method: 'delete'
  })
}

// 解锁用户登录状态
export function unlockLogininfor(userName) {
  return adminRequest({
    url: '/monitor/logininfor/unlock/' + userName,
    method: 'get'
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return adminRequest({
    url: '/monitor/logininfor/clean',
    method: 'delete'
  })
}
