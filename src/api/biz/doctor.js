import bizRequest from '@/utils/bizRequest'

export function listDoctor(query) {
  return bizRequest({
    url: '/biz/doctor-user/list',
    method: 'get',
    params: query
  })
}

export function getDoctor(userId) {
  return bizRequest({
    url: '/biz/doctor-user/' + userId,
    method: 'get'
  })
}
