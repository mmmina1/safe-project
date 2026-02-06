import { useState, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { ToastContext } from "../../contexts/ToastContext";
import { TableSkeleton } from "../../components/Skeleton";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const CARD_BG = "#363a4d";
const BORDER = "#545763";
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#9ca3af";
const ACCENT = "#475569";

export default function UserSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [suspendConfirmId, setSuspendConfirmId] = useState(null);
  const [releaseConfirmId, setReleaseConfirmId] = useState(null);
  const toast = useContext(ToastContext);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["adminUsers", keyword],
    queryFn: async () => {
      const params = keyword ? { keyword } : {};
      const res = await api.get("/admin/users/search", { params });
      return res.data;
    },
  });

  const suspendMutation = useMutation({
    mutationFn: async ({ userId, reason }) => {
      const res = await api.post(`/admin/users/${userId}/action`, {
        type: "SUSPENDED",
        reason: reason || "운영자에 의한 정지",
        adminId: 1, // TODO: 실제 관리자 ID로 변경
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers", keyword] });
      toast?.success("회원이 비활성화되었습니다.");
      setSuspendConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "비활성화 처리에 실패했습니다.");
      setSuspendConfirmId(null);
    },
  });

  const releaseMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await api.patch(`/admin/users/${userId}/release`, null, {
        params: { adminId: 1 }, // TODO: 실제 관리자 ID로 변경
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers", keyword] });
      toast?.success("회원이 활성화되었습니다.");
      setReleaseConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "활성화 처리에 실패했습니다.");
      setReleaseConfirmId(null);
    },
  });

  // F5 키로 새로고침
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F5') {
        e.preventDefault();
        refetch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refetch]);

  // 정렬
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let sortedUsers = [...users];
  if (sortField) {
    sortedUsers.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'email' || sortField === 'name') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }
      if (sortField === 'createdDate') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  }

  if (isError) {
    return (
      <div style={{ 
        padding: "48px 24px", 
        textAlign: "center", 
        color: "#94a3b8",
        background: CARD_BG,
        borderRadius: "12px",
        border: `1px solid ${BORDER}`
      }}>
        <div style={{ marginBottom: "12px", fontWeight: 600 }}>에러</div>
        <div>에러가 발생했습니다: {String(error?.message || error)}</div>
      </div>
    );
  }

  return (
    <div style={{ color: TEXT_WHITE, animation: "fadeIn 0.3s ease-in" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>회원 검색</h2>
        <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>
          이메일 또는 이름으로 회원을 검색할 수 있습니다.
        </p>
      </div>

      {/* 검색 영역 */}
      <div style={{ 
        marginBottom: "20px",
        background: CARD_BG,
        padding: "16px 20px",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.4s ease-in 0.05s both",
      }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, maxWidth: 500 }}>
            <input
              type="text"
              placeholder="이메일 또는 이름으로 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: `1px solid ${BORDER}`,
                background: "#2C2F40",
                color: TEXT_WHITE,
                fontSize: "0.9375rem",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = ACCENT;
                e.target.style.boxShadow = `0 0 0 3px rgba(71, 85, 105, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = BORDER;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          {keyword && (
            <button
              onClick={() => setKeyword("")}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: `1px solid ${BORDER}`,
                background: "transparent",
                color: TEXT_MUTED,
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT;
                e.currentTarget.style.color = TEXT_WHITE;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.color = TEXT_MUTED;
              }}
            >
              초기화
            </button>
          )}
        </div>
        {/* 결과 카운트 */}
        {!isLoading && (
          <div style={{ marginTop: "12px", color: TEXT_MUTED, fontSize: "0.875rem" }}>
            총 <strong style={{ color: TEXT_WHITE }}>{sortedUsers.length}</strong>명의 회원이 검색되었습니다.
          </div>
        )}
      </div>

      {/* 테이블 영역 */}
      <div style={{
        background: CARD_BG,
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
        animation: "fadeIn 0.3s ease-in",
      }}>
        {isLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                <th 
                  style={{ ...thStyle, padding: "14px 16px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('userId')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  ID {sortField === 'userId' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 16px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('email')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  이메일 {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 16px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('name')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  이름 {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 16px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('status')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  상태 {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 16px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('createdDate')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  가입일 {sortField === 'createdDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr
                  key={user.userId}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedUserId === user.userId 
                      ? "rgba(71, 85, 105, 0.3)" 
                      : index % 2 === 0 
                        ? "transparent" 
                        : "rgba(0,0,0,0.05)",
                    transition: "all 0.15s ease",
                    animation: `fadeIn 0.2s ease-in ${index * 0.02}s both`,
                  }}
                  onClick={() => setSelectedUserId(user.userId)}
                  onMouseEnter={(e) => {
                    if (selectedUserId !== user.userId) {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.transform = "scale(1.001)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUserId !== user.userId) {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                >
                  <td style={{ ...tdStyle, padding: "14px 16px", fontWeight: 600 }}>{user.userId}</td>
                  <td style={{ ...tdStyle, padding: "14px 16px" }}>{user.email}</td>
                  <td style={{ ...tdStyle, padding: "14px 16px" }}>{user.name || <span style={{ color: TEXT_MUTED }}>-</span>}</td>
                  <td style={{ ...tdStyle, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        display: "inline-block",
                        background: user.status === "ACTIVE" 
                          ? "rgba(34,197,94,0.2)" 
                          : user.status === "SUSPENDED" 
                            ? "rgba(148,163,184,0.2)" 
                            : "rgba(148,163,184,0.15)",
                        color: user.status === "ACTIVE" 
                          ? "#86efac" 
                          : user.status === "SUSPENDED" 
                            ? "#94a3b8" 
                            : TEXT_MUTED,
                      }}>
                        {user.status === "ACTIVE" ? "활성" : user.status === "SUSPENDED" ? "비활성" : user.status}
                      </span>
                      {user.status === "ACTIVE" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSuspendConfirmId(user.userId);
                          }}
                          disabled={suspendMutation.isPending}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "1px solid rgba(148,163,184,0.5)",
                            background: "transparent",
                            color: "#94a3b8",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: suspendMutation.isPending ? "not-allowed" : "pointer",
                            opacity: suspendMutation.isPending ? 0.6 : 1,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!suspendMutation.isPending) {
                              e.currentTarget.style.backgroundColor = "rgba(148,163,184,0.1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          비활성화
                        </button>
                      ) : user.status === "SUSPENDED" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReleaseConfirmId(user.userId);
                          }}
                          disabled={releaseMutation.isPending}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "1px solid rgba(34,197,94,0.5)",
                            background: "transparent",
                            color: "#86efac",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: releaseMutation.isPending ? "not-allowed" : "pointer",
                            opacity: releaseMutation.isPending ? 0.6 : 1,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!releaseMutation.isPending) {
                              e.currentTarget.style.backgroundColor = "rgba(34,197,94,0.1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          활성화
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 16px", color: TEXT_MUTED }}>
                    {user.createdDate ? new Date(user.createdDate).toLocaleDateString("ko-KR") : "-"}
                  </td>
                </tr>
              ))}
              {sortedUsers.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle, padding: "48px 24px", textAlign: "center", color: TEXT_MUTED }} colSpan={5}>
                    <div style={{ marginBottom: "12px", fontWeight: 600 }}>검색 결과 없음</div>
                    <div>검색 결과가 없습니다.</div>
                    {keyword && (
                      <div style={{ marginTop: "8px", fontSize: "0.875rem" }}>
                        "{keyword}"에 대한 검색 결과가 없습니다.
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 비활성화 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={suspendConfirmId !== null}
        title="회원 비활성화"
        message="정말로 이 회원을 비활성화하시겠습니까? 비활성화된 회원은 서비스 이용이 제한됩니다."
        onConfirm={() => {
          if (suspendConfirmId) {
            suspendMutation.mutate({ userId: suspendConfirmId });
          }
        }}
        onCancel={() => setSuspendConfirmId(null)}
        confirmText="비활성화"
        cancelText="취소"
      />

      {/* 활성화 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={releaseConfirmId !== null}
        title="회원 활성화"
        message="정말로 이 회원을 활성화하시겠습니까? 회원은 다시 서비스를 이용할 수 있습니다."
        onConfirm={() => {
          if (releaseConfirmId) {
            releaseMutation.mutate(releaseConfirmId);
          }
        }}
        onCancel={() => setReleaseConfirmId(null)}
        confirmText="활성화"
        cancelText="취소"
      />
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #545763",
  textAlign: "left",
  color: "#9ca3af",
  fontWeight: 700,
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle = {
  borderBottom: "1px solid rgba(84, 87, 99, 0.3)",
  color: "#ffffff",
};
