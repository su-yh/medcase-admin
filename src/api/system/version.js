import request from '@/utils/adminRequest'

export function getSystemVersion() {
  return request({
    url: '/system/version',
    method: 'get',
    headers: {
      isToken: false
    }
  })
}
