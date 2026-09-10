const MENU_MANAGEMENT_COMPONENT = 'system/menu/index'
const HIDDEN_MENU_COMPONENTS = new Set([
  MENU_MANAGEMENT_COMPONENT,
  'system/dict/index',
  'system/config/index'
])
const HIDDEN_MENU_PATHS = new Set(['monitor'])
const HIDDEN_MENU_TITLES = new Set(['系统监控', '日志管理'])

/**
 * 就是将一些非开发环境要隐藏的菜单剔除掉，也就是隐藏起来不显示在菜单中
 *
 * @param routes
 * @param environment
 * @returns {*}
 */
export function filterRoutesByEnvironment(routes, environment) {
  const shouldHideRestrictedMenus = environment !== 'development'

  return routes.reduce((filteredRoutes, route) => {
    if (shouldHideRestrictedMenus && isRestrictedMenu(route)) {
      return filteredRoutes
    }

    const filteredRoute = { ...route }
    if (Array.isArray(route.children)) {
      filteredRoute.children = filterRoutesByEnvironment(route.children, environment)
    }

    filteredRoutes.push(filteredRoute)
    return filteredRoutes
  }, [])
}

function isRestrictedMenu(route) {
  const path = typeof route.routePath === 'string' ? route.routePath.replace(/^\/|\/$/g, '') : ''
  const title = route.menuName

  return HIDDEN_MENU_COMPONENTS.has(route.vueComponentPath)
    || HIDDEN_MENU_PATHS.has(path)
    || HIDDEN_MENU_TITLES.has(title)
}
