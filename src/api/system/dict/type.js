import request from '@/utils/request'
import adminRequest from '@/utils/adminRequest'

// 查询字典类型列表
export function listType(query) {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params: query
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return adminRequest({
    url: '/system/dict/type/' + dictId,
    method: 'get'
  }).then(data => ({ data }))
}

// 新增字典类型
export function addType(data) {
  return adminRequest({
    url: '/system/dict/type',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return adminRequest({
    url: '/system/dict/type',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delType(dictId) {
  return adminRequest({
    url: '/system/dict/type/' + dictId,
    method: 'delete'
  })
}

// 刷新字典缓存
export function refreshCache() {
  return adminRequest({
    url: '/system/dict/type/refreshCache',
    method: 'delete'
  })
}

// 获取字典选择框列表
export function optionselect() {
  return adminRequest({
    url: '/system/dict/type/optionselect',
    method: 'get'
  }).then(data => ({ data }))
}
