import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')

test('removes obsolete password configuration from login response handling', () => {
  const loginApi = read('../src/api/login.js')
  const userStore = read('../src/store/modules/user.js')

  assert.doesNotMatch(loginApi, /pwdChrtype|defaultModifyPwd|passwordExpired/)
  assert.doesNotMatch(userStore, /pwrChrtype|pwdChrtype|isDefaultModifyPwd|isPasswordExpired/)
  assert.doesNotMatch(userStore, /ElMessageBox|router\.push/)
})

test('keeps password validation independent from sys_config', () => {
  const passwordRule = read('../src/utils/passwordRule.js')

  assert.match(passwordRule, /export function usePasswordRule\(\)/)
  assert.doesNotMatch(passwordRule, /chrtype|pwdChrType|pwrChrtype|PWD_RULES/)
  assert.doesNotMatch(passwordRule, /cache\.session/)
})
