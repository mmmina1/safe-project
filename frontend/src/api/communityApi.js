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

  createPost: async ({ title, content, category, userId }) => {
    const res = await axiosInstance.post("/api/community/posts", {
      title,
      content,
      category,
      userId,
    });
    return res.data;
  },

  getComments: async (postId) => {
    const res = await axiosInstance.get("/api/comments", {
      params: { post_id: postId },
    });
    return res.data;
  },

  createComment: async (commentData) => {
    const res = await axiosInstance.post("/api/comments", commentData);
    return res.data;
  },

  updateComment: async (commentId, data) => {
    const res = await axiosInstance.put(`/api/comments/${commentId}`, data);
    return res.data;
  },

  deleteComment: async (commentId, userId) => {
    const res = await axiosInstance.delete(`/api/comments/${commentId}`, {
      params: { user_id: userId },
    });
    return res.data;
  },
};