import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { unwrapBizResponse } from '@/utils/bizResponse'

const bizRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

bizRequest.interceptors.request.use(config => {
  const isToken = (config.headers || {}).isToken === false

  if (getToken() && !isToken) {
    config.headers.Authorization = 'Bearer ' + getToken()
  }

  return config
}, error => Promise.reject(error))

bizRequest.interceptors.response.use(response => {
  if (response.config?.responseType === 'blob'
      || response.config?.responseType === 'arraybuffer') {
    return response.data
  }

  try {
    return unwrapBizResponse(response)
  } catch (error) {
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
}, error => {
  const responseData = error.response?.data
  const message = responseData?.msg || error.message || '接口请求失败'
  const normalizedError = new Error(message)

  if (responseData?.code !== undefined && responseData?.code !== null) {
    normalizedError.code = responseData.code
  } else if (error.response?.status !== undefined) {
    normalizedError.code = error.response.status
  }

  ElMessage.error(message)
  return Promise.reject(normalizedError)
})

export default bizRequest
