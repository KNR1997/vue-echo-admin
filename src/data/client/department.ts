import type {
  Department,
  DepartmentCreateInput,
  DepartmentPaginator,
  DepartmentQueryOptions,
  QueryOptions,
} from '@/types'
import { API_ENDPOINTS } from './api-endpoints'
import { crudFactory } from './curd-factory'
import { HttpClient } from './http-client'

export const departmentClient = {
  ...crudFactory<Department, QueryOptions, DepartmentCreateInput>(API_ENDPOINTS.DEPARTMENTS),
  paginated: ({ name, ...params }: Partial<DepartmentQueryOptions>) => {
    return HttpClient.get<DepartmentPaginator>(API_ENDPOINTS.DEPARTMENTS, {
      searchJoin: 'and',
      ...params,
      // @ts-ignore
      search: HttpClient.formatSearchParams({ name }),
    })
  },
}
