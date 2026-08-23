import request from '@/utils/request'

export function listDoctor(query) {
  return request({
    url: '/biz/doctor/list',
    method: 'get',
    params: query
  })
}

export function getDoctor(userId) {
  return request({
    url: '/biz/doctor/' + userId,
    method: 'get'
  })
}
