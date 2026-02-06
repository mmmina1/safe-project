import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axiosInstance"

export default function ServiceProductsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const res = await api.get("/api/admin/products");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/api/admin/products", payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await api.put(`/api/admin/products/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setEditingId(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/api/admin/products/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/admin/products/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminProducts"] }),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { name: "", description: "", price: "", isActive: true },
  });

  const onSubmit = async (form) => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price ? parseFloat(form.price) : null,
      isActive: form.isActive !== false,
    };
    if (!payload.name) {
      alert("상품명을 입력하세요.");
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

  const onEdit = (product) => {
    setEditingId(product.productId);
    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("price", product.price || "");
    setValue("isActive", product.isActive);
  };

  const onCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const theme = { text: "#ffffff", muted: "#9ca3af", border: "#545763", accent: "#475569", danger: "#94a3b8" };
  if (isLoading) return <div style={{ color: theme.muted }}>불러오는 중...</div>;
  if (isError) return <div style={{ color: "#94a3b8" }}>에러: {String(error?.message || error)}</div>;

  return (
    <div style={{ color: theme.text }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>서비스 상품 관리</h2>
        <span style={{ color: theme.muted }}>총 {products.length}개</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px", display: "grid", gap: "10px", maxWidth: 700 }}>
        <input placeholder="상품명" style={inputStyle} {...register("name", { required: "상품명을 입력하세요." })} />
        <textarea placeholder="설명" rows={3} style={inputStyle} {...register("description")} />
        <input type="number" placeholder="가격 (선택)" step="0.01" style={inputStyle} {...register("price")} />
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
            <th style={thStyle}>상품명</th>
            <th style={thStyle}>설명</th>
            <th style={thStyle}>가격</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td style={tdStyle}>{product.productId}</td>
              <td style={tdStyle}>{product.name}</td>
              <td style={tdStyle}>{product.description || "-"}</td>
              <td style={tdStyle}>{product.price ? `${product.price.toLocaleString()}원` : "-"}</td>
              <td style={tdStyle}>
                <button onClick={() => toggleMutation.mutate(product.productId)} disabled={toggleMutation.isPending} style={{
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid #545763",
                  background: product.isActive ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)",
                  color: theme.text,
                  fontWeight: 700,
                  cursor: toggleMutation.isPending ? "not-allowed" : "pointer",
                  opacity: toggleMutation.isPending ? 0.6 : 1,
                }}>
                  {product.isActive ? "ON" : "OFF"}
                </button>
              </td>
              <td style={tdStyle}>
                <button type="button" onClick={() => onEdit(product)} style={{
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
                <button onClick={() => deleteMutation.mutate(product.productId)} disabled={deleteMutation.isPending} style={{
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
          {products.length === 0 && (
            <tr>
              <td style={tdStyle} colSpan={6}>등록된 상품이 없습니다.</td>
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
