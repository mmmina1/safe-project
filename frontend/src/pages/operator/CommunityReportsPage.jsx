import { useState, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { ToastContext } from "../../App";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { TableSkeleton } from "../../components/Skeleton";

export default function CommunityReportsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [blindReasonId, setBlindReasonId] = useState(null);
  const [approveConfirmId, setApproveConfirmId] = useState(null);
  const [rejectConfirmId, setRejectConfirmId] = useState(null);
  const [blindConfirmId, setBlindConfirmId] = useState(null);
  const toast = useContext(ToastContext);

  const { data: reports = [], isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["adminReports", statusFilter],
    queryFn: async () => {
      const res = await api.get("/admin/community/reports");
      return res.data;
    },
  });

  const { data: blindReasons = [] } = useQuery({
    queryKey: ["blindReasons"],
    queryFn: async () => {
      const res = await api.get("/admin/blind-reasons");
      return res.data;
    },
  });

  const filteredReports = statusFilter ? reports.filter((r) => r.status === statusFilter) : reports;

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/community/reports/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      toast?.success("신고가 승인되었습니다.");
      setApproveConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "승인 처리에 실패했습니다.");
      setApproveConfirmId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/community/reports/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      toast?.success("신고가 반려되었습니다.");
      setRejectConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "반려 처리에 실패했습니다.");
      setRejectConfirmId(null);
    },
  });

  const blindMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await api.post(`/admin/community/posts/${postId}/blind`, null, {
        params: { reasonId: blindReasonId },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      toast?.success("게시글이 블라인드 처리되었습니다.");
      setBlindConfirmId(null);
      setBlindReasonId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "블라인드 처리에 실패했습니다.");
      setBlindConfirmId(null);
    },
  });

  const handleApprove = (id) => {
    setApproveConfirmId(id);
  };

  const handleReject = (id) => {
    setRejectConfirmId(id);
  };

  const handleBlindPost = (postId) => {
    if (!blindReasonId) {
      toast?.error("블라인드 사유를 선택하세요.");
      return;
    }
    setBlindConfirmId(postId);
  };

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
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>신고 게시글 처리</h2>
          <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>
            커뮤니티에서 신고된 게시글을 검토하고 처리합니다.
          </p>
        </div>
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div style={{ color: TEXT_WHITE, animation: "fadeIn 0.3s ease-in" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>신고 게시글 처리</h2>
        <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>
          커뮤니티에서 신고된 게시글을 검토하고 처리합니다.
        </p>
      </div>

      {/* 필터 및 블라인드 사유 선택 카드 */}
      <div style={{
        background: CARD_BG,
        padding: "20px",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        marginBottom: "24px",
      }}>
        <div style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "8px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>상태 필터</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["", "접수", "처리완료", "반려"].map((status) => (
              <button 
                key={status || "전체"}
                onClick={() => setStatusFilter(status)} 
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: statusFilter === status ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                  background: statusFilter === status ? ACCENT : "transparent",
                  color: statusFilter === status ? "white" : TEXT_WHITE,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (statusFilter !== status) {
                    e.currentTarget.style.borderColor = ACCENT;
                    e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (statusFilter !== status) {
                    e.currentTarget.style.borderColor = BORDER;
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {status || "전체"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
            블라인드 사유 선택
          </label>
          <select 
            value={blindReasonId || ""} 
            onChange={(e) => setBlindReasonId(e.target.value ? parseInt(e.target.value) : null)} 
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: `1px solid ${BORDER}`,
              background: "#2C2F40",
              color: TEXT_WHITE,
              fontSize: "0.9375rem",
              minWidth: "300px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = ACCENT}
            onBlur={(e) => e.target.style.borderColor = BORDER}
          >
            <option value="">선택하세요</option>
            {blindReasons.filter((r) => r.isActive).map((r) => (
              <option key={r.reasonId} value={r.reasonId}>
                {r.reasonName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 신고 목록 */}
      <div style={{
        background: CARD_BG,
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.4s ease-in 0.2s both",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${BORDER}`,
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>신고 목록</h3>
          <span style={{ color: TEXT_MUTED, fontSize: "0.875rem" }}>
            총 <strong style={{ color: TEXT_WHITE }}>{filteredReports.length}</strong>건
          </span>
        </div>

        {isLoading ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: TEXT_MUTED }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
            <div>신고 내역을 불러오는 중...</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, padding: "14px 20px" }}>신고 ID</th>
                  <th style={{ ...thStyle, padding: "14px 20px" }}>게시글 ID</th>
                  <th style={{ ...thStyle, padding: "14px 20px" }}>신고자</th>
                  <th style={{ ...thStyle, padding: "14px 20px" }}>사유</th>
                  <th style={{ ...thStyle, padding: "14px 20px" }}>상태</th>
                  <th style={{ ...thStyle, padding: "14px 20px" }}>신고일</th>
                  <th style={{ ...thStyle, padding: "14px 20px" }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr
                    key={report.reportId}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedReportId === report.reportId 
                        ? "rgba(71, 85, 105, 0.3)" 
                        : index % 2 === 0 
                          ? "transparent" 
                          : "rgba(0,0,0,0.05)",
                      transition: "background-color 0.15s ease",
                    }}
                    onClick={() => setSelectedReportId(report.reportId)}
                    onMouseEnter={(e) => {
                      if (selectedReportId !== report.reportId) {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedReportId !== report.reportId) {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)";
                      }
                    }}
                  >
                    <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 600 }}>{report.reportId}</td>
                    <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 600 }}>{report.postId}</td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }}>{report.reporterId || <span style={{ color: TEXT_MUTED }}>-</span>}</td>
                    <td style={{ ...tdStyle, padding: "14px 20px", maxWidth: "250px" }}>
                      {report.reason ? (
                        <span style={{ 
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {report.reason.length > 50 ? report.reason.substring(0, 50) + "..." : report.reason}
                        </span>
                      ) : (
                        <span style={{ color: TEXT_MUTED }}>-</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }}>
                      <span style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        display: "inline-block",
                        background: report.status === "APPROVED" || report.status === "처리완료"
                          ? "rgba(34,197,94,0.2)" 
                          : report.status === "REJECTED" || report.status === "반려"
                            ? "rgba(239,68,68,0.2)" 
                            : "rgba(148,163,184,0.2)",
                        color: report.status === "APPROVED" || report.status === "처리완료"
                          ? "#86efac" 
                          : report.status === "REJECTED" || report.status === "반려"
                            ? "#fca5a5" 
                            : "#cbd5e1",
                      }}>
                        {report.status === "APPROVED" || report.status === "처리완료" ? "승인" : report.status === "REJECTED" || report.status === "반려" ? "거부" : "대기"}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px", color: TEXT_MUTED, fontSize: "0.875rem" }}>
                      {new Date(report.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
                      {report.status === "접수" && (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <button 
                            onClick={() => handleBlindPost(report.postId)} 
                            disabled={!blindReasonId || blindMutation.isPending} 
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: `1px solid ${DANGER}`,
                              background: "transparent",
                              color: DANGER,
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              cursor: !blindReasonId ? "not-allowed" : "pointer",
                              opacity: !blindReasonId ? 0.5 : 1,
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (blindReasonId) {
                                e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            블라인드
                          </button>
                          <button 
                            onClick={() => handleApprove(report.reportId)} 
                            disabled={approveMutation.isPending} 
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: `1px solid ${ACCENT}`,
                              background: "transparent",
                              color: ACCENT,
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              cursor: approveMutation.isPending ? "not-allowed" : "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!approveMutation.isPending) {
                                e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.1)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            승인
                          </button>
                          <button 
                            onClick={() => handleReject(report.reportId)} 
                            disabled={rejectMutation.isPending} 
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: `1px solid ${BORDER}`,
                              background: "transparent",
                              color: TEXT_WHITE,
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              cursor: rejectMutation.isPending ? "not-allowed" : "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!rejectMutation.isPending) {
                                e.currentTarget.style.borderColor = ACCENT;
                                e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.1)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = BORDER;
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            반려
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td style={{ ...tdStyle, padding: "48px 24px", textAlign: "center", color: TEXT_MUTED }} colSpan={7}>
                      <div style={{ marginBottom: "12px", fontWeight: 600 }}>신고 내역 없음</div>
                      <div>신고 내역이 없습니다.</div>
                      {statusFilter && (
                        <div style={{ marginTop: "8px", fontSize: "0.875rem" }}>
                          "{statusFilter}" 상태의 신고가 없습니다.
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 승인 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={approveConfirmId !== null}
        title="신고 승인"
        message="정말로 이 신고를 승인하시겠습니까?"
        onConfirm={() => {
          if (approveConfirmId) {
            approveMutation.mutate(approveConfirmId);
          }
        }}
        onCancel={() => setApproveConfirmId(null)}
        confirmText="승인"
        cancelText="취소"
      />

      {/* 반려 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={rejectConfirmId !== null}
        title="신고 반려"
        message="정말로 이 신고를 반려하시겠습니까?"
        onConfirm={() => {
          if (rejectConfirmId) {
            rejectMutation.mutate(rejectConfirmId);
          }
        }}
        onCancel={() => setRejectConfirmId(null)}
        confirmText="반려"
        cancelText="취소"
      />

      {/* 블라인드 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={blindConfirmId !== null}
        title="게시글 블라인드"
        message="정말로 이 게시글을 블라인드 처리하시겠습니까?"
        onConfirm={() => {
          if (blindConfirmId) {
            blindMutation.mutate(blindConfirmId);
          }
        }}
        onCancel={() => {
          setBlindConfirmId(null);
          setBlindReasonId(null);
        }}
        confirmText="블라인드"
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
