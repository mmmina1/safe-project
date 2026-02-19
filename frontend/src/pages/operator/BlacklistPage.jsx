import { useState, useContext, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { ToastContext } from "../../contexts/ToastContext";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { TableSkeleton } from "../../components/Skeleton";

export default function BlacklistPage() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const toast = useContext(ToastContext);

  const { data: blacklist = [], isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["adminBlacklist", keyword],
    queryFn: async () => {
      const params = keyword ? { keyword } : {};
      const res = await api.get("/admin/blacklist", { params });
      return res.data;
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ["blacklistHistory", selectedId],
    queryFn: async () => {
      const res = await api.get(`/admin/blacklist/${selectedId}/history`);
      return res.data;
    },
    enabled: !!selectedId,
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/admin/blacklist", payload, {
        params: { adminId: 1 }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlacklist"] });
      toast?.success("블랙리스트 항목이 추가되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "블랙리스트 추가에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await api.put(`/admin/blacklist/${id}`, payload, {
        params: { adminId: 1 }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlacklist"] });
      setEditingId(null);
      toast?.success("블랙리스트 항목이 수정되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/blacklist/${id}`, { params: { adminId: 1 } });
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["adminBlacklist"] });
      if (selectedId === deletedId) setSelectedId(null);
      toast?.success("블랙리스트 항목이 삭제되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "삭제에 실패했습니다.");
    },
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { targetValue: "", type: "", reason: "" },
  });

  const onSubmit = async (form) => {
    const payload = {
      targetValue: form.targetValue.trim(),
      type: form.type || null,
      reason: form.reason.trim() || null,
    };
    if (!payload.targetValue) {
      toast?.error("전화번호 또는 URL을 입력하세요.");
      return;
    }
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

  const onEdit = (item) => {
    setEditingId(item.blacklistId);
    setValue("targetValue", item.targetValue || "");
    setValue("type", item.type || "");
    setValue("reason", item.reason || "");
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
      // F5는 기본 새로고침 동작을 사용하도록 제거
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingId, onCancelEdit]);

  // 정렬
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 필터링 및 정렬
  let filteredAndSortedBlacklist = [...blacklist];

  // 정렬
  if (sortField) {
    filteredAndSortedBlacklist.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'blacklistId') {
        aVal = a.blacklistId ?? 0;
        bVal = b.blacklistId ?? 0;
      } else if (sortField === 'targetValue' || sortField === 'type' || sortField === 'reason') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
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

  if (isLoading) {
    return (
      <div style={{ color: TEXT_WHITE, animation: "fadeIn 0.3s ease-in" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>블랙리스트 관리</h2>
          <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>
            차단할 전화번호나 URL을 관리합니다. 항목을 클릭하면 등록 히스토리를 확인할 수 있습니다.
          </p>
        </div>
        <TableSkeleton rows={5} columns={5} />
      </div>
    );
  }

  return (
    <div style={{ color: TEXT_WHITE, animation: "fadeIn 0.3s ease-in", width: "100%", maxWidth: "100%" }}>
      <div style={{ marginBottom: "32px", marginTop: "0" }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>블랙리스트 관리</h2>
        <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>
          차단할 전화번호나 URL을 관리합니다. 항목을 클릭하면 등록 히스토리를 확인할 수 있습니다.
        </p>
      </div>

      {/* 검색 영역 */}
      <div style={{ 
        marginBottom: "20px", 
        display: "flex", 
        gap: "10px", 
        alignItems: "center",
        flexWrap: "wrap",
        background: CARD_BG,
        padding: "16px 20px",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.4s ease-in 0.05s both",
      }}>
        <div style={{ flex: 1, maxWidth: 500 }}>
          <input
            type="text"
            placeholder="전화번호 또는 URL 검색..."
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

      {/* 추가 폼 카드 */}
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
          {editingId ? "블랙리스트 수정" : "새 블랙리스트 추가"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "14px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              전화번호 또는 URL <span style={{ color: DANGER }}>*</span>
            </label>
            <input
              placeholder="예: 010-1234-5678 또는 https://example.com"
              style={{
                ...inputStyle,
                width: "100%",
              }}
              {...register("targetValue", { required: "전화번호 또는 URL을 입력하세요." })}
            />
            {errors.targetValue && (
              <div style={{ marginTop: "6px", color: DANGER, fontSize: "0.8125rem" }}>
                {errors.targetValue.message}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              유형 (선택)
            </label>
            <select style={{
              ...inputStyle,
              width: "100%",
            }} {...register("type")}>
              <option value="">자동 판단</option>
              <option value="PHONE">전화번호</option>
              <option value="URL">URL</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              차단 사유 (선택)
            </label>
            <input 
              placeholder="차단 사유를 입력하세요" 
              style={{
                ...inputStyle,
                width: "100%",
              }} 
              {...register("reason")} 
            />
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: "8px" }}>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending} 
              style={{ 
                ...btnStyle, 
                opacity: createMutation.isPending || updateMutation.isPending ? 0.6 : 1,
                cursor: createMutation.isPending || updateMutation.isPending ? "not-allowed" : "pointer",
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
              {editingId ? (updateMutation.isPending ? "수정중..." : "수정 저장") : (createMutation.isPending ? "추가중..." : "추가")}
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

      {/* 블랙리스트 목록 */}
      <div style={{
        background: CARD_BG,
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.4s ease-in 0.2s both",
        marginRight: "0",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${BORDER}`,
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>블랙리스트 목록</h3>
          <span style={{ color: TEXT_MUTED, fontSize: "0.875rem" }}>
            총 <strong style={{ color: TEXT_WHITE }}>{filteredAndSortedBlacklist.length}</strong>개
            {keyword && blacklist.length !== filteredAndSortedBlacklist.length && (
              <span style={{ marginLeft: "8px" }}>(전체 {blacklist.length}개 중)</span>
            )}
          </span>
        </div>

        <div style={{ 
          overflowX: "auto", 
          WebkitOverflowScrolling: "touch",
          width: "100%",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1200px" }}>
            <thead>
              <tr>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('blacklistId')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  ID {sortField === 'blacklistId' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('targetValue')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  대상 값 {sortField === 'targetValue' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => handleSort('type')}
                  onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                  onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
                >
                  유형 {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ ...thStyle, padding: "14px 20px" }}>신고 횟수</th>
                <th style={{ ...thStyle, padding: "14px 20px" }}>보이스피싱</th>
                <th style={{ ...thStyle, padding: "14px 20px" }}>미싱</th>
                <th style={{ ...thStyle, padding: "14px 20px" }}>최근 신고일</th>
                <th style={{ ...thStyle, padding: "14px 20px" }}>등록일</th>
                <th style={{ ...thStyle, padding: "14px 20px" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBlacklist.map((item, index) => (
                  <tr
                    key={item.blacklistId}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedId === item.blacklistId 
                        ? "rgba(71, 85, 105, 0.3)" 
                        : index % 2 === 0 
                          ? "transparent" 
                          : "rgba(0,0,0,0.05)",
                      transition: "background-color 0.15s ease",
                    }}
                    onClick={() => setSelectedId(item.blacklistId)}
                    onMouseEnter={(e) => {
                      if (selectedId !== item.blacklistId) {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedId !== item.blacklistId) {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)";
                      }
                    }}
                  >
                    <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ ...tdStyle, padding: "14px 20px", maxWidth: "200px" }}>
                      {item.type === "URL" ? (
                        <a 
                          href={item.targetValue} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: ACCENT,
                            textDecoration: "none",
                            fontWeight: 500,
                            wordBreak: "break-all",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = "none";
                          }}
                        >
                          {item.targetValue.length > 30 ? item.targetValue.substring(0, 30) + "..." : item.targetValue}
                        </a>
                      ) : (
                        <span style={{ fontWeight: 500 }}>{item.targetValue}</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }}>
                      {item.type ? (
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          background: item.type === "PHONE" 
                            ? "rgba(99,102,241,0.2)" 
                            : "rgba(239,68,68,0.2)",
                          color: item.type === "PHONE" 
                            ? "#a5b4fc" 
                            : "#fca5a5",
                        }}>
                          {item.type === "PHONE" ? "전화번호" : "URL"}
                        </span>
                      ) : (
                        <span style={{ color: TEXT_MUTED }}>-</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px", textAlign: "center", fontWeight: 600 }}>
                      {item.reportCount || 0}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px", textAlign: "center", color: "#fca5a5", fontWeight: 600 }}>
                      {item.voiceReportCnt || 0}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px", textAlign: "center", color: "#fbbf24", fontWeight: 600 }}>
                      {item.smsReportCnt || 0}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px", color: TEXT_MUTED, fontSize: "0.875rem" }}>
                      {item.lastReportedAt ? new Date(item.lastReportedAt).toLocaleDateString("ko-KR") : "-"}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px", color: TEXT_MUTED, fontSize: "0.875rem" }}>
                      {item.createdDate ? new Date(item.createdDate).toLocaleDateString("ko-KR") : "-"}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: `1px solid ${ACCENT}`,
                            background: "rgba(71, 85, 105, 0.1)",
                            color: ACCENT,
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                            minWidth: "60px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = ACCENT;
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(71, 85, 105, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(71, 85, 105, 0.1)";
                            e.currentTarget.style.color = ACCENT;
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.blacklistId)}
                          disabled={deleteMutation.isPending}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid #ef4444",
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#ef4444",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                            opacity: deleteMutation.isPending ? 0.5 : 1,
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                            minWidth: "60px",
                          }}
                          onMouseEnter={(e) => {
                            if (!deleteMutation.isPending) {
                              e.currentTarget.style.background = "#ef4444";
                              e.currentTarget.style.color = "#ffffff";
                              e.currentTarget.style.transform = "translateY(-1px)";
                              e.currentTarget.style.boxShadow = "0 2px 8px rgba(239, 68, 68, 0.3)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!deleteMutation.isPending) {
                              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                              e.currentTarget.style.color = "#ef4444";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedBlacklist.length === 0 && (
                  <tr>
                    <td style={{ ...tdStyle, padding: "48px 24px", textAlign: "center", color: TEXT_MUTED }} colSpan={9}>
                      <div style={{ marginBottom: "12px", fontWeight: 600 }}>
                        {keyword ? "검색 결과 없음" : "블랙리스트 없음"}
                      </div>
                      <div>
                        {keyword 
                          ? `"${keyword}"에 대한 검색 결과가 없습니다.`
                          : "등록된 블랙리스트가 없습니다."}
                      </div>
                      {!keyword && (
                        <div style={{ marginTop: "8px", fontSize: "0.875rem" }}>
                          위 폼을 사용하여 블랙리스트를 추가하세요.
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>

      {/* 히스토리 카드 */}
      {selectedId && (
        <div style={{
          marginTop: "24px",
          background: CARD_BG,
          padding: "24px",
          borderRadius: "12px",
          border: `1px solid ${BORDER}`,
        }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "1.125rem", fontWeight: 700 }}>등록 히스토리</h3>
          {history.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, padding: "12px 16px" }}>처리일시</th>
                    <th style={{ ...thStyle, padding: "12px 16px" }}>처리유형</th>
                    <th style={{ ...thStyle, padding: "12px 16px" }}>처리자</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, idx) => (
                    <tr 
                      key={h.historyId}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)",
                      }}
                    >
                      <td style={{ ...tdStyle, padding: "12px 16px", color: TEXT_MUTED, fontSize: "0.875rem" }}>
                        {new Date(h.createdAt).toLocaleString("ko-KR")}
                      </td>
                      <td style={{ ...tdStyle, padding: "12px 16px" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          background: h.actionType === "CREATE" 
                            ? "rgba(34,197,94,0.2)" 
                            : h.actionType === "UPDATE" 
                              ? "rgba(59,130,246,0.2)" 
                              : "rgba(239,68,68,0.2)",
                          color: h.actionType === "CREATE" 
                            ? "#86efac" 
                            : h.actionType === "UPDATE" 
                              ? "#93c5fd" 
                              : "#fca5a5",
                        }}>
                          {h.actionType === "CREATE" ? "등록" : h.actionType === "UPDATE" ? "수정" : "삭제"}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, padding: "12px 16px", fontWeight: 600 }}>
                        {h.adminId || <span style={{ color: TEXT_MUTED }}>-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "32px 24px", textAlign: "center", color: TEXT_MUTED }}>
              <div style={{ marginBottom: "8px", fontWeight: 600 }}>히스토리 없음</div>
              <div>등록 히스토리가 없습니다.</div>
            </div>
          )}
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="블랙리스트 삭제"
        message="정말로 이 블랙리스트 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteMutation.mutate(deleteConfirmId);
          }
        }}
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
