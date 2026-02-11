import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axiosInstance"

export default function CsDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [memo, setMemo] = useState("");

  const { data: consultations = [] } = useQuery({
    queryKey: ["csConsultations"],
    queryFn: async () => {
      const res = await api.get("/api/admin/cs/consultations");
      return res.data;
    },
  });

  const { data: selectedConsultation } = useQuery({
    queryKey: ["csConsultation", selectedConsultationId],
    queryFn: async () => {
      const res = await api.get(`/api/admin/cs/consultations/${selectedConsultationId}`);
      return res.data;
    },
    enabled: !!selectedConsultationId,
  });

  const createMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await api.post("/api/admin/cs/consultations", null, {
        params: userId != null ? { userId } : {},
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ id, adminId }) => {
      const res = await api.patch(`/api/admin/cs/consultations/${id}/assign`, null, {
        params: { adminId },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["csConsultation", selectedConsultationId] });
    },
  });

  const memoMutation = useMutation({
    mutationFn: async ({ id, memo }) => {
      const res = await api.patch(`/api/admin/cs/consultations/${id}/memo`, null, {
        params: { memo },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["csConsultation", selectedConsultationId] });
      setMemo("");
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/api/admin/cs/consultations/${id}/complete`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["csConsultation", selectedConsultationId] });
    },
  });

  const handleCreateConsultation = () => {
    createMutation.mutate(null);
  };

  const handleAssign = (id) => {
    const adminId = prompt("상담원 ID를 입력하세요:");
    if (!adminId) return;
    assignMutation.mutate({ id, adminId: parseInt(adminId) });
  };

  const handleSaveMemo = () => {
    if (!selectedConsultationId || !memo.trim()) return;
    memoMutation.mutate({ id: selectedConsultationId, memo: memo.trim() });
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
        <button onClick={handleCreateConsultation} style={{
          padding: "10px 18px",
          borderRadius: "10px",
          border: "none",
          background: theme.accent,
          color: "white",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "0.875rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }} onMouseEnter={(e) => {
          e.currentTarget.style.background = "#546a7a";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
        }} onMouseLeave={(e) => {
          e.currentTarget.style.background = theme.accent;
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
        }}>
          + 새 상담 생성
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
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
            {consultations.map((c) => (
              <div key={c.consultationId} onClick={() => { setSelectedConsultationId(c.consultationId); setMemo(c.memo || ""); }} style={{
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
                    <div style={{ fontWeight: 600, color: theme.text, fontSize: "0.9375rem" }}>상담 #{c.consultationId}</div>
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
            ))}
            {consultations.length === 0 && (
              <div style={{ padding: "48px 24px", textAlign: "center", color: theme.muted, fontSize: "0.9375rem", lineHeight: 1.5 }}>
                등록된 상담이 없습니다.
                <div style={{ marginTop: "8px", fontSize: "0.8125rem" }}>위 「새 상담 생성」으로 추가하세요.</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          {selectedConsultation ? (
            <>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${theme.border}`, background: "rgba(0,0,0,0.15)", fontWeight: 700, fontSize: "0.9375rem" }}>
                상담 상세
              </div>
              <div style={{ padding: "20px 18px" }}>
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
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                  {!selectedConsultation.adminId && (
                    <button onClick={() => handleAssign(selectedConsultation.consultationId)} style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: theme.accent,
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.8125rem",
                    }}>
                      상담원 배정
                    </button>
                  )}
                  {selectedConsultation.status !== "COMPLETED" && (
                    <button onClick={() => completeMutation.mutate(selectedConsultation.consultationId)} style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: theme.accent,
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.8125rem",
                    }}>
                      완료 처리
                    </button>
                  )}
                </div>
                <div style={{ marginBottom: "8px", fontWeight: 600, fontSize: "0.875rem" }}>상담 메모</div>
                <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="상담 메모를 입력하세요..." rows={8} style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  marginBottom: "12px",
                  background: "#2C2F40",
                  color: theme.text,
                  fontSize: "0.875rem",
                  resize: "vertical",
                  minHeight: "120px",
                }} />
                <button onClick={handleSaveMemo} disabled={memoMutation.isPending} style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: theme.accent,
                  color: "white",
                  fontWeight: 700,
                  cursor: memoMutation.isPending ? "not-allowed" : "pointer",
                  opacity: memoMutation.isPending ? 0.6 : 1,
                  fontSize: "0.875rem",
                }}>
                  {memoMutation.isPending ? "저장 중…" : "메모 저장"}
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "56px 24px", textAlign: "center", color: theme.muted, fontSize: "0.9375rem", lineHeight: 1.6 }}>
              <div style={{ marginBottom: "8px", fontSize: "2rem", opacity: 0.5 }}>📋</div>
              상담 목록에서 항목을 선택하면<br />여기에 상세 내용이 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
