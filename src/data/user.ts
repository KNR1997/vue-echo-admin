import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { computedAsync } from '@vueuse/core'
import { useUserStore } from '@/store'
import { userClient } from './client/user'
import type { User, UserPaginator, UserQueryOptions } from '@/types'
import { API_ENDPOINTS } from './client/api-endpoints'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { mapPaginatorData } from '@/utils/data-mappers'

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const message = useMessage()
  const userStore = useUserStore()

  return useMutation({
    mutationFn: userClient.update,
    onSuccess: async () => {
      message.success('Updated successfully')
      // fetch user detail (username, email)
      const me = await fetchMe()
      // store details global state
      userStore.setUserInfo(me.data)
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PROFILE],
      })
    },
  })
}

export const fetchMe = () => {
  return userClient.me()
}

export const useUsersQuery = (options: Partial<UserQueryOptions>) => {
  const { data, error, isPending } = useQuery<User[], Error>({
    queryKey: [API_ENDPOINTS.USERS, options],
    queryFn: () => userClient.all(options as UserQueryOptions),
  })
  // @ts-ignore
  const users = computed<User[]>(() => data.value ?? []) // todo -> fix
  return {
    users,
    error,
    loading: isPending,
  }
}

export const useUserPaginatedQuery = (options: Partial<UserQueryOptions>) => {
  const { data, error, isPending } = useQuery<UserPaginator, Error>({
    queryKey: [API_ENDPOINTS.USERS, options],
    queryFn: ({ queryKey, pageParam }) =>
      userClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  })
  // @ts-ignore
  const users = computedAsync<User[]>(() => data.value?.data ?? []) // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value))
  return {
    users,
    paginationInfo,
    error,
    loading: isPending,
  }
}

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: userClient.create,

    onSuccess: () => {
      message.success('Created successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USERS],
      })
    },
    onError: (error: Error) => {
      console.error('Create user failed:', error)
      message.error(error.message)
    },
  })
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: userClient.update,
    onSuccess: () => {
      message.success('Updated successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USERS],
      })
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: userClient.delete,
    onSuccess: () => {
      message.success('Deleted successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USERS],
      })
    },
    onError: (error: Error) => {
      console.error('Delete User failed:', error)
      message.error(error.message)
    },
  })
}
