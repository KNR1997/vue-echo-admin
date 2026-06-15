import { HttpClient } from './http-client'
import { crudFactory } from './curd-factory'
import { API_ENDPOINTS } from './api-endpoints'
import type { AuthorizeRoleInput, QueryOptions, Role, RoleCreateInput, RolePaginator, RoleQueryOptions } from '@/types'

export const roleClient = {
  ...crudFactory<Role, QueryOptions, RoleCreateInput>(API_ENDPOINTS.ROLES),
  paginated: ({ name, ...params }: Partial<RoleQueryOptions>) => {
    return HttpClient.get<RolePaginator>(API_ENDPOINTS.ROLES, {
      searchJoin: 'and',
      ...params,
      // @ts-ignore
      search: HttpClient.formatSearchParams({ name }),
    })
  },
  authorize: (data: AuthorizeRoleInput) => {
    return HttpClient.post(`${API_ENDPOINTS.ROLES}/${data.id}/authorize`, data)
  },
}
