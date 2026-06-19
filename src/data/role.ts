import { computed } from "vue";
import { useMessage } from "naive-ui";
import { addDynamicRoutes } from "@/router";
import { computedAsync } from "@vueuse/core";
import { API_ENDPOINTS } from "./client/api-endpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
// clients
import { roleClient } from "./client/role";
// utils
import { mapPaginatorData } from "@/utils/data-mappers";
// types
import type { Role, RolePaginator, RoleQueryOptions } from "@/types";

export const useRolesQuery = (options: Partial<RoleQueryOptions>) => {
  const { data, error, isPending } = useQuery<RolePaginator, Error>({
    queryKey: [API_ENDPOINTS.ROLES, options],
    queryFn: ({ queryKey, pageParam }) =>
      roleClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  });
  const roles = computedAsync<Role[]>(() => data.value?.data ?? []); // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value));
  return {
    roles,
    paginationInfo,
    error,
    loading: isPending,
  };
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: roleClient.create,

    onSuccess: (response) => {
      message.success(response?.message ?? "Created successfully");

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLES],
      });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: roleClient.update,
    onSuccess: (response) => {
      message.success(response?.message ?? "Updated successfully");

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLES],
      });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: roleClient.delete,
    onSuccess: (response) => {
      message.success(response?.message ?? "Deleted successfully");

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLES],
      });
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};

export const useAuthorizeRoleMutation = () => {
  const queryClient = useQueryClient();
  const message = useMessage();

  return useMutation({
    mutationFn: roleClient.authorize,

    onSuccess: async (response) => {
      message.success(response?.message ?? "Role authorized successfully");

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLES],
      });

      // reset dynamic routes
      await addDynamicRoutes();
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });
};
