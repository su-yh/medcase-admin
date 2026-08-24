import test from 'node:test'
import assert from 'node:assert/strict'
import { filterRoutesByEnvironment } from '../src/utils/route-environment.js'

const routes = [
  {
    path: '/system',
    children: [
      { path: 'role', component: 'system/role/index' },
      { path: 'menu', component: 'system/menu/index' }
    ]
  }
]

test('keeps menu management outside staging and production', () => {
  for (const environment of ['development', 'test', 'local', undefined]) {
    const filteredRoutes = filterRoutesByEnvironment(routes, environment)

    assert.deepEqual(filteredRoutes[0].children, routes[0].children)
  }
})

test('hides menu management in staging and production', () => {
  for (const environment of ['staging', 'production']) {
    const filteredRoutes = filterRoutesByEnvironment(routes, environment)

    assert.deepEqual(filteredRoutes[0].children, [routes[0].children[0]])
  }
})
