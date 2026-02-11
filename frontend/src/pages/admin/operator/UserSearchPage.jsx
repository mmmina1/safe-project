import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axiosInstance"

export default function UserSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["adminUsers", keyword],
    queryFn: async () => {
      const params = keyword ? { keyword } : {};
      const res = await api.get("/api/admin/users/search", { params });
      return res.data;
    },
  });

  const theme = { text: "#ffffff", muted: "#9ca3af", border: "#545763", accent: "#475569", danger: "#94a3b8" };
  if (isLoading) return <div style={{ color: theme.muted }}>불러오는 중...</div>;
  if (isError) return <div style={{ color: "#94a3b8" }}>에러: {String(error?.message || error)}</div>;

  return (
    <div style={{ color: theme.text }}>
      <h2 style={{ margin: 0 }}>회원 검색</h2>
      <div style={{ marginTop: "16px", display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="이메일 또는 이름으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            flex: 1,
            maxWidth: 400,
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #545763",
            background: "#363a4d",
            color: theme.text,
          }}
        />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>이메일</th>
            <th style={thStyle}>이름</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>가입일</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.userId}
              style={{
                cursor: "pointer",
                backgroundColor: selectedUserId === user.userId ? "rgba(255,255,255,0.08)" : "transparent",
              }}
              onClick={() => setSelectedUserId(user.userId)}
            >
              <td style={tdStyle}>{user.userId}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.name || "-"}</td>
              <td style={tdStyle}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background: user.status === "ACTIVE" ? "rgba(34,197,94,0.2)" : user.status === "SUSPENDED" ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.15)",
                  color: user.status === "ACTIVE" ? "#86efac" : user.status === "SUSPENDED" ? "#94a3b8" : "#9ca3af",
                  fontWeight: 600,
                }}>
                  {user.status === "ACTIVE" ? "활성" : user.status === "SUSPENDED" ? "정지" : user.status}
                </span>
              </td>
              <td style={tdStyle}>
                {user.createdDate ? new Date(user.createdDate).toLocaleDateString("ko-KR") : "-"}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td style={tdStyle} colSpan={5}>검색 결과가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #545763",
  textAlign: "left",
  padding: "10px 0",
  color: "#9ca3af",
};

const tdStyle = {
  padding: "10px 0",
  borderBottom: "1px solid #545763",
  color: "#ffffff",
};
