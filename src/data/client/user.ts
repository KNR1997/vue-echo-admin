import type {
  ProfileUpdateInput,
  QueryOptions,
  User,
  UserCreateInput,
  UserMeResponse,
  UserPaginator,
  UserQueryOptions,
} from '@/types'
import { API_ENDPOINTS } from './api-endpoints'
import { HttpClient } from './http-client'
import { crudFactory } from './curd-factory'

export const userClient = {
  ...crudFactory<User, QueryOptions, UserCreateInput>(API_ENDPOINTS.USERS),
  paginated: ({ username, email, ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.USERS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ username, email }),
    })
  },
  me: () => {
    return HttpClient.get<UserMeResponse>(API_ENDPOINTS.ME)
  },
}
