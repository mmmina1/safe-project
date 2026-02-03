import axiosInstance from "./axiosInstance";

export const communityApi = {
  // 게시글 목록 조회
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

  // 게시글 상세 조회
  getPostDetail: async (postId) => {
    const res = await axiosInstance.get(`/api/community/posts/${postId}`);
    return res.data;
  },

  // 게시글 작성
  // 백엔드가 userId를 body로 요구하는 구조라면 유지.
  // (원래는 토큰에서 유저를 뽑는 게 정석인데, 지금 구조에 맞춤)
  createPost: async ({ title, content, category, userId }) => {
    const res = await axiosInstance.post("/api/community/posts", {
      title,
      content,
      category,
      userId,
    });
    return res.data;
  },

  // 댓글 목록 조회
  getComments: async (postId) => {
    const res = await axiosInstance.get("/api/comments", {
      params: { post_id: postId },
    });
    return res.data;
  },

  // 댓글 작성
  // 백엔드가 작성자 user_id/userId를 요구할 수 있어서 commentData 그대로 보냄
  createComment: async (commentData) => {
    const res = await axiosInstance.post("/api/comments", commentData);
    return res.data;
  },

  // 댓글 수정
updateComment: async (commentId, data, userId) => {
  const res = await axiosInstance.put(`/api/comments/${commentId}`, data, {
    params: { user_id: userId },
  });
  return res.data;
},
  // 댓글 삭제 (기존 방식 유지하되 params로 통일)
  deleteComment: async (commentId, userId) => {
    const res = await axiosInstance.delete(`/api/comments/${commentId}`, {
      params: { user_id: userId },
    });
    return res.data;
  },
};
