import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axiosInstance"

export default function CommunityReportsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [blindReasonId, setBlindReasonId] = useState(null);

  const { data: reports = [], isLoading, isError, error } = useQuery({
    queryKey: ["adminReports", statusFilter],
    queryFn: async () => {
      const res = await api.get("/api/admin/community/reports");
      return res.data;
    },
  });

  const { data: blindReasons = [] } = useQuery({
    queryKey: ["blindReasons"],
    queryFn: async () => {
      const res = await api.get("/api/admin/blind-reasons");
      return res.data;
    },
  });

  const filteredReports = statusFilter ? reports.filter((r) => r.status === statusFilter) : reports;

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/api/admin/community/reports/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/api/admin/community/reports/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    },
  });

  const blindMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await api.post(`/api/admin/community/posts/${postId}/blind`, null, {
        params: { reasonId: blindReasonId },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    },
  });

  const handleApprove = (id) => {
    if (!confirm("승인하시겠습니까?")) return;
    approveMutation.mutate(id);
  };

  const handleReject = (id) => {
    if (!confirm("반려하시겠습니까?")) return;
    rejectMutation.mutate(id);
  };

  const handleBlindPost = (postId) => {
    if (!blindReasonId) {
      alert("블라인드 사유를 선택하세요.");
      return;
    }
    if (!confirm("게시글을 블라인드 처리하시겠습니까?")) return;
    blindMutation.mutate(postId);
  };

  const theme = { text: "#ffffff", muted: "#9ca3af", border: "#545763", accent: "#475569", danger: "#94a3b8" };
  if (isLoading) return <div style={{ color: theme.muted }}>불러오는 중...</div>;
  if (isError) return <div style={{ color: "#94a3b8" }}>에러: {String(error?.message || error)}</div>;

  return (
    <div style={{ color: theme.text }}>
      <h2 style={{ margin: 0, marginBottom: "20px" }}>신고 게시글 처리</h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={() => setStatusFilter("")} style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: statusFilter === "" ? "2px solid #475569" : "1px solid #545763",
          background: statusFilter === "" ? "#475569" : "transparent",
          color: statusFilter === "" ? "white" : theme.text,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          전체
        </button>
        <button onClick={() => setStatusFilter("접수")} style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: statusFilter === "접수" ? "2px solid #475569" : "1px solid #545763",
          background: statusFilter === "접수" ? "#475569" : "transparent",
          color: statusFilter === "접수" ? "white" : theme.text,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          접수
        </button>
        <button onClick={() => setStatusFilter("처리완료")} style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: statusFilter === "처리완료" ? "2px solid #475569" : "1px solid #545763",
          background: statusFilter === "처리완료" ? "#475569" : "transparent",
          color: statusFilter === "처리완료" ? "white" : theme.text,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          처리완료
        </button>
        <button onClick={() => setStatusFilter("반려")} style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: statusFilter === "반려" ? "2px solid #475569" : "1px solid #545763",
          background: statusFilter === "반려" ? "#475569" : "transparent",
          color: statusFilter === "반려" ? "white" : theme.text,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          반려
        </button>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: theme.muted }}>블라인드 사유 선택</label>
        <select value={blindReasonId || ""} onChange={(e) => setBlindReasonId(e.target.value ? parseInt(e.target.value) : null)} style={{
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #545763",
          background: "#363a4d",
          color: theme.text,
          width: "300px",
        }}>
          <option value="">선택하세요</option>
          {blindReasons.filter((r) => r.isActive).map((r) => (
            <option key={r.reasonId} value={r.reasonId}>
              {r.reasonName}
            </option>
          ))}
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>신고 ID</th>
            <th style={thStyle}>게시글 ID</th>
            <th style={thStyle}>신고자</th>
            <th style={thStyle}>사유</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>신고일</th>
            <th style={thStyle}>관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr
              key={report.reportId}
              style={{
                backgroundColor: selectedReportId === report.reportId ? "rgba(255,255,255,0.08)" : "transparent",
              }}
              onClick={() => setSelectedReportId(report.reportId)}
            >
              <td style={tdStyle}>{report.reportId}</td>
              <td style={tdStyle}>{report.postId}</td>
              <td style={tdStyle}>{report.reporterId || "-"}</td>
              <td style={tdStyle}>
                {report.reason ? (report.reason.length > 50 ? report.reason.substring(0, 50) + "..." : report.reason) : "-"}
              </td>
              <td style={tdStyle}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background: report.status === "APPROVED" ? "rgba(34,197,94,0.2)" : report.status === "REJECTED" ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.2)",
                  color: report.status === "APPROVED" ? "#86efac" : report.status === "REJECTED" ? "#94a3b8" : "#cbd5e1",
                  fontWeight: 600,
                  fontSize: "12px",
                }}>
                  {report.status === "APPROVED" ? "승인" : report.status === "REJECTED" ? "거부" : "대기"}
                </span>
              </td>
              <td style={tdStyle}>{new Date(report.createdAt).toLocaleDateString("ko-KR")}</td>
              <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                {report.status === "접수" && (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => handleBlindPost(report.postId)} disabled={!blindReasonId || blindMutation.isPending} style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #94a3b8",
                      background: "transparent",
                      color: "#94a3b8",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: !blindReasonId ? "not-allowed" : "pointer",
                      opacity: !blindReasonId ? 0.5 : 1,
                    }}>
                      블라인드
                    </button>
                    <button onClick={() => handleApprove(report.reportId)} disabled={approveMutation.isPending} style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #94a3b8",
                      background: "transparent",
                      color: "#94a3b8",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: approveMutation.isPending ? "not-allowed" : "pointer",
                    }}>
                      승인
                    </button>
                    <button onClick={() => handleReject(report.reportId)} disabled={rejectMutation.isPending} style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #545763",
                      background: "transparent",
                      color: theme.text,
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: rejectMutation.isPending ? "not-allowed" : "pointer",
                    }}>
                      반려
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {filteredReports.length === 0 && (
            <tr>
              <td style={tdStyle} colSpan={7}>신고 내역이 없습니다.</td>
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
