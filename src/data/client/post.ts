import type {
  Post,
  PostCreateInput,
  PostPaginator,
  PostQueryOptions,
  QueryOptions,
} from '@/types'
import { API_ENDPOINTS } from './api-endpoints'
import { crudFactory } from './curd-factory'
import { HttpClient } from './http-client'

export const postClient = {
  ...crudFactory<Post, QueryOptions, PostCreateInput>(API_ENDPOINTS.POSTS),
  paginated: ({ name, ...params }: Partial<PostQueryOptions>) => {
    return HttpClient.get<PostPaginator>(API_ENDPOINTS.POSTS, {
      searchJoin: 'and',
      ...params,
      // search: HttpClient.formatSearchParams({ name }),
    })
  },
}
