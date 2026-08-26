export const BIZ_SUCCESS_CODE = 0

export function createBizError(response, fallbackMessage = '接口请求失败') {
  const payload = response?.data
  const payloadCode = payload && typeof payload === 'object' ? payload.code : undefined
  const code = response?.status >= 400 ? response.status : payloadCode ?? response?.status
  const message = typeof payload === 'string'
    ? payload
    : payload?.msg || fallbackMessage
  const error = new Error(message)

  if (code !== undefined && code !== null) {
    error.code = code
  }
  if (response?.status !== undefined && response?.status !== null) {
    error.status = response.status
  }

  return error
}

export function unwrapBizResponse(response) {
  const payload = response?.data

  if (payload?.code === BIZ_SUCCESS_CODE) {
    return payload.data
  }

  throw createBizError(response)
}
