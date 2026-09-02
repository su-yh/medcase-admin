import adminRequest from '@/utils/adminRequest'

export function listSupplier(query) {
  return adminRequest({
    url: '/biz/supplier/list',
    method: 'get',
    params: query
  })
}

export function getSupplier(supplierId) {
  return adminRequest({
    url: `/biz/supplier/${supplierId}`,
    method: 'get'
  })
}

export function addSupplier(data) {
  return adminRequest({
    url: '/biz/supplier',
    method: 'post',
    data
  })
}

export function updateSupplier(data) {
  return adminRequest({
    url: '/biz/supplier',
    method: 'put',
    data
  })
}

export function updateSupplierStatus(supplierId, status) {
  return adminRequest({
    url: `/biz/supplier/${supplierId}/status`,
    method: 'put',
    data: { status }
  })
}

export function listSupplierUsers(supplierId, query) {
  return adminRequest({
    url: `/biz/supplier/${supplierId}/users`,
    method: 'get',
    params: query
  })
}

export function listSupplierUserCases(supplierId, userId, query) {
  return adminRequest({
    url: `/biz/supplier/${supplierId}/users/${userId}/cases`,
    method: 'get',
    params: query
  })
}
