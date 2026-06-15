import type { Ref } from "vue"
import type { AssetStatus } from "./enum"

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface ApiError {
  code: number
  error: string
  fields?: Record<string, string[]>
}

// -> TODO: Simplify this
export interface MappedPaginatorInfo {
  total: number
  page: number
  pageSize: number
}

export interface GetParams {
  id: string
}

export interface QueryOptions {
  language: string
  limit?: Ref<number, number> | number
  page?: Ref<number, number> | number
  orderBy?: string
  sortedBy?: SortOrder
  page_size?:  Ref<number, number> | number
}

export interface PaginatorInfo<T> {
  limit: number
  page: number
  sort: string
  total_rows: number
  total_pages: number
  rows: T[]
  data: T[]
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  exp: string
}

export interface Course {
  id: string
  ID: string // todo -> check this
  name: string
  slug: string
}

export interface CourseCreateInput {
  name: string
  slug: string
}

export interface User {
  id: string
  username: string
  email: string
  is_active: boolean
  last_login: Date
  is_superuser: boolean
  roles: Role[]
  department: Department | null
}

export interface UserCreateInput {
  username: string
  email: string | null
  password: string
  is_superuser: boolean
  is_active: boolean
  role_ids: number[]
  dept_id: string | null
}

export interface Manufacturer {
  id: string
  name: string
  email: string
}

export interface ManufacturerCreateInput {
  name: string
  email: string
}

export interface Supplier {
  id: string
  name: string
  email: string
}

export interface SupplierCreateInput {
  name: string
}

export interface Model {
  id: string
  name: string
  categoryId: string
  manufacturerId: string
  modelNumber: string
}

export interface ModelCreateInput {
  name: string
  categoryId: string
  manufacturerId: string
  modelNumber: string
}

export interface Post {
  id: string
  content: string
  title: string
}

export interface Department {
  id: string
}

export interface Api {
  id: string
  path: string
  method: string
  summary: string
  tags: string
}

export interface ApiCreateInput {
  path: string
  method: string
  summary: string
  tags: string
}

export interface Menu {
  id: string
  menu_type: string
  parent_id: number
  name: string
  path: string
  component: string
  redirect: string
  icon: string
  order: string
  is_hidden: boolean
  keepalive: boolean
}

export interface MeResponse {
  id: number
  username: string
  email: string
  avatar: string
  roles: string
  is_superuser: boolean
  is_active: boolean
}

export interface MenuCreateInput {
  menu_type: string
  parent_id: number
  name: string
  path: string
  component: string
  redirect: string
  icon: string
  order: string
  is_hidden: boolean
  keepalive: boolean
}

export interface Role {
  id: number
  name: string
  desc: string
  created_at: string
  menu_ids: number[]
  apis: Api[]
}

export interface RoleCreateInput {
  name: string
  desc: string
}

export interface AuthorizeRoleInput {
  id: number
  menu_ids: number[]
  api_ids: number[]
}

export interface PostCreateInput {
  title: string
  content: string
}

export interface Asset {
  id: string
  name: string
  tag: string
  serialNumber: string
  categoryId: string
  status: AssetStatus
  description: string
  model: Model
}

export interface AssetCreateInput {
  name: string
  tag: string
  serialNumber: string
  description: string
  status: string
  modelId: string
}

export interface AssetCheckoutInput {
  assetName: string
  assetId: number
  userId: number
  checkoutDate: string
  expectedCheckinDate: string | null
  notes: string
}

export interface AssetCheckinInput {
  assetName: string
  assetId: number
  checkinDate: string
  status: AssetStatus
  notes: string
}

export interface Category {
  id: string
  name: string
  serialNumber: string
}

export interface CategoryCreateInput {
  name: string
  description: string | null
}

export interface Department {
  id: string
  name: string
  notes: string
}

export interface DepartmentCreateInput {
  name: string
  desc: string
}

export interface ProfileUpdateInput {
  username: string
  email: string
}

export interface UserMeResponse {
  data: {
    id: number
    username: string
    email: string
    role: string
  }
}

export interface Quiz {
  id: number
  ID: number
  courseId: number
  name: string
  code: string
  date: number
}

export interface QuizCreateInput {
  courseId: number
  name: string
  dateTime: string
}

export interface CourseListResponse {
  list: Course[]
  total: number
  page: number
  pageSize: number
}

export interface QuizListResponse {
  list: Quiz[]
  total: number
  page: number
  pageSize: number
}

export interface CourseQueryOptions extends QueryOptions {
  name: string
}

export interface AssetQueryOptions extends QueryOptions {
  name: string
}

export interface PostQueryOptions extends QueryOptions {
  title: string
}

export interface PostQueryOptions extends QueryOptions {
  name: string
}

export interface SupplierQueryOptions extends QueryOptions {
  name: string
}

export interface ModelQueryOptions extends QueryOptions {
  name: string
}

export interface ManufacturerQueryOptions extends QueryOptions {
  name: string
}
export interface CategoryQueryOptions extends QueryOptions {
  name: string
}

export interface DepartmentQueryOptions extends QueryOptions {
  name: Ref<string, string>
}

export interface UserQueryOptions extends QueryOptions {
  username: Ref<string, string>
  email: Ref<string, string>
  dept_id: Ref<number | null, number | null>
}

export interface QuizQueryOptions extends QueryOptions {
  name: string
}

export interface ApiQueryOptions extends QueryOptions {
  path: Ref<string, string>
  tags: Ref<string, string>
}

export interface RoleQueryOptions extends QueryOptions {
  name: Ref<string, string>
}

export interface MenuQueryOptions extends QueryOptions {
  name: string
}

export interface CoursePaginator extends PaginatorInfo<Course> {}

export interface AssetPaginator extends PaginatorInfo<Asset> {}

export interface ModelPaginator extends PaginatorInfo<Model> {}

export interface ManufacturerPaginator extends PaginatorInfo<Manufacturer> {}

export interface SupplierPaginator extends PaginatorInfo<Supplier> {}

export interface CategoryPaginator extends PaginatorInfo<Category> {}

export interface DepartmentPaginator extends PaginatorInfo<Department> {}

export interface PostPaginator extends PaginatorInfo<Post> {}

export interface ApiPaginator extends PaginatorInfo<Api> {}

export interface QuizPaginator extends PaginatorInfo<Quiz> {}

export interface RolePaginator extends PaginatorInfo<Role> {}

export interface MenuPaginator extends PaginatorInfo<Menu> {}

export interface UserPaginator extends PaginatorInfo<User> {}
