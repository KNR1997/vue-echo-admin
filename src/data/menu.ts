import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { computedAsync } from '@vueuse/core'
import { menuClient } from './client/menu'
import { mapPaginatorData } from '@/utils/data-mappers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Menu, MenuPaginator, MenuQueryOptions } from '@/types'
import { API_ENDPOINTS } from './client/api-endpoints'

export const useMenusQuery = (options: Partial<MenuQueryOptions>) => {
  const { data, error, isPending } = useQuery<MenuPaginator, Error>({
    queryKey: [API_ENDPOINTS.MENUS, options],
    queryFn: ({ queryKey, pageParam }) =>
      menuClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  })
  const menus = computedAsync<Menu[]>(() => data.value?.data ?? []) // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value))
  return {
    menus,
    paginationInfo,
    error,
    loading: isPending,
  }
}

export const useCreateMenuMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: menuClient.create,

    onSuccess: () => {
      message.success('Created successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MENUS],
      })
    },
    onError: (error: Error) => {
      console.error('Create Menu failed:', error)
      message.error(error.message)
    },
  })
}

export const useUpdateMenuMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: menuClient.update,
    onSuccess: () => {
      message.success('Updated successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MENUS],
      })
    },
    onError: (error: Error) => {
      console.error('Update Menu failed:', error)
      message.error(error.message)
    },
  })
}

export const usePatchMenuMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: menuClient.patch,
    onSuccess: () => {
      message.success('Updated successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MENUS],
      })
    },
    onError: (error: Error) => {
      console.error('Update Menu failed:', error)
      message.error(error.message)
    },
  })
}

export const useDeleteMenuMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: menuClient.delete,
    onSuccess: () => {
      message.success('Deleted successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MENUS],
      })
    },
    onError: (error: Error) => {
      console.error('Delete Menu failed:', error)
      message.error(error.message)
    },
  })
}
