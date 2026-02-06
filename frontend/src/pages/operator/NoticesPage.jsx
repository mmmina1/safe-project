import { useState, useContext, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { ToastContext } from "../../contexts/ToastContext";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { TableSkeleton } from "../../components/Skeleton";

export default function NoticesPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const toast = useContext(ToastContext);

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["adminNotices"],
    queryFn: async () => {
      const res = await api.get("/admin/notices");
      return res.data;
    },
  });

  const notices = Array.isArray(data) ? data : [];

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/admin/notices", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
      toast?.success("공지사항이 추가되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "추가에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, type, title, content }) => {
      const res = await api.put(`/admin/notices/${id}`, { type, title, content });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
      setEditingId(null);
      toast?.success("공지사항이 수정되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "수정에 실패했습니다.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/notices/${id}/toggle`);
      return res.data;
    },
    onSuccess: (updatedNotice) => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
      toast?.success("상태가 변경되었습니다.");
      const nextActive = updatedNotice?.isActive ?? updatedNotice?.active;
      if (updatedNotice && (updatedNotice.noticeId != null || updatedNotice.id != null) && typeof nextActive === "boolean") {
        queryClient.setQueryData(["adminNotices"], (old) => {
          const list = Array.isArray(old) ? [...old] : [];
          const id = updatedNotice.noticeId ?? updatedNotice.id;
          return list.map((n) =>
            (n.noticeId ?? n.id) === id ? { ...n, isActive: nextActive } : n
          );
        });
      }
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "상태 변경에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/notices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
      toast?.success("공지사항이 삭제되었습니다.");
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "삭제에 실패했습니다.");
      setDeleteConfirmId(null);
    },
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { type: "GENERAL", title: "", content: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (form) => {
    const payload = {
      type: form.type,
      title: form.title.trim(),
      content: form.content.trim(),
    };
    if (!payload.title || !payload.content) return;
    if (!editingId) {
      createMutation.mutate(payload, {
        onSuccess: () => reset(),
      });
    } else {
      updateMutation.mutate({ id: editingId, ...payload }, {
        onSuccess: () => reset(),
      });
    }
  };

  const onToggle = (id) => {
    toggleMutation.mutate(id);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
  };

  const onCancelEdit = useCallback(() => {
    setEditingId(null);
    reset();
  }, [reset]);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && editingId) {
        onCancelEdit();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }
      if (e.key === 'F5') {
        e.preventDefault();
        refetch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingId, refetch, onCancelEdit]);

  // 정렬
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let sortedNotices = [...notices];
  if (sortField) {
    sortedNotices.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'noticeId' || sortField === 'id') {
        aVal = a.noticeId ?? a.id ?? 0;
        bVal = b.noticeId ?? b.id ?? 0;
      } else if (sortField === 'title' || sortField === 'type') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
      } else if (sortField === 'isActive') {
        aVal = a.isActive ?? a.active ?? false;
        bVal = b.isActive ?? b.active ?? false;
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  } else {
    sortedNotices = [...notices].sort((a, b) => {
      const aId = a.noticeId ?? a.id ?? 0;
      const bId = b.noticeId ?? b.id ?? 0;
      return aId - bId;
    });
  }

  const onEdit = (n) => {
    const id = n.noticeId ?? n.id;
    setEditingId(id);
    setValue("type", n.type);
    setValue("title", n.title);
    setValue("content", n.content);
  };

  const theme = { bg: "#2C2F40", card: "#363a4d", border: "#545763", text: "#ffffff", muted: "#9ca3af", accent: "#475569", danger: "#94a3b8" };

  if (isError) {
    return (
      <div style={{ 
        padding: "48px 24px", 
        textAlign: "center", 
        color: "#94a3b8",
        background: theme.card,
        borderRadius: "12px",
        border: `1px solid ${theme.border}`
      }}>
        <div style={{ marginBottom: "12px", fontWeight: 600 }}>에러</div>
        <div>에러가 발생했습니다: {String(error?.message || error)}</div>
      </div>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div style={{ color: theme.text, animation: "fadeIn 0.3s ease-in" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>공지사항 관리</h2>
          <p style={{ margin: 0, color: theme.muted, fontSize: "0.875rem", lineHeight: 1.6 }}>
            공지사항을 추가, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <TableSkeleton rows={5} columns={5} />
      </div>
    );
  }

  return (
    <div style={{ color: theme.text, animation: "fadeIn 0.3s ease-in" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>공지사항 관리</h2>
        <p style={{ margin: 0, color: theme.muted, fontSize: "0.875rem", lineHeight: 1.6 }}>
          공지사항을 추가, 수정, 삭제할 수 있습니다.
        </p>
      </div>

      {/* 폼 카드 */}
      <div style={{
        background: theme.card,
        padding: "24px",
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.4s ease-in 0.1s both",
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "1.125rem", fontWeight: 700 }}>
          {editingId ? "공지사항 수정" : "새 공지사항 추가"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "14px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: theme.muted, fontSize: "0.875rem", fontWeight: 600 }}>
              타입
            </label>
            <select style={{
              ...inputStyle,
              width: "100%",
            }} {...register("type", { required: true })}>
              <option value="GENERAL">일반</option>
              <option value="FRAUD_TREND">사기 동향</option>
              <option value="MANUAL">매뉴얼</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: theme.muted, fontSize: "0.875rem", fontWeight: 600 }}>
              제목 <span style={{ color: theme.danger }}>*</span>
            </label>
            <input
              placeholder="공지사항 제목을 입력하세요"
              style={{
                ...inputStyle,
                width: "100%",
              }}
              {...register("title", {
                required: "제목을 입력하세요.",
              })}
            />
            {errors.title && (
              <div style={{ marginTop: "6px", color: theme.danger, fontSize: "0.8125rem" }}>
                {errors.title.message}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: theme.muted, fontSize: "0.875rem", fontWeight: 600 }}>
              내용 <span style={{ color: theme.danger }}>*</span>
            </label>
            <textarea
              placeholder="공지사항 내용을 입력하세요"
              rows={6}
              style={{
                ...inputStyle,
                width: "100%",
              }}
              {...register("content", {
                required: "내용을 입력하세요.",
              })}
            />
            {errors.content && (
              <div style={{ marginTop: "6px", color: theme.danger, fontSize: "0.8125rem" }}>
                {errors.content.message}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: "8px" }}>
            <button 
              type="submit" 
              disabled={isSaving} 
              style={{ 
                ...btnStyle, 
                opacity: isSaving ? 0.6 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {editingId ? (updateMutation.isPending ? "수정중..." : "수정 저장") : (createMutation.isPending ? "추가중..." : "추가")}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={onCancelEdit} 
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: theme.text,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 공지사항 목록 */}
      <div style={{
        background: theme.card,
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.border}`,
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>공지사항 목록</h3>
          <span style={{ color: theme.muted, fontSize: "0.875rem" }}>
            총 <strong style={{ color: theme.text }}>{sortedNotices.length}</strong>개
          </span>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", color: theme.text }}>
            <thead>
              <tr>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('noticeId')}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.muted}
                >
                  번호 {sortField === 'noticeId' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('type')}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.muted}
                >
                  타입 {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('title')}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.muted}
                >
                  제목 {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('isActive')}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.muted}
                >
                  노출 {sortField === 'isActive' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ ...thStyle, padding: "14px 20px" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {sortedNotices.map((n, idx) => {
                const id = n.noticeId ?? n.id;
                const typeLabel = n.type === "GENERAL" ? "일반" : n.type === "FRAUD_TREND" ? "사기 동향" : "매뉴얼";
                return (
                  <tr 
                    key={id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)",
                      transition: "all 0.15s ease",
                      animation: `fadeIn 0.2s ease-in ${idx * 0.02}s both`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.transform = "scale(1.001)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        background: n.type === "FRAUD_TREND" 
                          ? "rgba(239,68,68,0.2)" 
                          : n.type === "MANUAL" 
                            ? "rgba(99,102,241,0.2)" 
                            : "rgba(148,163,184,0.2)",
                        color: n.type === "FRAUD_TREND" 
                          ? "#fca5a5" 
                          : n.type === "MANUAL" 
                            ? "#a5b4fc" 
                            : theme.muted,
                      }}>
                        {typeLabel}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 500 }}>{n.title}</td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }}>
                      <button
                        type="button"
                        onClick={() => onToggle(id)}
                        disabled={toggleMutation.isPending}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "999px",
                          border: "none",
                          background: n.isActive ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)",
                          color: n.isActive ? "#86efac" : "#94a3b8",
                          fontWeight: 700,
                          fontSize: "0.8125rem",
                          cursor: toggleMutation.isPending ? "not-allowed" : "pointer",
                          opacity: toggleMutation.isPending ? 0.6 : 1,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (!toggleMutation.isPending) {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        {n.isActive ? "ON" : "OFF"}
                      </button>
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          type="button" 
                          onClick={() => onEdit(n)} 
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: `1px solid ${theme.border}`,
                            background: "transparent",
                            color: theme.text,
                            fontWeight: 600,
                            fontSize: "0.8125rem",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = theme.accent;
                            e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = theme.border;
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          수정
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteClick(id)} 
                          disabled={deleteMutation.isPending} 
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: `1px solid ${theme.danger}`,
                            background: "transparent",
                            color: theme.danger,
                            fontWeight: 600,
                            fontSize: "0.8125rem",
                            cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                            opacity: deleteMutation.isPending ? 0.6 : 1,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!deleteMutation.isPending) {
                              e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sortedNotices.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle, padding: "48px 24px", textAlign: "center", color: theme.muted }} colSpan={5}>
                    <div style={{ marginBottom: "12px", fontWeight: 600 }}>공지사항 없음</div>
                    <div>등록된 공지사항이 없습니다.</div>
                    <div style={{ marginTop: "8px", fontSize: "0.875rem" }}>
                      위 폼을 사용하여 공지사항을 추가하세요.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="공지사항 삭제"
        message="정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #545763",
  background: "#2C2F40",
  color: "#ffffff",
  fontSize: "0.9375rem",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const btnStyle = {
  padding: "12px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#475569",
  color: "white",
  fontWeight: 700,
  fontSize: "0.9375rem",
};

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
