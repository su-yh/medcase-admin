import adminRequest from '@/utils/adminRequest'

// 查询在线用户列表
export function list(query) {
  return adminRequest({
    url: '/monitor/online/list',
    method: 'get',
    params: query
  })
}

// 强退用户
export function forceLogout(tokenId) {
  return adminRequest({
    url: '/monitor/online/' + tokenId,
    method: 'delete'
  })
}
