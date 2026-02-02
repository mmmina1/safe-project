import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '../../../api/axios'

export default function BlacklistPage() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const { data: blacklist = [], isLoading, isError, error, refetch } = useQuery({
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
      const res = await api.post("/admin/blacklist", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlacklist"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await api.put(`/admin/blacklist/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlacklist"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/blacklist/${id}`, { params: { adminId: 1 } });
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["adminBlacklist"] });
      if (selectedId === deletedId) setSelectedId(null);
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
      alert("전화번호 또는 URL을 입력하세요.");
      return;
    }
    try {
      if (!editingId) {
        await createMutation.mutateAsync(payload);
        reset();
      } else {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        setEditingId(null);
        reset();
      }
    } catch (e) {
      alert(e?.response?.data?.message || "처리 실패");
    }
  };

  const onEdit = (item) => {
    setEditingId(item.blacklistId);
    setValue("targetValue", item.targetValue || "");
    setValue("type", item.type || "");
    setValue("reason", item.reason || "");
  };

  const onCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const onDelete = (id) => {
    if (!confirm("삭제하시겠습니까?")) return;
    deleteMutation.mutate(id);
  };

  const theme = { text: "#ffffff", muted: "#9ca3af", border: "#545763", accent: "#475569", danger: "#94a3b8" };
  if (isLoading) return <div style={{ color: theme.muted }}>불러오는 중...</div>;
  if (isError) return <div style={{ color: "#94a3b8" }}>에러: {String(error?.message || error)}</div>;

  return (
    <div style={{ color: theme.text }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>블랙리스트 관리</h2>
        <span style={{ color: theme.muted }}>총 {blacklist.length}개</span>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="전화번호 또는 URL 검색"
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
        <button
          onClick={() => refetch()}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "none",
            background: theme.accent,
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          검색
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px", display: "grid", gap: "10px", maxWidth: 700 }}>
        <input
          placeholder="전화번호 또는 URL"
          style={inputStyle}
          {...register("targetValue", { required: "전화번호 또는 URL을 입력하세요." })}
        />
        <select style={inputStyle} {...register("type")}>
          <option value="">자동 판단</option>
          <option value="PHONE">전화번호</option>
          <option value="URL">URL</option>
        </select>
        <input placeholder="차단 사유 (선택)" style={inputStyle} {...register("reason")} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} style={{ ...btnStyle, opacity: createMutation.isPending || updateMutation.isPending ? 0.6 : 1 }}>
            {editingId ? (updateMutation.isPending ? "수정중..." : "수정 저장") : (createMutation.isPending ? "추가중..." : "추가")}
          </button>
          {editingId && (
            <button type="button" onClick={onCancelEdit} style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #545763",
              background: "transparent",
              color: theme.text,
              fontWeight: 700,
              cursor: "pointer",
            }}>
              취소
            </button>
          )}
        </div>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>대상 값</th>
            <th style={thStyle}>유형</th>
            <th style={thStyle}>신고 횟수</th>
            <th style={thStyle}>보이스피싱</th>
            <th style={thStyle}>미싱</th>
            <th style={thStyle}>최근 신고일</th>
            <th style={thStyle}>등록일</th>
            <th style={thStyle}>관리</th>
          </tr>
        </thead>
        <tbody>
          {blacklist.map((item) => (
            <tr
              key={item.blacklistId}
              style={{
                cursor: "pointer",
                backgroundColor: selectedId === item.blacklistId ? "rgba(255,255,255,0.08)" : "transparent",
              }}
              onClick={() => setSelectedId(item.blacklistId)}
            >
              <td style={tdStyle}>{item.blacklistId}</td>
              <td style={tdStyle}>
                {item.type === "URL" ? (
                  <a href={item.targetValue} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    {item.targetValue.length > 30 ? item.targetValue.substring(0, 30) + "..." : item.targetValue}
                  </a>
                ) : (
                  item.targetValue
                )}
              </td>
              <td style={tdStyle}>{item.type || "-"}</td>
              <td style={tdStyle}>{item.reportCount || 0}</td>
              <td style={tdStyle}>{item.voiceReportCnt || 0}</td>
              <td style={tdStyle}>{item.smsReportCnt || 0}</td>
              <td style={tdStyle}>
                {item.lastReportedAt ? new Date(item.lastReportedAt).toLocaleDateString("ko-KR") : "-"}
              </td>
              <td style={tdStyle}>
                {item.createdDate ? new Date(item.createdDate).toLocaleDateString("ko-KR") : "-"}
              </td>
              <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "10px",
                    border: "1px solid #545763",
                    background: "transparent",
                    color: theme.text,
                    fontWeight: 700,
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(item.blacklistId)}
                  disabled={deleteMutation.isPending}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "10px",
                    border: "1px solid #94a3b8",
                    background: "transparent",
                    color: "#94a3b8",
                    fontWeight: 700,
                    cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                    opacity: deleteMutation.isPending ? 0.6 : 1,
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
          {blacklist.length === 0 && (
            <tr>
              <td style={tdStyle} colSpan={9}>등록된 블랙리스트가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedId && (
        <div style={{ marginTop: "32px" }}>
          <h3 style={{ marginBottom: "16px" }}>등록 히스토리</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>처리일시</th>
                <th style={thStyle}>처리유형</th>
                <th style={thStyle}>처리자</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.historyId}>
                  <td style={tdStyle}>{new Date(h.createdAt).toLocaleString("ko-KR")}</td>
                  <td style={tdStyle}>
                    {h.actionType === "CREATE" ? "등록" : h.actionType === "UPDATE" ? "수정" : "삭제"}
                  </td>
                  <td style={tdStyle}>{h.adminId || "-"}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td style={tdStyle} colSpan={3}>히스토리가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #545763",
  background: "#363a4d",
  color: "#ffffff",
};

const btnStyle = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#475569",
  color: "white",
  fontWeight: 700,
};

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
