import bizRequest from '@/utils/bizRequest'

export function listCaseReview(query) {
  return bizRequest({
    url: '/biz/case-review/list',
    method: 'get',
    params: query
  })
}
