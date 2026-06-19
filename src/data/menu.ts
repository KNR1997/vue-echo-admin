import { computed } from "vue";
import { useMessage } from "naive-ui";
import { addDynamicRoutes } from "@/router";
import { computedAsync } from "@vueuse/core";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
// clients
import { menuClient } from "./client/menu";
// utils
import { mapPaginatorData } from "@/utils/data-mappers";
// types
import type { Menu, MenuPaginator, MenuQueryOptions } from "@/types";

export const useMenusQuery = (options: Partial<MenuQueryOptions>) => {
  const { data, error, isPending } = useQuery<MenuPaginator, Error>({
    queryKey: [API_ENDPOINTS.MENUS, options],
    queryFn: ({ queryKey, pageParam }) =>
      menuClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  });
  const menus = computedAsync<Menu[]>(() => data.value?.data ?? []); // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value));
  return {
    menus,
    paginationInfo,
    error,
    loading: isPending,
  };
};

export const useCreateMenuMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: menuClient.create,

    onSuccess: (response) => {
      message.success(response?.message ?? "Created successfully");

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MENUS],
      });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

export const useUpdateMenuMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: menuClient.update,
    onSuccess: async (response) => {
      message.success(response?.message ?? "Updated successfully");

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MENUS],
      });

      // reset dynamic routes
      await addDynamicRoutes();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

export const usePatchMenuMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: menuClient.patch,
    onSuccess: (response) => {
      message.success(response?.message ?? "Updated successfully");

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MENUS],
      });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

export const useDeleteMenuMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: menuClient.delete,
    onSuccess: (response) => {
      message.success(response?.message ?? "Deleted successfully");

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MENUS],
      });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};
