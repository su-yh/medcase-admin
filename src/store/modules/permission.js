import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import { filterRoutesByEnvironment } from '@/utils/route-environment'
import { handleTree } from '@/utils/ruoyi'

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
            // 保留后端菜单字段，仅补充前端路由树所需的 children
            const routeData = filterRoutesByEnvironment(
              handleTree(res.data.map(route => ({ ...route })), 'id', 'parentId'),
              import.meta.env.VITE_APP_ENV
            )
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

function filterAsyncRouter(asyncRouterMap, root = true) {
  return asyncRouterMap.map(route => {
    const routerRoute = { ...route }
    const routePath = typeof routerRoute.routePath === 'string' ? routerRoute.routePath : ''
    routerRoute.name = routerRoute.routeName
    routerRoute.path = root && !routePath.startsWith('/') ? '/' + routePath : routePath
    routerRoute.hidden = !routerRoute.visible
    routerRoute.meta = {
      title: routerRoute.menuName,
      icon: routerRoute.icon,
      noCache: routerRoute.isCache === '1'
    }
    if (root) {
      routerRoute.component = Layout
    } else if (routerRoute.vueComponentPath) {
      routerRoute.component = loadView(routerRoute.vueComponentPath)
    }
    if (routerRoute.menuType === 'M' && routerRoute.children != null && routerRoute.children.length) {
      routerRoute.children = filterAsyncRouter(routerRoute.children, false)
      routerRoute.alwaysShow = true
      routerRoute.redirect = 'noRedirect'
    } else {
      delete routerRoute['children']
      delete routerRoute['redirect']
    }
    return routerRoute
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
