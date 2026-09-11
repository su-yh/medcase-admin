import adminRequest from '@/utils/adminRequest'

// 查询审计日志列表
export function list(query) {
  return adminRequest({
    url: '/monitor/operlog/list',
    method: 'get',
    params: query
  })
}
