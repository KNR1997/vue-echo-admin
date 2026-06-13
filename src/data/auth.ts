import { useMessage } from "naive-ui";
import { fetchMe } from "./user";
import { useUserStore } from "@/store";
import { authClient } from "./client/auth";
import { setToken } from "@/utils/auth/token";
import { useMutation } from "@tanstack/vue-query";
import type { LoginInput, AuthResponse } from "@/types";
import { nextTick } from "vue";
import api from "@/api";

export function useLogin() {
  const message = useMessage()

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: authClient.login,
    onSuccess: async (response) => {
      // Set token synchronously
      setToken(response.accessToken)
      
      // Ensure token is set before fetching (add small delay if needed)
      await nextTick() // Only if using Vue reactivity
      
      // Fetch user details
      const me = await api.fetchMe()
      
      const userStore = useUserStore()
      userStore.setUserInfo({
        userId: me.id,
        username: me.username,
        email: me.email
      })
    },
    onError: (error: any) => {
      message.error(error.message)
      console.log(error.fields)
    },
  })
}
