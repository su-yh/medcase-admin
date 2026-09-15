import request from '@/utils/request'

export function listSupplier(query) {
  return request({
    url: '/biz/supplier/list',
    method: 'get',
    params: query
  })
}

export function getSupplier(supplierId) {
  return request({
    url: `/biz/supplier/${supplierId}`,
    method: 'get'
  })
}

export function addSupplier(data) {
  return request({
    url: '/biz/supplier',
    method: 'post',
    data
  })
}

export function updateSupplier(data) {
  return request({
    url: '/biz/supplier',
    method: 'put',
    data
  })
}

export function updateSupplierStatus(supplierId, status) {
  return request({
    url: `/biz/supplier/${supplierId}/status`,
    method: 'put',
    data: { status }
  })
}

export function listSupplierUsers(supplierId, query) {
  return request({
    url: `/biz/supplier/${supplierId}/users`,
    method: 'get',
    params: query
  })
}

export function listSupplierUserCases(supplierId, userId, query) {
  return request({
    url: `/biz/supplier/${supplierId}/users/${userId}/cases`,
    method: 'get',
    params: query
  })
}
