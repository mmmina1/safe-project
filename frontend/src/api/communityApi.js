import axiosInstance from "./axiosInstance";

export const communityApi = {
  getPosts: async ({
    query = "",
    category = "",
    tag = "",
    sort = "recent",
    page = 1,
    size = 10,
  }) => {
    const res = await axiosInstance.get("/api/community/posts", {
      params: { query, category, tag, sort, page, size },
    });
    return res.data;
  },

  getPostDetail: async (postId) => {
    const res = await axiosInstance.get(`/api/community/posts/${postId}`);
    return res.data;
  },

  createPost: async (postData) => {
    const res = await axiosInstance.post("/api/community/posts", postData);
    return res.data;
  },

  getComments: async (postId) => {
    // 백엔드가 post_id로 받는 형태로 통일
    const res = await axiosInstance.get("/api/comments", {
      params: { post_id: postId },
    });
    return res.data;
  },

  createComment: async (commentData) => {
    // commentData는 이미 snake_case로 넘어오게(아래 컴포넌트에서) 통일
    const res = await axiosInstance.post("/api/comments", commentData);
    return res.data;
  },

  updateComment: async (commentId, data) => {
    // data도 snake_case로 통일
    const res = await axiosInstance.put(`/api/comments/${commentId}`, data);
    return res.data;
  },

  deleteComment: async (commentId, userId) => {
    const res = await axiosInstance.delete(`/api/comments/${commentId}`, {
      params: { user_id: userId },
    });
    return res.data;
  },

  likeComment: async (commentId, userId) => {
    const res = await axiosInstance.post(
      `/api/comments/${commentId}/like`,
      null,
      { params: { user_id: userId } }
    );
    return res.data;
  },
};
