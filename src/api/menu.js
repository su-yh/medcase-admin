import adminRequest from '@/utils/adminRequest'

// 获取路由
export const getRouters = () => {
  return adminRequest({
    url: '/getRouters',
    method: 'get'
  }).then(data => ({
    data
  }))
}
