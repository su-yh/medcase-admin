import request from '@/utils/request'

export function listCaseReview(query) {
  return request({
    url: '/biz/case/review/list',
    method: 'get',
    params: query
  })
}

export function getCaseReview(id) {
  return request({
    url: '/biz/case/review/' + id,
    method: 'get'
  })
}
