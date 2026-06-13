import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { computedAsync } from '@vueuse/core'
import { menuClient } from './client/menu'
import { mapPaginatorData } from '@/utils/data-mappers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Menu, MenuPaginator, MenuQueryOptions } from '@/types'
import { API_ENDPOINTS } from './client/api-endpoints'
import { baseClient } from './client/base'

export const useUserMenusQuery = () => {
  const { data, error, isPending } = useQuery<MenuPaginator, Error>({
    queryKey: [API_ENDPOINTS.BASE],
    queryFn: () =>
      baseClient.getUserMenus(),
  })
  const menus = computedAsync<Menu[]>(() => data.value?.data ?? []) // todo -> fix
  return {
    menus,
    error,
    loading: isPending,
  }
}