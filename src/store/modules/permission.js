import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import { filterRoutesByEnvironment } from '@/utils/route-environment'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],
      defaultRoutes: [],
      topbarRouters: [],
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes) {
        this.routes = routes
      },
      setDefaultRoutes(routes) {
        this.defaultRoutes = routes
      },
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      generateRoutes() {
        return new Promise(resolve => {
          // 向后端请求路由数据
          getRouters().then(res => {
            // 按环境过滤掉一些路由
            const routeData = filterRoutesByEnvironment(normalizeBackendRoutes(res.data), import.meta.env.VITE_APP_ENV)
            const sdata = JSON.parse(JSON.stringify(routeData))
            const rdata = JSON.parse(JSON.stringify(routeData))
            const defaultData = JSON.parse(JSON.stringify(routeData))
            const sidebarRoutes = filterAsyncRouter(sdata)
            const rewriteRoutes = filterAsyncRouter(rdata)
            const defaultRoutes = filterAsyncRouter(defaultData)
            const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
            asyncRoutes.forEach(route => { router.addRoute(route) })
            this.setRoutes(constantRoutes.concat(rewriteRoutes))
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
            this.setDefaultRoutes(constantRoutes.concat(sidebarRoutes))
            this.setTopbarRoutes(defaultRoutes)
            resolve(rewriteRoutes)
          })
        })
      }
    }
  })

// 遍历后台传来的路由字符串，转换为组件对象
function normalizeBackendRoutes(routes) {
  return routes.map(route => {
    const normalized = {
      ...route,
      name: route.routeName,
      path: route.routePath,
      component: route.vueComponentPath
    }
    if (Array.isArray(route.children)) {
      normalized.children = normalizeBackendRoutes(route.children)
    }
    return normalized
  })
}

function filterAsyncRouter(asyncRouterMap, root = true) {
  return asyncRouterMap.filter(route => {
    if (root) {
      route.path = route.path.startsWith('/') ? route.path : '/' + route.path
      route.component = Layout
    } else if (route.component) {
      route.component = loadView(route.component)
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, false)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default usePermissionStore
