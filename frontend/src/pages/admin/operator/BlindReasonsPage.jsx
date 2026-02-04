import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '../../../api/axios'

export default function BlindReasonsPage() {
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blindReasons"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, reasonName }) => {
      const res = await api.put(`/admin/blind-reasons/${id}`, { reasonName });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blindReasons"] });
      setEditingId(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/blind-reasons/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blindReasons"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/blind-reasons/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blindReasons"] }),
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

  const onCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const onToggleActive = async (id) => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch (e) {
      alert(e?.response?.data?.message || "토글 실패");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("삭제하실?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (e) {
      alert(e?.response?.data?.message || "삭제 실패");
    }
  };

  const theme = { text: "#ffffff", muted: "#9ca3af", border: "#545763", accent: "#475569", danger: "#94a3b8" };
  if (isLoading) return <div style={{ color: theme.muted }}>불러오는 중...</div>;
  if (isError) return <div style={{ color: "#94a3b8" }}>에러: {String(error?.message || error)}</div>;

  return (
    <div style={{ color: theme.text }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
        <h2 style={{ margin: 0 }}>블라인드 사유 관리</h2>
        <span style={{ color: theme.muted }}>총 {reasons.length}개</span>
      </div>
      <form onSubmit={handleSubmit(onAdd)} style={{ marginTop: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          placeholder="사유명을 입력하세요 (예: 욕설/비방)"
          style={{
            width: "360px",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #545763",
            background: "#363a4d",
            color: theme.text,
          }}
          {...register("reason_name", {
            required: "사유명을 입력하세요.",
            minLength: { value: 2, message: "2자 이상 입력하세요." },
            maxLength: { value: 100, message: "100자 이내로 입력하세요." },
            onChange: () => clearErrors("reason_name"),
          })}
        />
        <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} style={{
          padding: "10px 14px",
          borderRadius: "10px",
          border: "none",
          background: theme.accent,
          color: "white",
          fontWeight: 700,
          opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1,
          cursor: (createMutation.isPending || updateMutation.isPending) ? "not-allowed" : "pointer",
        }}>
          {updateMutation.isPending ? "수정중..." : createMutation.isPending ? "추가중..." : editingId ? "수정" : "추가"}
        </button>
        {editingId && (
          <button type="button" onClick={onCancelEdit} style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: `1px solid ${theme.border}`,
            background: "transparent",
            color: theme.text,
            fontWeight: 700,
            cursor: "pointer",
          }}>
            취소
          </button>
        )}
        {errors.reason_name && (
          <span style={{ color: theme.danger }}>{errors.reason_name.message}</span>
        )}
      </form>
      <table style={{ width: "100%", marginTop: "18px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>사유명</th>
            <th style={thStyle}>사용</th>
            <th style={thStyle}>관리</th>
          </tr>
        </thead>
        <tbody>
          {reasons.map((r, idx) => (
            <tr key={r.id}>
              <td style={tdStyle}>{idx + 1}</td>
              <td style={tdStyle}>{r.reason_name}</td>
              <td style={tdStyle}>
                <button onClick={() => onToggleActive(r.id)} disabled={toggleMutation.isPending} style={{
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid #545763",
                  background: r.is_active ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)",
                  color: theme.text,
                  fontWeight: 700,
                  cursor: toggleMutation.isPending ? "not-allowed" : "pointer",
                  opacity: toggleMutation.isPending ? 0.6 : 1,
                }}>
                  {r.is_active ? "ON" : "OFF"}
                </button>
              </td>
              <td style={tdStyle}>
                <button type="button" onClick={() => onEdit(r)} style={{
                  padding: "6px 10px",
                  borderRadius: "10px",
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: theme.text,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginRight: "8px",
                }}>
                  수정
                </button>
                <button onClick={() => onDelete(r.id)} style={{
                  padding: "6px 10px",
                  borderRadius: "10px",
                  border: "1px solid #94a3b8",
                  background: "transparent",
                  color: "#94a3b8",
                  fontWeight: 700,
                  cursor: "pointer",
                }}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
          {reasons.length === 0 && (
            <tr>
              <td style={tdStyle} colSpan={4}>등록된 사유가 없습니다.</td>
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
