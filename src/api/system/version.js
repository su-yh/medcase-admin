import request from '@/utils/request'

export function getSystemVersion() {
  return request({
    url: '/system/version',
    method: 'get',
    headers: {
      isToken: false
    }
  })
}
