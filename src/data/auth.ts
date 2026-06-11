import { useMessage } from 'naive-ui'
import { fetchMe } from './user'
import { useUserStore } from '@/store'
import { authClient } from './client/auth'
import { setToken } from '@/utils/auth/token'
import { useMutation } from '@tanstack/vue-query'
import type { LoginInput, AuthResponse } from '@/types'

export function useLogin() {
  const message = useMessage()

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: authClient.login,
    onSuccess: async (response) => {
      setToken(response.accessToken)
      // fetch user detail (username, email)
      // const me = await fetchMe()
      // store details global state
      const userStore = useUserStore()
      userStore.setUserInfo({
        userId: 1,
        username: "test",
        email: "test@gmail.com"
      })
    },
    onError: (error: any) => {
      message.error(error.message)
      console.log(error.fields)
    },
  })
}
