import adminRequest from '@/utils/adminRequest'

// 查询岗位列表
export function listPost(query) {
  return adminRequest({
    url: '/system/post/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return adminRequest({
    url: '/system/post/' + postId,
    method: 'get'
  }).then(data => ({ data }))
}

// 新增岗位
export function addPost(data) {
  return adminRequest({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return adminRequest({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return adminRequest({
    url: '/system/post/' + postId,
    method: 'delete'
  })
}
