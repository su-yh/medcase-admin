export const BIZ_SUCCESS_CODE = 0

export function unwrapBizResponse(response) {
  const payload = response?.data

  if (payload?.code === BIZ_SUCCESS_CODE) {
    return payload.data
  }

  const error = new Error(payload?.msg || '接口请求失败')
  if (payload?.code !== undefined && payload?.code !== null) {
    error.code = payload.code
  }
  if (response?.status !== undefined && response?.status !== null) {
    error.status = response.status
  }
  throw error
}
