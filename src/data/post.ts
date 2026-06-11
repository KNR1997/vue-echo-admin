import { computed } from 'vue'
import { computedAsync } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import { postClient } from './client/post'
import { API_ENDPOINTS } from './client/api-endpoints'
import { mapPaginatorData } from '@/utils/data-mappers'
import type { Post, PostPaginator, PostQueryOptions } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

// export const usePostsQuery = (options: Partial<PostQueryOptions>) => {
//   const { data, error, isPending } = useQuery<Post[], Error>({
//     queryKey: [API_ENDPOINTS.POSTS, options],
//     queryFn: () => postClient.all(options as AssetQueryOptions),
//   })
//   // @ts-ignore
//   const posts = computed<Post[]>(() => data.value ?? []) // todo -> fix
//   return {
//     posts,
//     error,
//     loading: isPending,
//   }
// }

export const usePostsQuery = (options: Partial<PostQueryOptions>) => {
  const { data, error, isPending } = useQuery<PostPaginator, Error>({
    queryKey: [API_ENDPOINTS.POSTS, options],
    queryFn: ({ queryKey, pageParam }) =>
      postClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  })
  const posts = computedAsync<Post[]>(() => data.value?.data ?? []) // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value))
  return {
    posts,
    paginationInfo,
    error,
    loading: isPending,
  }
}

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: postClient.create,

    onSuccess: () => {
      message.success('Created successfully')
    //   router.push('/assets')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSTS],
      })
    },
    onError: (error: Error) => {
      console.error('Create asset failed:', error)
    },
  })
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: postClient.update,
    onSuccess: () => {
      message.success('Updated successfully')
    //   router.push('/assets')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSTS],
      })
    },
  })
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()
  const message = useMessage()

  return useMutation({
    mutationFn: postClient.delete,
    onSuccess: () => {
      message.success('Deleted successfully')

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.POSTS],
      })
    },
  })
}