import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { toLogin } from '@/utils/auth/auth'
import { removeToken } from '@/utils/auth/token'
import api from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as any,
  }),
  getters: {
    userId: (state) => state.userInfo?.userId ?? '',
    username: (state) => state.userInfo?.username ?? '',
    email: (state) => state.userInfo?.email ?? '',
    avatar: (state) => state.userInfo?.avatar ?? '',
    role: (state) => state.userInfo?.role ?? 'user',
    // isSuperUser() {
    //   return this.userInfo?.is_superuser
    // },
    // isActive() {
    //   return this.userInfo?.is_active
    // },
  },
  actions: {
      async getUserInfo() {
      try {
        const res = await api.fetchMe()
        // @ts-ignore
        if (res.code === 401) {
          this.logout()
          return
        }
        // @ts-ignore
        const { id, username, email, avatar, roles, is_superuser, is_active } = res
        this.userInfo = { userId: id, username, email, avatar, roles, is_superuser, is_active }
        return res.data
      } catch (error) {
        return error
      }
    },
    async logout() {
      removeToken()
      resetRouter()
      this.$reset()
      toLogin()
      //   const { resetTags } = useTagsStore()
      //   const { resetPermission } = usePermissionStore()
      //   resetTags()
      //   resetPermission()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
