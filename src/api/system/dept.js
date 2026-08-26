import adminRequest from '@/utils/adminRequest'

// 查询部门列表
export function listDept(query) {
  return adminRequest({
    url: '/system/dept/list',
    method: 'get',
    params: query
  }).then(data => ({ data }))
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return adminRequest({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  }).then(data => ({ data }))
}

// 查询部门详细
export function getDept(deptId) {
  return adminRequest({
    url: '/system/dept/' + deptId,
    method: 'get'
  }).then(data => ({ data }))
}

// 新增部门
export function addDept(data) {
  return adminRequest({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return adminRequest({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 保存部门排序
export function updateDeptSort(data) {
  return adminRequest({
    url: '/system/dept/updateSort',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return adminRequest({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}
