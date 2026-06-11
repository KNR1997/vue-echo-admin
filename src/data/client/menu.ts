import type {
  Menu,
  MenuCreateInput,
  MenuPaginator,
  MenuQueryOptions,
  QueryOptions,
} from '@/types'
import { crudFactory } from './curd-factory'
import { HttpClient } from './http-client'
import { API_ENDPOINTS } from './api-endpoints'

export const menuClient = {
  ...crudFactory<Menu, QueryOptions, MenuCreateInput>(API_ENDPOINTS.MENUS),
  paginated: ({ name, ...params }: Partial<MenuQueryOptions>) => {
    return HttpClient.get<MenuPaginator>(API_ENDPOINTS.MENUS, {
      searchJoin: 'and',
      ...params,
      // search: HttpClient.formatSearchParams({ name }),
    })
  },
}
