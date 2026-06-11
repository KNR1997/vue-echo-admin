import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { computedAsync } from '@vueuse/core'
import { apiClient } from './client/api'
import { API_ENDPOINTS } from './client/api-endpoints'
import { mapPaginatorData } from '@/utils/data-mappers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Api, ApiPaginator, ApiQueryOptions } from '@/types'

export const useApisQuery = (options: Partial<ApiQueryOptions>) => {
  const { data, error, isPending } = useQuery<ApiPaginator, Error>({
    queryKey: [API_ENDPOINTS.APIS, options],
    queryFn: ({ queryKey, pageParam }) =>
      apiClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  })
  const apis = computedAsync<Api[]>(() => data.value?.data ?? []) // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value))
  return {
    apis,
    paginationInfo,
    error,
    loading: isPending,
  }
}

export const useCreateApiMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: apiClient.create,

    onSuccess: () => {
      message.success('Created successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.APIS],
      })
    },
    onError: (error: Error) => {
      console.error('Create Api failed:', error)
      message.error(error.message)
    },
  })
}

export const useUpdateApiMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: apiClient.update,
    onSuccess: () => {
      message.success('Updated successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.APIS],
      })
    },
    onError: (error: Error) => {
      console.error('Update Api failed:', error)
      message.error(error.message)
    },
  })
}

export const useDeleteApiMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: apiClient.delete,
    onSuccess: () => {
      message.success('Deleted successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.APIS],
      })
    },
    onError: (error: Error) => {
      console.error('Delete Api failed:', error)
      message.error(error.message)
    },
  })
}
