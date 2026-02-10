import { useState, useContext, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { ToastContext } from "../../contexts/ToastContext";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { TableSkeleton } from "../../components/Skeleton";

export default function BlindReasonsPage() {
  const [editingId, setEditingId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchKeyword, setSearchKeyword] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["blindReasons"],
    queryFn: async () => {
      const res = await api.get("/admin/blind-reasons");
      return res.data;
    },
  });

  const reasons = Array.isArray(data) ? data.map((r) => ({
    id: r.reasonId,
    reason_name: r.reasonName,
    is_active: r.isActive,
  })) : [];

  const createMutation = useMutation({
    mutationFn: async (name) => {
      const res = await api.post("/admin/blind-reasons", { reasonName: name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blindReasons"] });
      toast?.success("사유가 추가되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "추가에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, reasonName }) => {
      const res = await api.put(`/admin/blind-reasons/${id}`, { reasonName });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blindReasons"] });
      setEditingId(null);
      toast?.success("사유가 수정되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "수정에 실패했습니다.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/blind-reasons/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blindReasons"] });
      toast?.success("상태가 변경되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "상태 변경에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/blind-reasons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blindReasons"] });
      toast?.success("사유가 삭제되었습니다.");
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "삭제에 실패했습니다.");
      setDeleteConfirmId(null);
    },
  });

  const { register, handleSubmit, reset, setValue, formState: { errors }, clearErrors, setError } = useForm({
    defaultValues: { reason_name: "" },
    mode: "onSubmit",
  });

  const onAdd = async (form) => {
    const name = form.reason_name.trim();
    clearErrors("reason_name");
    if (!name) {
      setError("reason_name", { type: "manual", message: "사유명을 입력하세요." });
      return;
    }
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, reasonName: name });
        reset();
        setEditingId(null);
      } else {
        await createMutation.mutateAsync(name);
        reset();
      }
    } catch (e) {
      setError("reason_name", { type: "server", message: e?.response?.data?.message || "처리 실패" });
    }
  };

  const onEdit = (r) => {
    setEditingId(r.id);
    setValue("reason_name", r.reason_name ?? "");
  };

  const onCancelEdit = useCallback(() => {
    setEditingId(null);
    reset();
  }, [reset]);

  const onToggleActive = async (id) => {
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
      // F5는 기본 새로고침 동작을 사용하도록 제거
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingId, onCancelEdit]);

  // 정렬 및 필터링
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let filteredAndSortedReasons = [...reasons];

  // 검색 필터링
  if (searchKeyword.trim()) {
    filteredAndSortedReasons = filteredAndSortedReasons.filter((r) =>
      r.reason_name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

  // 정렬
  if (sortField) {
    filteredAndSortedReasons.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'reason_name') {
        aVal = aVal?.toLowerCase() || '';
        bVal = bVal?.toLowerCase() || '';
      }
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  }

  const CARD_BG = "#363a4d";
  const BORDER = "#545763";
  const TEXT_WHITE = "#ffffff";
  const TEXT_MUTED = "#9ca3af";
  const ACCENT = "#475569";
  const DANGER = "#94a3b8";
  const theme = { text: TEXT_WHITE, muted: TEXT_MUTED, border: BORDER, accent: ACCENT, danger: DANGER };

  if (isError) {
    return (
      <div style={{ 
        padding: "48px 24px", 
        textAlign: "center", 
        color: DANGER,
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
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>블라인드 사유 관리</h2>
        <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>
          게시글 블라인드 처리 시 사용할 사유를 관리합니다.
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
        <input
          type="text"
          placeholder="사유명으로 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: `1px solid ${BORDER}`,
            background: "#2C2F40",
            color: TEXT_WHITE,
            fontSize: "0.9375rem",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = ACCENT}
          onBlur={(e) => e.target.style.borderColor = BORDER}
        />
      </div>

      {/* 폼 카드 */}
      <div style={{
        background: CARD_BG,
        padding: "24px",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.4s ease-in 0.1s both",
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "1.125rem", fontWeight: 700 }}>
          {editingId ? "사유 수정" : "새 사유 추가"}
        </h3>
        <form onSubmit={handleSubmit(onAdd)} style={{ display: "flex", gap: "10px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <input
              placeholder="사유명을 입력하세요 (예: 욕설/비방)"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: `1px solid ${BORDER}`,
                background: "#2C2F40",
                color: TEXT_WHITE,
                fontSize: "0.9375rem",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = ACCENT}
              onBlur={(e) => e.target.style.borderColor = BORDER}
              {...register("reason_name", {
                required: "사유명을 입력하세요.",
                minLength: { value: 2, message: "2자 이상 입력하세요." },
                maxLength: { value: 100, message: "100자 이내로 입력하세요." },
                onChange: () => clearErrors("reason_name"),
              })}
            />
            {errors.reason_name && (
              <div style={{ marginTop: "6px", color: DANGER, fontSize: "0.8125rem" }}>
                {errors.reason_name.message}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending} 
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: ACCENT,
                color: "white",
                fontWeight: 700,
                fontSize: "0.9375rem",
                opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1,
                cursor: (createMutation.isPending || updateMutation.isPending) ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!createMutation.isPending && !updateMutation.isPending) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {updateMutation.isPending ? "수정중..." : createMutation.isPending ? "추가중..." : editingId ? "수정" : "추가"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={onCancelEdit} 
                style={{
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: `1px solid ${BORDER}`,
                  background: "transparent",
                  color: TEXT_WHITE,
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BORDER;
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 목록 카드 */}
      <div style={{
        background: CARD_BG,
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${BORDER}`,
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>블라인드 사유 목록</h3>
          <span style={{ color: TEXT_MUTED, fontSize: "0.875rem" }}>
            총 <strong style={{ color: TEXT_WHITE }}>{reasons.length}</strong>개
          </span>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} columns={4} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('id')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('reason_name')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  사유명 {sortField === 'reason_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('is_active')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  사용 {sortField === 'is_active' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ ...thStyle, padding: "14px 20px" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedReasons.map((r, idx) => (
                <tr 
                  key={r.id}
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
                  <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 500 }}>{r.reason_name}</td>
                  <td style={{ ...tdStyle, padding: "14px 20px" }}>
                    <button 
                      onClick={() => onToggleActive(r.id)} 
                      disabled={toggleMutation.isPending} 
                      style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        border: "none",
                        background: r.is_active ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)",
                        color: r.is_active ? "#86efac" : "#94a3b8",
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
                      {r.is_active ? "ON" : "OFF"}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        type="button" 
                        onClick={() => onEdit(r)} 
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: `1px solid ${BORDER}`,
                          background: "transparent",
                          color: TEXT_WHITE,
                          fontWeight: 600,
                          fontSize: "0.8125rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = ACCENT;
                          e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = BORDER;
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(r.id)} 
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: `1px solid ${DANGER}`,
                          background: "transparent",
                          color: DANGER,
                          fontWeight: 600,
                          fontSize: "0.8125rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
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
              ))}
              {filteredAndSortedReasons.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle, padding: "48px 24px", textAlign: "center", color: TEXT_MUTED }} colSpan={4}>
                    <div style={{ marginBottom: "12px", fontWeight: 600 }}>
                      {searchKeyword ? "검색 결과 없음" : "사유 없음"}
                    </div>
                    <div>
                      {searchKeyword 
                        ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
                        : "등록된 사유가 없습니다."}
                    </div>
                    {!searchKeyword && (
                      <div style={{ marginTop: "8px", fontSize: "0.875rem" }}>
                        위 폼을 사용하여 블라인드 사유를 추가하세요.
                      </div>
                    )}
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
        title="사유 삭제"
        message="정말로 이 사유를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
        confirmText="삭제"
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
