import assert from 'node:assert/strict'
import { unwrapBizResponse } from './bizResponse.js'

const data = { id: 1, name: '张医生' }

assert.deepEqual(
  unwrapBizResponse({ data: { code: 0, msg: '操作成功', data } }),
  data
)

assert.throws(
  () => unwrapBizResponse({ data: { code: 403, msg: '无权限' } }),
  error => error.code === 403 && error.message === '无权限'
)
