import type {
  AuditLog,
  AuditLogCreateInput,
  AuditLogPaginator,
  AuditLogQueryOptions,
  QueryOptions,
} from "@/types";
import { API_ENDPOINTS } from "./api-endpoints";
import { crudFactory } from "./curd-factory";
import { HttpClient } from "./http-client";

export const auditlogClient = {
  ...crudFactory<AuditLog, QueryOptions, AuditLogCreateInput>(
    API_ENDPOINTS.AUDITLOGS,
  ),
  paginated: ({ name, username, module, summary, path, status, method,  ...params }: Partial<AuditLogQueryOptions>) => {
    return HttpClient.get<AuditLogPaginator>(API_ENDPOINTS.AUDITLOGS, {
      searchJoin: "and",
      ...params,
      method,
      // @ts-ignore
      search: HttpClient.formatSearchParams({ name, username, module,  summary, path, status }),
    });
  },
};
