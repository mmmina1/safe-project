import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axiosInstance"

export default function NoticesPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminNotices"],
    queryFn: async () => {
      const res = await api.get("/api/admin/notices");
      return res.data;
    },
  });

  const notices = Array.isArray(data) ? data : [];
  const sortedNotices = [...notices].sort((a, b) => {
    const aId = a.noticeId ?? a.id ?? 0;
    const bId = b.noticeId ?? b.id ?? 0;
    return aId - bId;
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/api/admin/notices", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminNotices"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, type, title, content }) => {
      const res = await api.put(`/api/admin/notices/${id}`, { type, title, content });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminNotices"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/api/admin/notices/${id}/toggle`);
      return res.data;
    },
    onSuccess: (updatedNotice) => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
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
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/notices/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminNotices"] }),
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
    try {
      if (!editingId) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        setEditingId(null);
      }
      reset();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "처리 실패");
    }
  };

  const onToggle = async (id) => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "토글 실패");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("삭제하실?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "삭제 실패");
    }
  };

  const onEdit = (n) => {
    const id = n.noticeId ?? n.id;
    setEditingId(id);
    setValue("type", n.type);
    setValue("title", n.title);
    setValue("content", n.content);
  };

  const onCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const theme = { bg: "#2C2F40", card: "#363a4d", border: "#545763", text: "#ffffff", muted: "#9ca3af", accent: "#475569", danger: "#94a3b8" };
  if (isLoading) return <div style={{ color: theme.muted }}>불러오는 중...</div>;
  if (isError) return <div style={{ color: "#94a3b8" }}>에러: {String(error?.message || error)}</div>;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div style={{ color: theme.text }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
        <h2 style={{ margin: 0, color: theme.text }}>공지사항 관리</h2>
        <span style={{ color: theme.muted }}>총 {sortedNotices.length}개</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px", display: "grid", gap: "10px", maxWidth: 700 }}>
        <select style={inputStyle(theme)} {...register("type", { required: true })}>
          <option value="GENERAL">일반</option>
          <option value="FRAUD_TREND">사기 동향</option>
          <option value="MANUAL">매뉴얼</option>
        </select>
        <input
          placeholder="제목"
          style={inputStyle(theme)}
          {...register("title", {
            required: "제목을 입력하세요.",
          })}
        />
        <textarea
          placeholder="내용"
          rows={4}
          style={inputStyle(theme)}
          {...register("content", {
            required: "내용을 입력하세요.",
          })}
        />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button type="submit" disabled={isSaving} style={{ ...btnStyle(theme), opacity: isSaving ? 0.6 : 1 }}>
            {editingId ? (updateMutation.isPending ? "수정중..." : "수정 저장") : (createMutation.isPending ? "추가중..." : "추가")}
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
          {(errors.title || errors.content) && (
            <span style={{ color: theme.danger }}>
              {errors.title?.message || errors.content?.message}
            </span>
          )}
        </div>
      </form>

      <table style={{ width: "100%", marginTop: "18px", borderCollapse: "collapse", color: theme.text }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, borderColor: theme.border, color: theme.muted }}>번호</th>
            <th style={{ ...thStyle, borderColor: theme.border, color: theme.muted }}>타입</th>
            <th style={{ ...thStyle, borderColor: theme.border, color: theme.muted }}>제목</th>
            <th style={{ ...thStyle, borderColor: theme.border, color: theme.muted }}>노출</th>
            <th style={{ ...thStyle, borderColor: theme.border, color: theme.muted }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {sortedNotices.map((n, idx) => {
            const id = n.noticeId ?? n.id;
            return (
              <tr key={id}>
                <td style={{ ...tdStyle, borderColor: theme.border }}>{idx + 1}</td>
                <td style={{ ...tdStyle, borderColor: theme.border }}>{n.type}</td>
                <td style={{ ...tdStyle, borderColor: theme.border }}>{n.title}</td>
                <td style={{ ...tdStyle, borderColor: theme.border }}>
                  <button
                    type="button"
                    onClick={() => onToggle(id)}
                    disabled={toggleMutation.isPending}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: `1px solid ${theme.border}`,
                      background: n.isActive ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)",
                      color: theme.text,
                      fontWeight: 700,
                      cursor: toggleMutation.isPending ? "not-allowed" : "pointer",
                      opacity: toggleMutation.isPending ? 0.6 : 1,
                    }}
                  >
                    {n.isActive ? "ON" : "OFF"}
                  </button>
                </td>
                <td style={{ ...tdStyle, borderColor: theme.border }}>
                  <button type="button" onClick={() => onEdit(n)} style={{
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
                  <button type="button" onClick={() => onDelete(id)} disabled={deleteMutation.isPending} style={{
                    padding: "6px 10px",
                    borderRadius: "10px",
                    border: `1px solid ${theme.danger}`,
                    background: "transparent",
                    color: theme.danger,
                    fontWeight: 700,
                    cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                    opacity: deleteMutation.isPending ? 0.6 : 1,
                  }}>
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
          {sortedNotices.length === 0 && (
            <tr>
              <td style={{ ...tdStyle, borderColor: theme.border, color: theme.muted }} colSpan={5}>
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const inputStyle = (theme) => ({
  padding: "10px 12px",
  borderRadius: "10px",
  border: `1px solid ${theme?.border || "#545763"}`,
  background: "#363a4d",
  color: theme?.text || "#ffffff",
});

const btnStyle = (theme) => ({
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: theme?.accent || "#475569",
  color: "white",
  fontWeight: 700,
});

const thStyle = {
  borderBottom: "1px solid #545763",
  textAlign: "left",
  padding: "10px 0",
};

const tdStyle = {
  padding: "10px 0",
  borderBottom: "1px solid #545763",
  color: "#ffffff",
};
