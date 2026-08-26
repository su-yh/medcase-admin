import adminRequest from '@/utils/adminRequest'

export function listCaseReview(query) {
  return adminRequest({
    url: '/biz/case-review/list',
    method: 'get',
    params: query
  })
}

export function reviewCaseReview(id, data) {
  return adminRequest({
    url: `/biz/case-review/${id}/review`,
    method: 'post',
    data
  })
}

export function settleCaseReview(id, data) {
  const request = {
    url: `/biz/case-review/${id}/settle`,
    method: 'post'
  }
  if (data && Object.keys(data).length) {
    request.data = data
  }
  return adminRequest(request)
}
