import axiosInstance from "./axiosInstance";

export const communityApi={
    //게시글 목록 조회
    getPosts : async({ query = "", category="", tag="",sort="recent", page = 1, size = 10 }) => {
        const res = await axiosInstance.get("/api/community/posts",{
            params:{query,category,tag,sort,page,size},
        })
    return res.data;
    },

    //상세 조회
    getPostDetail: async(postId) => {
        const res = await axiosInstance.get(`/api/community/posts/${postId}`)
        return res.data
    },

    //게시글 작성
    createPost: async ({ title, content, category, userId }) => {
        const res = await axiosInstance.post("/api/community/posts", { title, content, category, userId });
        return res.data;
        }


}