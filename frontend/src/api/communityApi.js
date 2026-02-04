import axios from "axios";

const BASE_URL = "http://localhost:8080/api/comments";

// ✅ 토큰 꺼내기 전용 (이름 'token'으로 통일)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
};

export const communityApi = {
  getPostDetail: async (postId) => {
    const res = await axios.get(`http://localhost:8080/api/community/posts/${postId}`, { headers: getAuthHeaders() });
    return res.data;
  },

  getComments: async (postId) => {
    const res = await axios.get(BASE_URL, { 
      params: { post_id: Number(postId) },
      headers: getAuthHeaders()
    });
    return res.data;
  },

  createComment: async (commentData) => {
    // 🚨 형, 여기서 DTO 이름표(post_id 등) 확실히 맞췄어
    const payload = {
      post_id: Number(commentData.post_id),
      user_id: Number(commentData.user_id),
      content: String(commentData.content).trim(),
      parent_comment_id: commentData.parent_comment_id ? Number(commentData.parent_comment_id) : null
    };
    const res = await axios.post(BASE_URL, payload, { headers: getAuthHeaders() });
    return res.data;
  },

  updateComment: async (commentId, data) => {
    const payload = {
      content: data.content,
      user_id: Number(data.user_id) // 컨트롤러 payload.get("user_id") 대응
    };
    const res = await axios.put(`${BASE_URL}/${commentId}`, payload, { headers: getAuthHeaders() });
    return res.data;
  },

  deleteComment: async (commentId, userId) => {
    const res = await axios.delete(`${BASE_URL}/${commentId}`, {
      params: { user_id: Number(userId) },
      headers: getAuthHeaders()
    });
    return res.data;
  },

  likeComment: async (commentId, userId) => {
    const res = await axios.post(`${BASE_URL}/${commentId}/like`, null, {
      params: { user_id: Number(userId) },
      headers: getAuthHeaders()
    });
    return res.data;
  }
};