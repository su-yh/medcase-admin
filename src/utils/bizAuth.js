export function isBizUnauthorized(response) {
  return response?.status === 401 || response?.data?.code === 401
}
