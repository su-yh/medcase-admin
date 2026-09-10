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
  assert.doesNotMatch(permission, /normalizeBackendRoutes/)
  assert.match(permission, /handleTree/)
  assert.match(permission, /function filterAsyncRouter\(asyncRouterMap, root = true\)/)
  assert.match(permission, /const routerRoute = \{ \.\.\.route \}/)
  assert.match(permission, /routerRoute\.name = routerRoute\.routeName/)
  assert.match(permission, /routerRoute\.path = root && !routePath\.startsWith\(['"]\/['"]\)/)
  assert.match(permission, /routerRoute\.component = loadView\(routerRoute\.vueComponentPath\)/)
  assert.match(permission, /routerRoute\.component = Layout/)
  assert.match(permission, /routerRoute\.meta = \{/)
  assert.match(permission, /routerRoute\.hidden = !routerRoute\.visible/)
  assert.doesNotMatch(permission, /route\.component = loadView\(route\.component\)/)
  assert.doesNotMatch(permission, /ParentView|InnerLink|filterChildren|component === ['"]Layout['"]|component === ['"]ParentView['"]|component === ['"]InnerLink['"]/)
  assert.doesNotMatch(menu, /isFrame|form\.query|外链/)
  assert.match(menu, /row-key="id"/)
  assert.match(menu, /proxy\.handleTree\(response\.data, ["']id["']\)/)
  assert.match(menu, /v-model="form\.routePath"/)
  assert.match(menu, /v-model="form\.vueComponentPath"/)
  assert.doesNotMatch(appMain, /IframeToggle|iframe-toggle|meta\.link/)
  assert.doesNotMatch(tagsView, /iframeViews|addIframeView|meta\.link/)
  assert.equal(existsSync(new URL('../src/layout/components/Sidebar/Link.vue', import.meta.url)), false)
  assert.equal(existsSync(new URL('../src/components/ParentView/index.vue', import.meta.url)), false)
  assert.equal(existsSync(new URL('../src/layout/components/InnerLink/index.vue', import.meta.url)), false)
  assert.equal(existsSync(new URL('../src/layout/components/IframeToggle/index.vue', import.meta.url)), false)
})
