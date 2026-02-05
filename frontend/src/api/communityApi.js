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
    const res = await axiosInstance.get("/api/comments", {
      params: { post_id: postId },
    });
    return res.data;
  },

  createComment: async (commentData) => {
    const payload = { ...commentData };

    if (payload.post_id !== undefined) payload.post_id = Number(payload.post_id);
    if (payload.user_id !== undefined) payload.user_id = Number(payload.user_id);

    if (typeof payload.content === "string") payload.content = payload.content.trim();

    if (
      payload.parent_comment_id === "" ||
      payload.parent_comment_id === undefined ||
      payload.parent_comment_id === null
    ) {
      delete payload.parent_comment_id;
    } else {
      payload.parent_comment_id = Number(payload.parent_comment_id);
    }

    const res = await axiosInstance.post("/api/comments", payload);
    return res.data;
  },

  updateComment: async (commentId, data) => {
    const payload = { ...data };

    if (payload.user_id !== undefined) payload.user_id = Number(payload.user_id);
    if (typeof payload.content === "string") payload.content = payload.content.trim();

    if (
      payload.parent_comment_id === "" ||
      payload.parent_comment_id === undefined ||
      payload.parent_comment_id === null
    ) {
      delete payload.parent_comment_id;
    } else {
      payload.parent_comment_id = Number(payload.parent_comment_id);
    }

    const res = await axiosInstance.put(`/api/comments/${commentId}`, payload);
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