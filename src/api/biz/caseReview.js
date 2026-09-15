import request from '@/utils/request'

function buildBaseUrl(caseType) {
  return caseType === 'patient' ? '/biz/patient-case' : '/biz/doctor-case'
}

export function listCaseReview(caseType, query) {
  return request({
    url: `${buildBaseUrl(caseType)}/list`,
    method: 'get',
    params: query
  })
}

export function reviewCaseReview(caseType, id, data) {
  return request({
    url: `${buildBaseUrl(caseType)}/${id}/review`,
    method: 'post',
    data
  })
}

export function settleCaseReview(caseType, id, data) {
  const request = {
    url: `${buildBaseUrl(caseType)}/${id}/settle`,
    method: 'post'
  }
  if (data && Object.keys(data).length) {
    request.data = data
  }
  return request(request)
}
