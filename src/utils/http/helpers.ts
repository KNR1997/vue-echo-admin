import { useUserStore } from '@/store'

export function addBaseParams(params: any) {
  if (!params.userId) {
    params.userId = useUserStore().userId
  }
}

export function resolveResError(code: number, message: string) {
  switch (code) {
    case 400:
      message = message ?? 'Request parameter error'
      break
    case 401:
      message = message ?? 'Login expired'
      break
    case 403:
      message = message ?? 'permission denied'
      break
    case 404:
      message = message ?? 'The resource or interface does not exist.'
      break
    case 500:
      message = message ?? 'Server exception'
      break
    default:
      message = message ?? `【${code}】: Unknown exception!`
      break
  }
  return message
}
