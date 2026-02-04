import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '../../../api/axios'

const API_BASE = "http://localhost:8080";
const imageFullUrl = (url) => (url && url.trim() ? (url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`) : null);

export default function BannersPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const { data: banners = [], isLoading, isError, error } = useQuery({
    queryKey: ["adminBanners"],
    queryFn: async () => {
      const res = await api.get("/admin/banners");
      return res.data;
    },
  });

  const sortedBanners = [...banners].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/admin/banners", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminBanners"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await api.put(`/admin/banners/${id}`, payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminBanners"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/banners/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminBanners"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/banners/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminBanners"] }),
  });

  const orderMutation = useMutation({
    mutationFn: async (bannerIds) => {
      const res = await api.put("/admin/banners/display-order", bannerIds);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminBanners"] }),
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/banners/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
  });

  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다. (jpg, png, gif, webp)");
      return;
    }
    uploadImageMutation.mutate(file, {
      onSuccess: (data) => {
        setValue("imageUrl", data.imageUrl ?? "");
      },
      onError: (err) => {
        alert(err?.response?.data?.message || "이미지 업로드에 실패했습니다.");
      },
    });
    e.target.value = "";
  };

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { title: "", imageUrl: "", linkUrl: "", displayOrder: "" },
  });

  const currentImageUrl = watch("imageUrl");

  const onSubmit = async (form) => {
    const payload = {
      title: form.title.trim(),
      imageUrl: form.imageUrl.trim(),
      linkUrl: form.linkUrl.trim(),
      displayOrder: form.displayOrder ? parseInt(form.displayOrder) : null,
    };
    if (!payload.title) {
      alert("제목을 입력하세요.");
      return;
    }
    try {
      if (!editingId) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        setEditingId(null);
      }
      reset();
    } catch (e) {
      alert(e?.response?.data?.message || "처리 실패");
    }
  };

  const onEdit = (banner) => {
    setEditingId(banner.bannerId);
    setValue("title", banner.title);
    setValue("imageUrl", banner.imageUrl || "");
    setValue("linkUrl", banner.linkUrl || "");
    setValue("displayOrder", banner.displayOrder);
  };

  const onCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...sortedBanners];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    const bannerIds = newOrder.map((b) => b.bannerId);
    orderMutation.mutate(bannerIds);
  };

  const handleMoveDown = (index) => {
    if (index === sortedBanners.length - 1) return;
    const newOrder = [...sortedBanners];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    const bannerIds = newOrder.map((b) => b.bannerId);
    orderMutation.mutate(bannerIds);
  };

  const theme = { text: "#ffffff", muted: "#9ca3af", border: "#545763", accent: "#475569", danger: "#94a3b8" };
  if (isLoading) return <div style={{ color: theme.muted }}>불러오는 중...</div>;
  if (isError) return <div style={{ color: "#94a3b8" }}>에러: {String(error?.message || error)}</div>;

  return (
    <div style={{ color: theme.text }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>배너 관리</h2>
        <span style={{ color: theme.muted }}>총 {sortedBanners.length}개</span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px", display: "grid", gap: "10px", maxWidth: 700 }}>
        <input placeholder="배너 제목" style={inputStyle} {...register("title", { required: "제목을 입력하세요." })} />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageFileSelect} style={{ display: "none" }} />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadImageMutation.isPending} style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #545763",
              background: "transparent",
              color: theme.text,
              fontWeight: 600,
              cursor: uploadImageMutation.isPending ? "not-allowed" : "pointer",
              opacity: uploadImageMutation.isPending ? 0.6 : 1,
            }}>
              {uploadImageMutation.isPending ? "업로드 중…" : "이미지 파일 선택"}
            </button>
            <span style={{ color: theme.muted, fontSize: "0.875rem" }}>또는 URL 직접 입력</span>
          </div>
          <input placeholder="이미지 URL (파일 선택 시 자동 입력)" style={inputStyle} {...register("imageUrl")} />
          {currentImageUrl?.trim() && (
            <div style={{ marginTop: "4px" }}>
              <span style={{ fontSize: "12px", color: theme.muted }}>미리보기</span>
              <div style={{ marginTop: "4px", borderRadius: "8px", overflow: "hidden", border: "1px solid #545763", maxWidth: 280, maxHeight: 140 }}>
                <img src={imageFullUrl(currentImageUrl)} alt="배너 미리보기" style={{ width: "100%", height: "auto", display: "block" }} onError={(e) => { e.target.style.display = "none"; }} />
              </div>
            </div>
          )}
        </div>
        <input placeholder="링크 URL (선택)" style={inputStyle} {...register("linkUrl")} />
        <input type="number" placeholder="표시 순서 (비워두면 자동)" style={inputStyle} {...register("displayOrder")} />
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
            <th style={thStyle}>순서</th>
            <th style={thStyle}>제목</th>
            <th style={thStyle}>이미지</th>
            <th style={thStyle}>링크</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>관리</th>
          </tr>
        </thead>
        <tbody>
          {sortedBanners.map((banner, index) => (
            <tr key={banner.bannerId}>
              <td style={tdStyle}>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <button onClick={() => handleMoveUp(index)} disabled={index === 0 || orderMutation.isPending} style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #545763",
                    background: "transparent",
                    color: theme.text,
                    cursor: index === 0 ? "not-allowed" : "pointer",
                    opacity: index === 0 ? 0.5 : 1,
                  }}>
                    ↑
                  </button>
                  <span>{banner.displayOrder}</span>
                  <button onClick={() => handleMoveDown(index)} disabled={index === sortedBanners.length - 1 || orderMutation.isPending} style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #545763",
                    background: "transparent",
                    color: theme.text,
                    cursor: index === sortedBanners.length - 1 ? "not-allowed" : "pointer",
                    opacity: index === sortedBanners.length - 1 ? 0.5 : 1,
                  }}>
                    ↓
                  </button>
                </div>
              </td>
              <td style={tdStyle}>{banner.title}</td>
              <td style={tdStyle}>
                {banner.imageUrl ? (
                  <img src={imageFullUrl(banner.imageUrl)} alt={banner.title} style={{ maxWidth: "100px", maxHeight: "50px", objectFit: "contain", borderRadius: "4px" }} onError={(e) => { e.target.style.display = "none"; }} />
                ) : (
                  "-"
                )}
              </td>
              <td style={tdStyle}>
                {banner.linkUrl ? (
                  <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">링크</a>
                ) : (
                  "-"
                )}
              </td>
              <td style={tdStyle}>
                <button onClick={() => toggleMutation.mutate(banner.bannerId)} disabled={toggleMutation.isPending} style={{
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid #545763",
                  background: banner.isActive ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)",
                  color: theme.text,
                  fontWeight: 700,
                  cursor: toggleMutation.isPending ? "not-allowed" : "pointer",
                  opacity: toggleMutation.isPending ? 0.6 : 1,
                }}>
                  {banner.isActive ? "ON" : "OFF"}
                </button>
              </td>
              <td style={tdStyle}>
                <button type="button" onClick={() => onEdit(banner)} style={{
                  padding: "6px 10px",
                  borderRadius: "10px",
                  border: "1px solid #545763",
                  background: "transparent",
                  color: theme.text,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginRight: "8px",
                }}>
                  수정
                </button>
                <button onClick={() => deleteMutation.mutate(banner.bannerId)} disabled={deleteMutation.isPending} style={{
                  padding: "6px 10px",
                  borderRadius: "10px",
                  border: "1px solid #94a3b8",
                  background: "transparent",
                  color: "#94a3b8",
                  fontWeight: 700,
                  cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                  opacity: deleteMutation.isPending ? 0.6 : 1,
                }}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
          {sortedBanners.length === 0 && (
            <tr>
              <td style={tdStyle} colSpan={6}>등록된 배너가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
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
