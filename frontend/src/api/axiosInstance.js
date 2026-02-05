// src/api/axiosInstance.js
import axios from "axios";

//백엔드로 가는 모든 요청의 기본 틀 (데이터 이동 경로)
const axiosInstance = axios.create({
    baseURL : "http://localhost:8080",
    withCredentials: true,
})

// 요청마다 토큰 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
