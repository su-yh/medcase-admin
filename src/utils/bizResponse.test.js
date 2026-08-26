import assert from 'node:assert/strict'
import { createBizError, unwrapBizResponse } from './bizResponse.js'

const data = { id: 1, name: '张医生' }

assert.deepEqual(
  unwrapBizResponse({ data: { code: 0, msg: '操作成功', data } }),
  data
)

assert.throws(
  () => unwrapBizResponse({ data: { code: 403, msg: '无权限' } }),
  error => error.code === 403 && error.message === '无权限'
)

const methodError = createBizError({
  status: 405,
  data: { msg: '请求方法不支持' }
})

assert.equal(methodError.code, 405)
assert.equal(methodError.status, 405)
assert.equal(methodError.message, '请求方法不支持')

const forbiddenError = createBizError({
  status: 403,
  data: { code: 0, msg: '当前操作没有权限' }
})

assert.equal(forbiddenError.code, 403)
assert.equal(forbiddenError.status, 403)
assert.equal(forbiddenError.message, '当前操作没有权限')
