import test from 'node:test'
import assert from 'node:assert/strict'
import { filterRoutesByEnvironment } from '../src/utils/route-environment.js'

const routes = [
  {
    routePath: '/system',
    menuName: '系统管理',
    children: [
      { routePath: 'role', vueComponentPath: 'system/role/index', menuName: '角色管理' },
      { routePath: 'menu', vueComponentPath: 'system/menu/index', menuName: '菜单管理' },
      {
        routePath: 'log',
        menuName: '日志管理',
        children: [
          { routePath: 'operlog', vueComponentPath: 'monitor/operlog/index' },
          { routePath: 'logininfor', vueComponentPath: 'monitor/logininfor/index' }
        ]
      },
      { routePath: 'dict', vueComponentPath: 'system/dict/index', menuName: '字典管理' },
      { routePath: 'config', vueComponentPath: 'system/config/index', menuName: '参数设置' }
    ]
  },
  {
    routePath: 'monitor',
    menuName: '系统监控',
    children: [
      { routePath: 'online', vueComponentPath: 'monitor/online/index' },
      { routePath: 'server', vueComponentPath: 'monitor/server/index' }
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
        routePath: '/system',
        menuName: '系统管理',
        children: [
          { routePath: 'role', vueComponentPath: 'system/role/index', menuName: '角色管理' }
        ]
      }
    ])
  }
})
