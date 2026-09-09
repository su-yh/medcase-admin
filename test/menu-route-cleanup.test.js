import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')

test('removes obsolete dynamic menu route handling', () => {
  const permission = read('../src/store/modules/permission.js')
  const menu = read('../src/views/system/menu/index.vue')
  const appMain = read('../src/layout/components/AppMain.vue')
  const tagsView = read('../src/store/modules/tagsView.js')

  assert.match(permission, /import Layout from ['"]@\/layout\/index['"]/)
  assert.match(permission, /function filterAsyncRouter\(asyncRouterMap, root = true\)/)
  assert.match(permission, /route\.path = route\.path\.startsWith\(['"]\/['"]\) \? route\.path : ['"]\/['"] \+ route\.path/)
  assert.match(permission, /route\.component = Layout/)
  assert.doesNotMatch(permission, /ParentView|InnerLink|filterChildren|component === ['"]Layout['"]|component === ['"]ParentView['"]|component === ['"]InnerLink['"]/)
  assert.doesNotMatch(menu, /isFrame|form\.query|外链/)
  assert.doesNotMatch(appMain, /IframeToggle|iframe-toggle|meta\.link/)
  assert.doesNotMatch(tagsView, /iframeViews|addIframeView|meta\.link/)
  assert.equal(existsSync(new URL('../src/components/ParentView/index.vue', import.meta.url)), false)
  assert.equal(existsSync(new URL('../src/layout/components/InnerLink/index.vue', import.meta.url)), false)
  assert.equal(existsSync(new URL('../src/layout/components/IframeToggle/index.vue', import.meta.url)), false)
})
