import { useState, useContext, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { ToastContext } from "../../App";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { TableSkeleton } from "../../components/Skeleton";

export default function ServiceProductsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchKeyword, setSearchKeyword] = useState("");
  const toast = useContext(ToastContext);

  const { data: products = [], isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const res = await api.get("/admin/products");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/admin/products", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast?.success("상품이 추가되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "추가에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await api.put(`/admin/products/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setEditingId(null);
      toast?.success("상품이 수정되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "수정에 실패했습니다.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/products/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast?.success("상태가 변경되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "상태 변경에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast?.success("상품이 삭제되었습니다.");
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "삭제에 실패했습니다.");
      setDeleteConfirmId(null);
    },
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
      toast?.error("상품명을 입력하세요.");
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

  const onEdit = (product) => {
    setEditingId(product.productId);
    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("price", product.price || "");
    setValue("isActive", product.isActive);
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
      if (e.key === 'F5') {
        e.preventDefault();
        refetch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingId, refetch, onCancelEdit]);

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
  let filteredAndSortedProducts = [...products];

  // 검색 필터링
  if (searchKeyword.trim()) {
    filteredAndSortedProducts = filteredAndSortedProducts.filter((p) =>
      p.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

  // 정렬
  if (sortField) {
    filteredAndSortedProducts.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'productId') {
        aVal = a.productId ?? 0;
        bVal = b.productId ?? 0;
      } else if (sortField === 'name' || sortField === 'description') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
      } else if (sortField === 'price') {
        aVal = a.price ?? 0;
        bVal = b.price ?? 0;
      } else if (sortField === 'isActive') {
        aVal = a.isActive ?? false;
        bVal = b.isActive ?? false;
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

  return (
    <div style={{ color: TEXT_WHITE }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800 }}>서비스 상품 관리</h2>
        <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem" }}>
          서비스에서 제공하는 상품을 관리합니다.
        </p>
      </div>

      {/* 검색 영역 */}
      <div style={{ 
        marginBottom: "20px",
        background: CARD_BG,
        padding: "16px 20px",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        animation: "fadeIn 0.4s ease-in 0.05s both",
      }}>
        <input
          type="text"
          placeholder="상품명 또는 설명으로 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: `1px solid ${BORDER}`,
            background: "#2C2F40",
            color: TEXT_WHITE,
            fontSize: "0.9375rem",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = ACCENT}
          onBlur={(e) => e.target.style.borderColor = BORDER}
        />
      </div>

      {/* 폼 카드 */}
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
          {editingId ? "상품 수정" : "새 상품 추가"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "14px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              상품명 <span style={{ color: DANGER }}>*</span>
            </label>
            <input 
              placeholder="상품명을 입력하세요" 
              style={{
                ...inputStyle,
                width: "100%",
              }} 
              {...register("name", { required: "상품명을 입력하세요." })} 
            />
            {errors.name && (
              <div style={{ marginTop: "6px", color: DANGER, fontSize: "0.8125rem" }}>
                {errors.name.message}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              설명 (선택)
            </label>
            <textarea 
              placeholder="상품 설명을 입력하세요" 
              rows={4} 
              style={{
                ...inputStyle,
                width: "100%",
                resize: "vertical",
              }} 
              {...register("description")} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              가격 (선택)
            </label>
            <input 
              type="number" 
              placeholder="가격을 입력하세요" 
              step="0.01" 
              style={{
                ...inputStyle,
                width: "100%",
              }} 
              {...register("price")} 
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

      {/* 상품 목록 */}
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
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>상품 목록</h3>
          <span style={{ color: TEXT_MUTED, fontSize: "0.875rem" }}>
            총 <strong style={{ color: TEXT_WHITE }}>{products.length}</strong>개
          </span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th 
                style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort('productId')}
                onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
              >
                ID {sortField === 'productId' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort('name')}
                onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
              >
                상품명 {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort('description')}
                onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
              >
                설명 {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort('price')}
                onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
              >
                가격 {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                style={{ ...thStyle, padding: "14px 20px", cursor: "pointer", userSelect: "none" }}
                onClick={() => handleSort('isActive')}
                onMouseEnter={(e) => e.currentTarget.style.color = TEXT_WHITE}
                onMouseLeave={(e) => e.currentTarget.style.color = TEXT_MUTED}
              >
                상태 {sortField === 'isActive' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ ...thStyle, padding: "14px 20px" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProducts.map((product, index) => (
                <tr 
                  key={product.productId}
                  style={{
                    backgroundColor: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)",
                    transition: "all 0.15s ease",
                    animation: `fadeIn 0.2s ease-in ${index * 0.02}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "scale(1.001)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 600 }}>{product.productId}</td>
                  <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 600 }}>{product.name}</td>
                  <td style={{ ...tdStyle, padding: "14px 20px", maxWidth: "300px" }}>
                    {product.description ? (
                      <span style={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {product.description}
                      </span>
                    ) : (
                      <span style={{ color: TEXT_MUTED }}>-</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 600, color: "#fbbf24" }}>
                    {product.price ? `${product.price.toLocaleString()}원` : <span style={{ color: TEXT_MUTED }}>-</span>}
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 20px" }}>
                    <button 
                      onClick={() => toggleMutation.mutate(product.productId)} 
                      disabled={toggleMutation.isPending} 
                      style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        border: "none",
                        background: product.isActive ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)",
                        color: product.isActive ? "#86efac" : "#94a3b8",
                        fontWeight: 700,
                        fontSize: "0.8125rem",
                        cursor: toggleMutation.isPending ? "not-allowed" : "pointer",
                        opacity: toggleMutation.isPending ? 0.6 : 1,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!toggleMutation.isPending) {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {product.isActive ? "ON" : "OFF"}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        type="button" 
                        onClick={() => onEdit(product)} 
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: `1px solid ${BORDER}`,
                          background: "transparent",
                          color: TEXT_WHITE,
                          fontWeight: 600,
                          fontSize: "0.8125rem",
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
                        수정
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(product.productId)} 
                        disabled={deleteMutation.isPending} 
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border: `1px solid ${DANGER}`,
                          background: "transparent",
                          color: DANGER,
                          fontWeight: 600,
                          fontSize: "0.8125rem",
                          cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                          opacity: deleteMutation.isPending ? 0.6 : 1,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (!deleteMutation.isPending) {
                            e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAndSortedProducts.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle, padding: "48px 24px", textAlign: "center", color: TEXT_MUTED }} colSpan={6}>
                    <div style={{ marginBottom: "12px", fontWeight: 600 }}>
                      {searchKeyword ? "검색 결과 없음" : "상품 없음"}
                    </div>
                    <div>
                      {searchKeyword 
                        ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
                        : "등록된 상품이 없습니다."}
                    </div>
                    {!searchKeyword && (
                      <div style={{ marginTop: "8px", fontSize: "0.875rem" }}>
                        위 폼을 사용하여 상품을 추가하세요.
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="상품 삭제"
        message="정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
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
