import { getToken } from '@/utils'
import { resolveResError } from './helpers'
import { useUserStore } from '@/store'

// @ts-ignore
export function reqResolve(config) {
  // Handling requests that do not require a token
  if (config.noNeedToken) {
    return config
  }

  const token = getToken()
  // if (token) {
  //   config.headers.token = config.headers.token || token
  // }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

// @ts-ignore
export function reqReject(error) {
  return Promise.reject(error)
}

// @ts-ignore
export function resResolve(response) {
  const { data, status, statusText } = response
  // if (data?.code !== 200) {
  //   const code = data?.code ?? status
  //   /** Process the corresponding operation based on the code and return the processed message. */
  //   const message = resolveResError(code, data?.msg ?? statusText)
  //   window.$message?.error(message, { keepAliveOnHover: true })
  //   return Promise.reject({ code, message, error: data || response })
  // }
  return Promise.resolve(data)
}

// @ts-ignore
export async function resReject(error) {
  if (!error || !error.response) {
    const code = error?.code
    /** Process the corresponding operation based on the code and return the processed message. */
    const message = resolveResError(code, error.message)
    // @ts-ignore
    window.$message?.error(message)
    return Promise.reject({ code, message, error })
  }
  const { data, status } = error.response

  if (data?.code === 401) {
    try {
      const userStore = useUserStore()
      userStore.logout()
    } catch (error) {
      console.log('resReject error', error)
      return
    }
  }
  // response data returned by the backend
  const code = data?.code ?? status
  const message = resolveResError(code, data?.msg ?? error.message)
  // @ts-ignore
  window.$message?.error(message, { keepAliveOnHover: true })
  return Promise.reject({ code, message, error: error.response?.data || error.response })
}
