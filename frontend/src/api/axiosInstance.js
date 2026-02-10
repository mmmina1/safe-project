import axios from "axios";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    const payload = parseJwt(token);
    const uid = payload?.sub;
    if (uid) localStorage.setItem("userId", String(uid)); 
  }

  return config;
});

export default axiosInstance;
