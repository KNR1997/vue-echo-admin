import type {
  Department,
  DepartmentCreateInput,
  DepartmentPaginator,
  DepartmentQueryOptions,
  Menu,
  QueryOptions,
} from '@/types'
import { API_ENDPOINTS } from './api-endpoints'
import { crudFactory } from './curd-factory'
import { HttpClient } from './http-client'

export const baseClient = {
  ...crudFactory<Department, QueryOptions, DepartmentCreateInput>(API_ENDPOINTS.DEPARTMENTS),
  getUserMenus: () => {
    return HttpClient.get<Menu[]>(`${API_ENDPOINTS.BASE}/usermenu`)
  }
}
