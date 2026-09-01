import adminRequest from '@/utils/adminRequest'

export function listPatient(query) {
  return adminRequest({
    url: '/biz/patient-user/list',
    method: 'get',
    params: query
  })
}

export function getPatient(userId) {
  return adminRequest({
    url: '/biz/patient-user/' + userId,
    method: 'get'
  })
}

export function reviewPatient(userId, data) {
  return adminRequest({
    url: `/biz/patient-user/${userId}/review`,
    method: 'post',
    data
  })
}
