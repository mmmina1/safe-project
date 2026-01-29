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


    // 댓글 목록 조회 (500 에러 방지를 위해 post_id 파라미터 명시)
    getComments: async (postId) => {
        const res = await axiosInstance.get("/api/comments", {
            params: { post_id: postId } 
        });
        return res.data;
    },

    // 댓글 작성
    createComment: async (commentData) => {
        // 호출할 때 { post_id, user_id, content } 객체를 통째로 넘기세요
        const res = await axiosInstance.post("/api/comments", commentData);
        return res.data;
    }
};
