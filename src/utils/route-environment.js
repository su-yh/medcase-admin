const MENU_MANAGEMENT_COMPONENT = 'system/menu/index'
const HIDDEN_MENU_ENVIRONMENTS = new Set(['staging', 'production'])

export function filterRoutesByEnvironment(routes, environment) {
  const shouldHideMenuManagement = HIDDEN_MENU_ENVIRONMENTS.has(environment)

  return routes.reduce((filteredRoutes, route) => {
    if (shouldHideMenuManagement && route.component === MENU_MANAGEMENT_COMPONENT) {
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
