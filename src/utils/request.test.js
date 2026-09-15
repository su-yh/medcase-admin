import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('../..', import.meta.url))
const server = await createServer({
  root,
  appType: 'custom',
  server: {
    middlewareMode: true,
    hmr: false,
    ws: false
  },
  resolve: {
    alias: {
      '@': path.resolve(root, 'src')
    }
  }
})
const { SUCCESS_CODE, createError, unwrapResponse } = await server.ssrLoadModule('/src/utils/request.js')

test.after(async () => {
  await server.close()
})

test('unwraps successful responses from the request module', () => {
  const data = { id: 1, name: '张医生' }

  assert.equal(SUCCESS_CODE, 'OK')
  assert.deepEqual(
    unwrapResponse({ data: { code: SUCCESS_CODE, msg: '操作成功', data } }),
    data
  )
})

test('creates errors from failed response payloads', () => {
  const error = createError({
    status: 403,
    data: { code: 'error.code.access.denied', msg: '当前操作没有权限' }
  })

  assert.equal(error.code, 403)
  assert.equal(error.status, 403)
  assert.equal(error.message, '当前操作没有权限')
})

test('uses the business error code when no HTTP error status exists', () => {
  assert.throws(
    () => unwrapResponse({ data: { code: 'error.code.access.denied', msg: '无权限' } }),
    error => error.code === 'error.code.access.denied' && error.message === '无权限'
  )
})
