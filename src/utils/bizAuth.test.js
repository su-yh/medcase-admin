import assert from 'node:assert/strict'
import { isBizUnauthorized } from './bizAuth.js'

assert.equal(
  isBizUnauthorized({ data: { code: 'error.code.user.not.login' } }),
  true
)

assert.equal(
  isBizUnauthorized({ status: 401, data: {} }),
  true
)

assert.equal(
  isBizUnauthorized({ status: 200, data: { code: 403 } }),
  false
)
