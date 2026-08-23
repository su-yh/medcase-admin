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

export function reviewDoctor(userId, data) {
  return bizRequest({
    url: `/biz/doctor-user/${userId}/review`,
    method: 'post',
    data
  })
}
