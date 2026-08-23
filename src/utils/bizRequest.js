import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/auth'
import { unwrapBizResponse } from '@/utils/bizResponse'
import useUserStore from '@/store/modules/user'
import { isBizUnauthorized } from '@/utils/bizAuth'

const isRelogin = { show: false }

function rejectUnauthorized(message) {
  if (!isRelogin.show) {
    isRelogin.show = true
    ElMessageBox.confirm(
      '登录状态已过期，您可以继续留在该页面，或者重新登录',
      '系统提示',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      isRelogin.show = false
      return useUserStore().logOut().finally(() => {
        location.href = '/index'
      })
    }).catch(() => {
      isRelogin.show = false
    })
  }

  const error = new Error(message || '登录状态已过期，请重新登录')
  error.code = 401
  return Promise.reject(error)
}

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
  if (isBizUnauthorized(response)) {
    return rejectUnauthorized(response.data?.msg)
  }

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

  if (isBizUnauthorized({
    status: error.response?.status,
    data: responseData
  })) {
    return rejectUnauthorized(message)
  }

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
