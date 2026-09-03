import test from 'node:test'
import assert from 'node:assert/strict'
import { filterRoutesByEnvironment } from '../src/utils/route-environment.js'

const routes = [
  {
    path: '/system',
    children: [
      { path: 'role', component: 'system/role/index' },
      { path: 'menu', component: 'system/menu/index' },
      {
        path: 'log',
        meta: { title: '日志管理' },
        children: [
          { path: 'operlog', component: 'monitor/operlog/index' },
          { path: 'logininfor', component: 'monitor/logininfor/index' }
        ]
      },
      { path: 'dict', component: 'system/dict/index', meta: { title: '字典管理' } },
      { path: 'config', component: 'system/config/index', meta: { title: '参数设置' } }
    ]
  },
  {
    path: 'monitor',
    meta: { title: '系统监控' },
    children: [
      { path: 'online', component: 'monitor/online/index' },
      { path: 'server', component: 'monitor/server/index' }
    ]
  }
]

test('keeps restricted menus in development', () => {
  const filteredRoutes = filterRoutesByEnvironment(routes, 'development')

  assert.deepEqual(filteredRoutes, routes)
})

test('hides restricted menus outside development', () => {
  for (const environment of ['staging', 'production', 'test', 'local', undefined]) {
    const filteredRoutes = filterRoutesByEnvironment(routes, environment)

    assert.deepEqual(filteredRoutes, [
      {
        path: '/system',
        children: [
          { path: 'role', component: 'system/role/index' }
        ]
      }
    ])
  }
})
