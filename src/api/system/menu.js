import adminRequest from '@/utils/adminRequest'

// 查询菜单列表
export function listMenu(query) {
  return adminRequest({
    url: '/system/menu/list',
    method: 'get',
    params: query
  }).then(data => ({ data }))
}

// 查询菜单详细
export function getMenu(menuId) {
  return adminRequest({
    url: '/system/menu/' + menuId,
    method: 'get'
  }).then(data => ({ data }))
}

// 查询菜单下拉树结构
export function treeselect() {
  return adminRequest({
    url: '/system/menu/treeselect',
    method: 'get'
  }).then(data => ({ data }))
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return adminRequest({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return adminRequest({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return adminRequest({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 保存菜单排序
export function updateMenuSort(data) {
  return adminRequest({
    url: '/system/menu/updateSort',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return adminRequest({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}
