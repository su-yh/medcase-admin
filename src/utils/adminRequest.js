import axios from 'axios'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams } from '@/utils/ruoyi'
import cache from '@/plugins/cache'
import useUserStore from '@/store/modules/user'

// 是否显示重新登录
export let isRelogin = { show: false }

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const adminRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})

function getHttpStatusMessage(status) {
  return errorCode[status] || (status >= 500 ? '服务器异常，请稍后再试' : '请求失败，请稍后再试')
}

adminRequest.interceptors.request.use(config => {
  const isToken = (config.headers || {}).isToken === false
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  const interval = (config.headers || {}).interval || 1000

  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }

  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }

  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length
    const limitSize = 5 * 1024 * 1024

    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
      return config
    }

    const sessionObj = cache.session.getJSON('adminRequestSessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('adminRequestSessionObj', requestObj)
    } else {
      const s_url = sessionObj.url
      const s_data = sessionObj.data
      const s_time = sessionObj.time
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交'
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('adminRequestSessionObj', requestObj)
      }
    }
  }

  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

adminRequest.interceptors.response.use(res => {
    const payload = res.data

    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return payload
    }

    if (typeof payload === 'string') {
      ElMessage({ message: payload, type: 'error' })
      return Promise.reject(new Error(payload))
    }

    const code = payload?.code
    const msg = errorCode[code] || payload?.msg || errorCode['default']

    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
          isRelogin.show = false
          useUserStore().logOut().then(() => {
            location.href = '/index'
          })
        }).catch(() => {
          isRelogin.show = false
        })
      }
      return Promise.reject(new Error('无效的会话，或者会话已过期，请重新登录。'))
    } else if (code === 0) {
      return Promise.resolve(payload.data)
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    } else {
      ElNotification.error({ title: msg })
      const error = new Error(msg)
      if (code !== undefined && code !== null) {
        error.code = code
      }
      return Promise.reject(error)
    }
  },
  error => {
    console.log('err' + error)
    const status = error.response?.status
    if (status === 401 || error.response?.data?.code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
          isRelogin.show = false
          useUserStore().logOut().then(() => {
            location.href = '/index'
          })
        }).catch(() => {
          isRelogin.show = false
        })
      }
      return Promise.reject(new Error('无效的会话，或者会话已过期，请重新登录。'))
    }
    let message = error.response?.data?.msg || getHttpStatusMessage(status)
    if (!status && error.message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (!status && error.message?.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (!status && error.message?.includes('Request failed with status code')) {
      message = '系统接口' + error.message.slice(-3) + '异常'
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export default adminRequest
