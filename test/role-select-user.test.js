import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')

test('handles successful role user assignment when the API has no response data', () => {
  const selectUser = read('../src/views/system/role/selectUser.vue')

  assert.doesNotMatch(selectUser, /msgSuccess\(res\.msg\)/)
  assert.match(selectUser, /authUserSelectAll\(\{ roleId: roleId, userIds: uIds \}\)\.then\(\(\) => \{/)
  assert.doesNotMatch(selectUser, /console\.log\(["']res:/)
  assert.match(selectUser, /proxy\.\$modal\.msgSuccess\(["']分配用户成功["']\)/)
  assert.match(selectUser, /visible\.value = false[\s\S]*emit\(["']ok["']\)/)
})
