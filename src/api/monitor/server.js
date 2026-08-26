import adminRequest from '@/utils/adminRequest'

// 获取服务信息
export function getServer() {
  return adminRequest({
    url: '/monitor/server',
    method: 'get'
  }).then(data => ({ data }))
}
