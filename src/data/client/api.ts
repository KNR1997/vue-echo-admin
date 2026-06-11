import type {
  Api,
  ApiCreateInput,
  ApiPaginator,
  ApiQueryOptions,
  QueryOptions,
} from '@/types'
import { API_ENDPOINTS } from './api-endpoints'
import { crudFactory } from './curd-factory'
import { HttpClient } from './http-client'

export const apiClient = {
  ...crudFactory<Api, QueryOptions, ApiCreateInput>(API_ENDPOINTS.APIS),
  paginated: ({ path, tags, ...params }: Partial<ApiQueryOptions>) => {
    return HttpClient.get<ApiPaginator>(API_ENDPOINTS.APIS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ path, tags }),
    })
  },
}
