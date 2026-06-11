import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { computedAsync } from '@vueuse/core'
import { departmentClient } from './client/department'
import { API_ENDPOINTS } from './client/api-endpoints'
import { mapPaginatorData } from '@/utils/data-mappers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Department, DepartmentPaginator, DepartmentQueryOptions } from '@/types'

export const useDepartmentsQuery = (options: Partial<DepartmentQueryOptions>) => {
  const { data, error, isPending } = useQuery<DepartmentPaginator, Error>({
    queryKey: [API_ENDPOINTS.DEPARTMENTS, options],
    queryFn: ({ queryKey, pageParam }) =>
      departmentClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  })
  const departments = computedAsync<Department[]>(() => data.value?.data ?? []) // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value))
  return {
    departments,
    paginationInfo,
    error,
    loading: isPending,
  }
}

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: departmentClient.create,

    onSuccess: () => {
      message.success('Created successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENTS],
      })
    },
    onError: (error: Error) => {
      console.error('Create Department failed:', error)
      message.error(error.message)
    },
  })
}

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: departmentClient.update,
    onSuccess: () => {
      message.success('Updated successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENTS],
      })
    },
    onError: (error: Error) => {
      console.error('Update Department failed:', error)
      message.error(error.message)
    },
  })
}

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: departmentClient.delete,
    onSuccess: () => {
      message.success('Deleted successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.DEPARTMENTS],
      })
    },
    onError: (error: Error) => {
      console.error('Delete Department failed:', error)
      message.error(error.message)
    },
  })
}
