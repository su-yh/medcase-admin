import request from '@/utils/request'
import adminRequest from '@/utils/adminRequest'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return adminRequest({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  }).then(data => ({ data }))
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return adminRequest({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  }).then(data => ({ data }))
}

// 新增字典数据
export function addData(data) {
  return adminRequest({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return adminRequest({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return adminRequest({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}
