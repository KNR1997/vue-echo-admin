import { request } from "@/utils";

export default {
  getUserMenu: () => request.get("/base/usermenu"),
  fetchMe: () => request.get("/base/me"),
  profileUpdate: (data: { username: string; email: string }) =>
    request.post("/base/profileUpdate", data),
  passwordUpdate: (data: { oldPassword: string; newPassword: string }) =>
    request.post("/base/passwordUpdate", data),
};
