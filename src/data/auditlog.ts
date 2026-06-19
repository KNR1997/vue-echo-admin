import { computed } from "vue";
import { computedAsync } from "@vueuse/core";
import { useQuery } from "@tanstack/vue-query";
import { API_ENDPOINTS } from "./client/api-endpoints";
// utils
import { mapPaginatorData } from "@/utils/data-mappers";
// client
import { auditlogClient } from "./client/auditlog";
// types
import type {
  AuditLog,
  AuditLogPaginator,
  AuditLogQueryOptions,
} from "@/types";

export const useAuditLogsQuery = (options: Partial<AuditLogQueryOptions>) => {
  const { data, error, isPending } = useQuery<AuditLogPaginator, Error>({
    queryKey: [API_ENDPOINTS.AUDITLOGS, options],
    queryFn: ({ queryKey, pageParam }) =>
      auditlogClient.paginated(Object.assign({}, queryKey[1], pageParam)),
  });
  const auditLogs = computedAsync<AuditLog[]>(() => data.value?.data ?? []); // todo -> fix
  const paginationInfo = computed(() => mapPaginatorData(data.value));
  return {
    auditLogs,
    paginationInfo,
    error,
    loading: isPending,
  };
};
