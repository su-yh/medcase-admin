import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')

test('removes legacy Boolean enum definitions', () => {
  const constants = read('../src/constants/system.js')

  assert.doesNotMatch(constants, /NORMAL_DISABLE_OPTIONS|NOTICE_STATUS_OPTIONS|YES_NO_OPTIONS/)
  assert.equal(existsSync(new URL('../../medcase-api/src/main/java/com/medcase/common/enums/NormalDisableEnums.java', import.meta.url)), false)
  assert.equal(existsSync(new URL('../../medcase-api/src/main/java/com/medcase/common/enums/NoticeStatusEnums.java', import.meta.url)), false)
  assert.equal(existsSync(new URL('../../medcase-api/src/main/java/com/medcase/common/enums/YesNoEnums.java', import.meta.url)), false)
})

test('binds system Boolean fields directly in admin views', () => {
  const views = [
    '../src/views/system/config/index.vue',
    '../src/views/system/dept/index.vue',
    '../src/views/system/dict/data.vue',
    '../src/views/system/dict/index.vue',
    '../src/views/system/menu/index.vue',
    '../src/views/system/notice/index.vue',
    '../src/views/system/post/index.vue',
    '../src/views/system/role/index.vue'
  ].map(read)

  for (const view of views) {
    assert.doesNotMatch(view, /NORMAL_DISABLE_OPTIONS|NOTICE_STATUS_OPTIONS|YES_NO_OPTIONS/)
  }

  const role = read('../src/views/system/role/index.vue')
  assert.doesNotMatch(role, /menuCheckStrictly[^\n]*(?:===|!==|==|!=)/)
})
