import type { Menu, MeResponse, RolePaginator } from "@/types";
import { request } from "@/utils";

export default {
  getUserMenu: () => request.get<Menu[]>("/base/usermenu"),
  fetchMe: () => request.get<MeResponse>("/base/me"),
  profileUpdate: (data: { username: string; email: string }) =>
    request.post("/base/profileUpdate", data),
  passwordUpdate: (data: { oldPassword: string; newPassword: string }) =>
    request.post("/base/passwordUpdate", data),
  getRoleList: (params = {}) => request.get<RolePaginator>('/roles', { params }),

};
