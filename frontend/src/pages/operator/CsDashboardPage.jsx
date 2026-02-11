import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ToastContext } from "../../contexts/ToastContext";
import { useContext } from "react";

export default function CsDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [memo, setMemo] = useState("");
  const [originalMemo, setOriginalMemo] = useState(""); // 원본 메모 저장
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [assignAdminId, setAssignAdminId] = useState("");
  const [showAssignInput, setShowAssignInput] = useState(false);
  const toast = useContext(ToastContext);

  // 상담원 목록 조회
  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await api.get("/admin/users/agents");
      return res.data;
    },
  });

  const { data: consultations = [] } = useQuery({
    queryKey: ["csConsultations"],
    queryFn: async () => {
      const res = await api.get("/admin/cs/consultations");
      return res.data;
    },
  });

  const { data: selectedConsultation } = useQuery({
    queryKey: ["csConsultation", selectedConsultationId],
    queryFn: async () => {
      const res = await api.get(`/admin/cs/consultations/${selectedConsultationId}`);
      return res.data;
    },
    enabled: !!selectedConsultationId,
    onSuccess: (data) => {
      // 상담 선택 시 메모 초기화
      setMemo(data?.memo || "");
      setOriginalMemo(data?.memo || "");
    },
  });

  const createMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await api.post("/admin/cs/consultations", null, {
        params: userId != null ? { userId } : {},
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
      toast?.success("새 상담이 생성되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "상담 생성에 실패했습니다.");
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ id, adminId }) => {
      const res = await api.patch(`/admin/cs/consultations/${id}/assign`, null, {
        params: { adminId },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["csConsultation", selectedConsultationId] });
      toast?.success("상담원이 배정되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "상담원 배정에 실패했습니다.");
    },
  });

  const memoMutation = useMutation({
    mutationFn: async ({ id, memo }) => {
      const res = await api.patch(`/admin/cs/consultations/${id}/memo`, null, {
        params: { memo },
      });
      return res.data;
    },
    onSuccess: (data) => {
      // 쿼리 캐시 즉시 업데이트
      queryClient.setQueryData(["csConsultation", selectedConsultationId], data);
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
      // 원본 메모 업데이트
      setOriginalMemo(data.memo || "");
      toast?.success("메모가 저장되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "메모 저장에 실패했습니다.");
    },
  });

  const handleSaveMemo = () => {
    if (!selectedConsultationId) return;
    memoMutation.mutate({ id: selectedConsultationId, memo: memo.trim() });
  };

  const handleCancelMemo = () => {
    setMemo(originalMemo);
    toast?.info("변경사항이 취소되었습니다.");
  };

  const isMemoChanged = memo !== originalMemo;

  const completeMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/cs/consultations/${id}/complete`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["csConsultation", selectedConsultationId] });
      toast?.success("상담이 완료 처리되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "완료 처리에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/cs/consultations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
      if (selectedConsultationId === deleteConfirmId) {
        setSelectedConsultationId(null);
        setMemo("");
      }
      toast?.success("상담이 삭제되었습니다.");
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "삭제에 실패했습니다.");
      setDeleteConfirmId(null);
    },
  });

  const handleCreateConsultation = () => {
    createMutation.mutate(null);
  };

  const handleAssign = (id) => {
    if (!assignAdminId || assignAdminId === "") {
      toast?.error("상담원을 선택하세요.");
      return;
    }
    const adminIdNum = parseInt(assignAdminId);
    if (isNaN(adminIdNum) || adminIdNum <= 0) {
      toast?.error("올바른 상담원을 선택하세요.");
      return;
    }
    assignMutation.mutate({ id, adminId: adminIdNum }, {
      onSuccess: () => {
        setAssignAdminId("");
        setShowAssignInput(false);
      },
    });
  };

  const theme = {
    text: "#ffffff",
    muted: "#9ca3af",
    border: "#545763",
    accent: "#475569",
    card: "#363a4d",
    cardHover: "rgba(255,255,255,0.04)",
    selected: "rgba(255,255,255,0.08)",
  };

  return (
    <div style={{ color: theme.text, padding: "0 4px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            고객지원 대시보드
          </h1>
          <p style={{ margin: "6px 0 0", color: theme.muted, fontSize: "0.875rem" }}>
            상담 목록에서 항목을 선택하면 상세 내용과 메모를 확인·작성할 수 있습니다.
          </p>
        </div>
        <button 
          onClick={handleCreateConsultation} 
          disabled={createMutation.isPending}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            background: theme.accent,
            color: "white",
            fontWeight: 700,
            cursor: createMutation.isPending ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            opacity: createMutation.isPending ? 0.6 : 1,
          }} 
          onMouseEnter={(e) => {
            if (!createMutation.isPending) {
              e.currentTarget.style.background = "#546a7a";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
            }
          }} 
          onMouseLeave={(e) => {
            if (!createMutation.isPending) {
              e.currentTarget.style.background = theme.accent;
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
            }
          }}>
          {createMutation.isPending ? "생성 중..." : "+ 새 상담 생성"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", overflow: "visible" }}>
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.border}`, background: "rgba(0,0,0,0.15)", fontWeight: 700, fontSize: "0.9375rem" }}>
            상담 목록
            {consultations.length > 0 && (
              <span style={{ marginLeft: "8px", color: theme.muted, fontWeight: 500, fontSize: "0.8125rem" }}>
                {consultations.length}건
              </span>
            )}
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {consultations.map((c, index) => {
              // 쿼리 캐시에서 최신 메모 가져오기
              const cachedConsultation = queryClient.getQueryData(["csConsultation", c.consultationId]);
              const currentMemo = cachedConsultation?.memo || c.memo || "";
              
              return (
                <div key={c.consultationId} onClick={() => { 
                  setSelectedConsultationId(c.consultationId); 
                  setMemo(currentMemo); 
                  setOriginalMemo(currentMemo);
                  setShowAssignInput(false); 
                  setAssignAdminId("");
                }} style={{
                  padding: "14px 18px",
                  borderBottom: `1px solid ${theme.border}`,
                  cursor: "pointer",
                  backgroundColor: selectedConsultationId === c.consultationId ? theme.selected : "transparent",
                  transition: "background 0.15s ease",
                }} onMouseEnter={(e) => {
                  if (selectedConsultationId !== c.consultationId) e.currentTarget.style.backgroundColor = theme.cardHover;
                }} onMouseLeave={(e) => {
                  if (selectedConsultationId !== c.consultationId) e.currentTarget.style.backgroundColor = "transparent";
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: theme.text, fontSize: "0.9375rem" }}>상담 #{index + 1}</div>
                      <div style={{ fontSize: "12px", color: theme.muted, marginTop: "2px" }}>
                        회원 ID: {c.userId ?? "미지정"}
                      </div>
                    </div>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: c.status === "COMPLETED" ? "rgba(34,197,94,0.2)" : c.status === "IN_PROGRESS" ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.2)",
                      color: c.status === "COMPLETED" ? "#86efac" : c.status === "IN_PROGRESS" ? "#94a3b8" : "#cbd5e1",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}>
                      {c.status === "COMPLETED" ? "완료" : c.status === "IN_PROGRESS" ? "진행중" : "대기"}
                    </span>
                  </div>
                </div>
              );
            })}
            {consultations.length === 0 && (
              <div style={{ padding: "48px 24px", textAlign: "center", color: theme.muted, fontSize: "0.9375rem", lineHeight: 1.5 }}>
                등록된 상담이 없습니다.
                <div style={{ marginTop: "8px", fontSize: "0.8125rem" }}>위 「새 상담 생성」으로 추가하세요.</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflowX: "hidden" }}>
          {selectedConsultation ? (
            <>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.border}`, background: "rgba(0,0,0,0.15)", fontWeight: 700, fontSize: "0.9375rem" }}>
                상담 상세
              </div>
              <div style={{ padding: "20px 18px", paddingRight: "32px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "10px 16px", marginBottom: "20px", fontSize: "0.875rem" }}>
                  <span style={{ color: theme.muted }}>상담 ID</span>
                  <span style={{ fontWeight: 600 }}>{selectedConsultation.consultationId}</span>
                  <span style={{ color: theme.muted }}>회원 ID</span>
                  <span>{selectedConsultation.userId ?? "미지정"}</span>
                  <span style={{ color: theme.muted }}>담당 상담원</span>
                  <span>{selectedConsultation.adminId || "미배정"}</span>
                  <span style={{ color: theme.muted }}>상태</span>
                  <span>{selectedConsultation.status === "COMPLETED" ? "완료" : selectedConsultation.status === "IN_PROGRESS" ? "진행중" : "대기"}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center", paddingRight: "16px" }}>
                  {!showAssignInput ? (
                    <button 
                      onClick={() => {
                        setShowAssignInput(true);
                        if (selectedConsultation.adminId) {
                          setAssignAdminId(selectedConsultation.adminId.toString());
                        }
                      }} 
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "none",
                        background: theme.accent,
                        color: "white",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.8125rem",
                      }}>
                      {selectedConsultation.adminId ? "상담원 변경" : "상담원 배정"}
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <select
                        value={assignAdminId}
                        onChange={(e) => setAssignAdminId(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setShowAssignInput(false);
                            setAssignAdminId("");
                          }
                        }}
                        autoFocus
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: `1px solid ${theme.border}`,
                          background: "#2C2F40",
                          color: theme.text,
                          fontSize: "0.8125rem",
                          minWidth: "180px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">상담원 선택</option>
                        {agents.map((agent) => (
                          <option key={agent.userId} value={agent.userId}>
                            {agent.name} ({agent.email})
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleAssign(selectedConsultation.consultationId)} 
                        disabled={assignMutation.isPending || !assignAdminId}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: "none",
                          background: theme.accent,
                          color: "white",
                          fontWeight: 600,
                          cursor: assignMutation.isPending || !assignAdminId ? "not-allowed" : "pointer",
                          fontSize: "0.8125rem",
                          opacity: assignMutation.isPending || !assignAdminId ? 0.6 : 1,
                          flexShrink: 0,
                        }}>
                        {assignMutation.isPending ? "배정 중..." : "확인"}
                      </button>
                      <button 
                        onClick={() => {
                          setShowAssignInput(false);
                          setAssignAdminId("");
                        }}
                        disabled={assignMutation.isPending}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: `1px solid ${theme.border}`,
                          background: "transparent",
                          color: theme.text,
                          fontWeight: 600,
                          cursor: assignMutation.isPending ? "not-allowed" : "pointer",
                          fontSize: "0.8125rem",
                          flexShrink: 0,
                        }}>
                        취소
                      </button>
                    </div>
                  )}
                  {selectedConsultation.status !== "COMPLETED" && (
                    <button 
                      onClick={() => completeMutation.mutate(selectedConsultation.consultationId)} 
                      disabled={completeMutation.isPending}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "none",
                        background: theme.accent,
                        color: "white",
                        fontWeight: 600,
                        cursor: completeMutation.isPending ? "not-allowed" : "pointer",
                        fontSize: "0.8125rem",
                        opacity: completeMutation.isPending ? 0.6 : 1,
                      }}>
                      {completeMutation.isPending ? "처리 중..." : "완료 처리"}
                    </button>
                  )}
                  <button onClick={() => setDeleteConfirmId(selectedConsultation.consultationId)} style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                  }}>
                    삭제
                  </button>
                </div>
                <div style={{ marginBottom: "8px", fontWeight: 600, fontSize: "0.875rem" }}>
                  상담 메모
                  {isMemoChanged && (
                    <span style={{ marginLeft: "8px", color: "#fbbf24", fontSize: "0.75rem", fontWeight: 500 }}>
                      (변경됨)
                    </span>
                  )}
                </div>
                <textarea 
                  value={memo} 
                  onChange={(e) => setMemo(e.target.value)} 
                  placeholder="상담 메모를 입력하세요..." 
                  rows={8} 
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${isMemoChanged ? "#fbbf24" : theme.border}`,
                    marginBottom: "12px",
                    background: "#2C2F40",
                    color: theme.text,
                    fontSize: "0.875rem",
                    resize: "vertical",
                    minHeight: "120px",
                    transition: "border-color 0.2s",
                  }} 
                />
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button 
                    onClick={handleSaveMemo} 
                    disabled={memoMutation.isPending || !isMemoChanged} 
                    style={{
                      padding: "10px 18px",
                      borderRadius: "8px",
                      border: "none",
                      background: theme.accent,
                      color: "white",
                      fontWeight: 700,
                      cursor: memoMutation.isPending || !isMemoChanged ? "not-allowed" : "pointer",
                      opacity: memoMutation.isPending || !isMemoChanged ? 0.6 : 1,
                      fontSize: "0.875rem",
                      transition: "opacity 0.2s",
                    }}
                  >
                    {memoMutation.isPending ? "저장 중…" : originalMemo ? "메모 수정" : "메모 저장"}
                  </button>
                  {isMemoChanged && (
                    <button 
                      onClick={handleCancelMemo} 
                      disabled={memoMutation.isPending} 
                      style={{
                        padding: "10px 18px",
                        borderRadius: "8px",
                        border: `1px solid ${theme.border}`,
                        background: "transparent",
                        color: theme.text,
                        fontWeight: 700,
                        cursor: memoMutation.isPending ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      취소
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: "56px 24px", textAlign: "center", color: theme.muted, fontSize: "0.9375rem", lineHeight: 1.6 }}>
              <div style={{ marginBottom: "8px", fontWeight: 600 }}>항목 선택</div>
              상담 목록에서 항목을 선택하면<br />여기에 상세 내용이 표시됩니다.
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="상담 삭제"
        message="정말로 이 상담을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
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
