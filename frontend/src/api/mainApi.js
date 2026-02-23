import axiosInstance from "./axiosInstance";

export async function searchPhishing(phone){
    const res = await axiosInstance.get("/mainpage/phishing",{
        params: { phone },
    });
    return res.data;
}
