import adminRequest from '@/utils/adminRequest'

// 查询操作日志列表
export function list(query) {
  return adminRequest({
    url: '/monitor/operlog/list',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperlog(operId) {
  return adminRequest({
    url: '/monitor/operlog/' + operId,
    method: 'delete'
  })
}

// 清空操作日志
export function cleanOperlog() {
  return adminRequest({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}
