export const USER_NOT_LOGIN_CODE = 'error.code.user.not.login'

export function isBizUnauthorized(response) {
  return response?.status === 401 || response?.data?.code === USER_NOT_LOGIN_CODE
}
