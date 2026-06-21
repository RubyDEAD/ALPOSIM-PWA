import Cookies from "js-cookie";

export const logout = () => {
  Cookies.remove("token");
  Cookies.remove("username");
  Cookies.remove("role");
  window.location.href = "/login";
};

export const getUser = () => ({
  username: Cookies.get("username") ?? "",
  role: Cookies.get("role") ?? "",
});

export const getToken = () => Cookies.get("token");