import axios from "axios"

//백엔드로 가는 모든 요청의 기본 틀 (데이터 이동 경로)
const axiosInstance = axios.create({
    baseURL : "http://localhost:8080",
    withCredentials: true,
})

export default axiosInstance;