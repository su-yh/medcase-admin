import adminRequest from '@/utils/adminRequest'

export function listDoctor(query) {
  return adminRequest({
    url: '/biz/doctor-user/list',
    method: 'get',
    params: query
  })
}

export function getDoctor(userId) {
  return adminRequest({
    url: '/biz/doctor-user/' + userId,
    method: 'get'
  })
}

export function reviewDoctor(userId, data) {
  return adminRequest({
    url: `/biz/doctor-user/${userId}/review`,
    method: 'post',
    data
  })
}
