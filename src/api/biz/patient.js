import request from '@/utils/request'

export function listPatient(query) {
  return request({
    url: '/biz/patient-user/list',
    method: 'get',
    params: query
  })
}

export function getPatient(userId) {
  return request({
    url: '/biz/patient-user/' + userId,
    method: 'get'
  })
}

export function reviewPatient(userId, data) {
  return request({
    url: `/biz/patient-user/${userId}/review`,
    method: 'post',
    data
  })
}
