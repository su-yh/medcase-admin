import request from '@/utils/request'

export function listDoctor(query) {
  return request({
    url: '/biz/doctor-user/list',
    method: 'get',
    params: query
  })
}

export function getDoctor(userId) {
  return request({
    url: '/biz/doctor-user/' + userId,
    method: 'get'
  })
}

export function reviewDoctor(userId, data) {
  return request({
    url: `/biz/doctor-user/${userId}/review`,
    method: 'post',
    data
  })
}
