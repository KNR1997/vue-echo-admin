import { HttpClient } from "./http-client";
// types
import type { ApiReponse, GetParams, PaginatorInfo } from "@/types";

export function crudFactory<Type, QueryParams, InputType>(endpoint: string) {
  return {
    all(params: QueryParams) {
      return HttpClient.get<Type[]>(endpoint, params);
    },
    paginated(params: QueryParams) {
      return HttpClient.get<PaginatorInfo<Type>>(endpoint, params);
    },
    get({ id }: GetParams) {
      return HttpClient.get<Type>(`${endpoint}/${id}`);
    },
    create(data: InputType) {
      return HttpClient.post<ApiReponse<Type>>(endpoint, data);
    },
    update({ id, ...input }: Partial<InputType> & { id: number }) {
      return HttpClient.put<ApiReponse<Type>>(`${endpoint}/${id}`, input);
    },
    patch({ id, ...input }: Partial<InputType> & { id: number }) {
      return HttpClient.patch<ApiReponse<Type>>(`${endpoint}/${id}`, input);
    },
    delete({ id }: { id: number }) {
      return HttpClient.delete<ApiReponse<null>>(`${endpoint}/${id}`);
    },
  };
}
