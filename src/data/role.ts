import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { computedAsync } from '@vueuse/core'
import { roleClient } from './client/role'
import { mapPaginatorData } from '@/utils/data-mappers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Role, RolePaginator, RoleQueryOptions } from '@/types'
import { API_ENDPOINTS } from './client/api-endpoints'

export const useRolesQuery = (options: Partial<RoleQueryOptions>) => {
  const { data, error, isPending } = useQuery<RolePaginator, Error>({
    queryKey: [API_ENDPOINTS.ROLES, options],
    queryFn: ({ queryKey, pageParam }) =>
      roleClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  })
  const roles = computedAsync<Role[]>(() => data.value?.data ?? []) // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value))
  return {
    roles,
    paginationInfo,
    error,
    loading: isPending,
  }
}

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: roleClient.create,

    onSuccess: () => {
      message.success('Created successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLES],
      })
    },
    onError: (error: Error) => {
      console.error('Create Role failed:', error)
      message.error(error.message)
    },
  })
}

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: roleClient.update,
    onSuccess: () => {
      message.success('Updated successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLES],
      })
    },
    onError: (error: Error) => {
      console.error('Update Role failed:', error)
      message.error(error.message)
    },
  })
}

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: roleClient.delete,
    onSuccess: () => {
      message.success('Deleted successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLES],
      })
    },
    onError: (error: Error) => {
      console.error('Delete Role failed:', error)
      message.error(error.message)
    },
  })
}
