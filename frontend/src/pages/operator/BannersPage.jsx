import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosInstance"
import { ToastContext } from "../../contexts/ToastContext";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { TableSkeleton } from "../../components/Skeleton";

const API_BASE = "http://localhost:8080";
const imageFullUrl = (url) => {
  if (!url || !url.trim()) return null;
  const trimmedUrl = url.trim();
  // 숫자만 있는 경우 무시
  if (/^\d+$/.test(trimmedUrl)) return null;
  // 이미 전체 URL인 경우
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }
  // 상대 경로인 경우
  if (trimmedUrl.startsWith("/")) {
    return `${API_BASE}${trimmedUrl}`;
  }
  // 그 외의 경우
  return `${API_BASE}/${trimmedUrl}`;
};

export default function BannersPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchKeyword, setSearchKeyword] = useState("");
  const fileInputRef = useRef(null);
  const toast = useContext(ToastContext);

  const { data: banners = [], isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["adminBanners"],
    queryFn: async () => {
      const res = await api.get("/admin/banners");
      return res.data;
    },
  });


  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/admin/banners", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast?.success("배너가 추가되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "추가에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await api.put(`/admin/banners/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      setEditingId(null);
      toast?.success("배너가 수정되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "수정에 실패했습니다.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/admin/banners/${id}/toggle`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast?.success("상태가 변경되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "상태 변경에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast?.success("배너가 삭제되었습니다.");
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "삭제에 실패했습니다.");
      setDeleteConfirmId(null);
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (bannerIds) => {
      const res = await api.put("/admin/banners/display-order", bannerIds);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast?.success("순서가 변경되었습니다.");
    },
    onError: (error) => {
      toast?.error(error?.response?.data?.message || "순서 변경에 실패했습니다.");
    },
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
      toast?.error("제목을 입력하세요.");
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

  const onEdit = (banner) => {
    setEditingId(banner.bannerId);
    setValue("title", banner.title);
    setValue("imageUrl", banner.imageUrl || "");
    setValue("linkUrl", banner.linkUrl || "");
    setValue("displayOrder", banner.displayOrder);
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
      // F5는 기본 새로고침 동작을 사용하도록 제거
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingId, onCancelEdit]);

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
  let filteredAndSortedBanners = [...banners];

  // 검색 필터링
  if (searchKeyword.trim()) {
    filteredAndSortedBanners = filteredAndSortedBanners.filter((b) =>
      b.title?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

  // 정렬
  if (sortField) {
    filteredAndSortedBanners.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'bannerId') {
        aVal = a.bannerId ?? 0;
        bVal = b.bannerId ?? 0;
      } else if (sortField === 'title') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
      } else if (sortField === 'displayOrder') {
        aVal = a.displayOrder ?? 0;
        bVal = b.displayOrder ?? 0;
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
  } else {
    filteredAndSortedBanners = [...banners].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  const handleMoveUp = (index) => {
    if (index === 0) return;
    // displayOrder 기준으로 정렬된 배열 사용
    const sortedBanners = [...banners].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const currentBanner = filteredAndSortedBanners[index];
    const targetIndex = sortedBanners.findIndex(b => b.bannerId === currentBanner.bannerId);
    
    if (targetIndex === 0) return;
    
    const newOrder = [...sortedBanners];
    [newOrder[targetIndex - 1], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[targetIndex - 1]];
    const bannerIds = newOrder.map((b) => b.bannerId);
    orderMutation.mutate(bannerIds);
  };

  const handleMoveDown = (index) => {
    if (index === filteredAndSortedBanners.length - 1) return;
    // displayOrder 기준으로 정렬된 배열 사용
    const sortedBanners = [...banners].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const currentBanner = filteredAndSortedBanners[index];
    const targetIndex = sortedBanners.findIndex(b => b.bannerId === currentBanner.bannerId);
    
    if (targetIndex === sortedBanners.length - 1) return;
    
    const newOrder = [...sortedBanners];
    [newOrder[targetIndex], newOrder[targetIndex + 1]] = [newOrder[targetIndex + 1], newOrder[targetIndex]];
    const bannerIds = newOrder.map((b) => b.bannerId);
    orderMutation.mutate(bannerIds);
  };

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
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>배너 관리</h2>
          <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>
            메인 페이지에 표시될 배너를 관리합니다. 이미지 파일을 업로드하거나 URL을 입력할 수 있습니다.
          </p>
        </div>
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div style={{ color: TEXT_WHITE, animation: "fadeIn 0.3s ease-in" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>배너 관리</h2>
        <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.875rem", lineHeight: 1.6 }}>
          메인 페이지에 표시될 배너를 관리합니다. 이미지 파일을 업로드하거나 URL을 입력할 수 있습니다.
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
          placeholder="배너 제목으로 검색..."
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
          {editingId ? "배너 수정" : "새 배너 추가"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "10px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              배너 제목 <span style={{ color: DANGER }}>*</span>
            </label>
            <input 
              placeholder="배너 제목을 입력하세요" 
              style={{
                ...inputStyle,
                width: "100%",
              }} 
              {...register("title", { required: "제목을 입력하세요." })} 
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "10px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              이미지
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageFileSelect} style={{ display: "none" }} />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                disabled={uploadImageMutation.isPending} 
                style={{
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: `1px solid ${BORDER}`,
                  background: "transparent",
                  color: TEXT_WHITE,
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  cursor: uploadImageMutation.isPending ? "not-allowed" : "pointer",
                  opacity: uploadImageMutation.isPending ? 0.6 : 1,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!uploadImageMutation.isPending) {
                    e.currentTarget.style.borderColor = ACCENT;
                    e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BORDER;
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {uploadImageMutation.isPending ? "업로드 중…" : "파일 선택"}
              </button>
              <span style={{ color: TEXT_MUTED, fontSize: "0.875rem", alignSelf: "center" }}>또는</span>
            </div>
            <input 
              placeholder="이미지 URL을 직접 입력하세요" 
              style={{
                ...inputStyle,
                width: "100%",
                marginTop: "12px",
              }} 
              {...register("imageUrl")} 
            />
            {currentImageUrl?.trim() && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ marginBottom: "6px", fontSize: "0.875rem", color: TEXT_MUTED, fontWeight: 600 }}>미리보기</div>
                <div style={{ 
                  borderRadius: "10px", 
                  overflow: "hidden", 
                  border: `2px solid ${BORDER}`, 
                  maxWidth: "100%",
                  background: "#2C2F40",
                  padding: "8px",
                }}>
                  {currentImageUrl && imageFullUrl(currentImageUrl) ? (
                    <img 
                      src={imageFullUrl(currentImageUrl)} 
                      alt="배너 미리보기" 
                      style={{ 
                        width: "100%", 
                        maxWidth: "600px",
                        height: "auto",
                        display: "block"
                      }} 
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div style={{ 
                      padding: "20px", 
                      textAlign: "center", 
                      color: TEXT_MUTED,
                      fontSize: "0.875rem"
                    }}>
                      유효한 이미지 URL을 입력하세요
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              링크 URL
            </label>
            <input 
              placeholder="클릭 시 이동할 URL (선택사항)" 
              style={{
                ...inputStyle,
                width: "100%",
              }} 
              {...register("linkUrl")} 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px", color: TEXT_MUTED, fontSize: "0.875rem", fontWeight: 600 }}>
              표시 순서 (선택)
            </label>
            <input 
              type="number"
              placeholder="숫자가 작을수록 앞에 표시됩니다" 
              style={{
                ...inputStyle,
                width: "100%",
              }} 
              {...register("displayOrder")} 
            />
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                border: "none",
                background: ACCENT,
                color: TEXT_WHITE,
                fontWeight: 700,
                fontSize: "0.9375rem",
                cursor: (createMutation.isPending || updateMutation.isPending) ? "not-allowed" : "pointer",
                opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1,
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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

      {/* 배너 목록 */}
      <div style={{ marginTop: "32px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>배너 목록</h3>
          <div style={{ color: TEXT_MUTED, fontSize: "0.875rem" }}>
            총 <strong style={{ color: TEXT_WHITE }}>{filteredAndSortedBanners.length}</strong>개
          </div>
        </div>

        <div style={{
          background: CARD_BG,
          borderRadius: "12px",
          border: `1px solid ${BORDER}`,
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1120px" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                  <th style={{ ...thStyle, padding: "14px 16px", width: "80px" }}>순서</th>
                  <th style={{ ...thStyle, padding: "14px 16px", width: "120px" }}>이미지</th>
                  <th style={{ ...thStyle, padding: "14px 16px", width: "200px" }}>제목</th>
                  <th style={{ ...thStyle, padding: "14px 16px", width: "300px" }}>링크</th>
                  <th style={{ ...thStyle, padding: "14px 16px", width: "100px" }}>상태</th>
                  <th style={{ ...thStyle, padding: "14px 16px", width: "320px" }}>작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedBanners.map((banner, index) => (
                  <tr
                    key={banner.bannerId}
                    style={{
                      backgroundColor: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.05)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <td style={{ ...tdStyle, padding: "14px 16px", textAlign: "center", fontWeight: 600 }}>
                      {index + 1}
                    </td>
                    <td style={{ ...tdStyle, padding: "14px 20px" }}>
                      <div style={{
                        width: "120px",
                        height: "60px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: `1px solid ${BORDER}`,
                        background: "linear-gradient(135deg, rgba(71,85,105,0.3), rgba(44,47,64,0.5))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}>
                        {banner.imageUrl && imageFullUrl(banner.imageUrl) ? (
                          <>
                            <img 
                              src={imageFullUrl(banner.imageUrl)} 
                              alt={banner.title} 
                              style={{ 
                                width: "100%",
                                height: "100%", 
                                objectFit: "cover",
                                display: "block",
                              }} 
                              onError={(e) => { 
                                e.target.style.display = "none";
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = "flex";
                              }
                            }}
                          />
                          <div style={{ 
                            display: "none",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            alignItems: "center",
                            justifyContent: "center",
                            color: TEXT_MUTED,
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            background: "linear-gradient(135deg, rgba(71,85,105,0.3), rgba(44,47,64,0.5))",
                          }}>
                            이미지 없음
                          </div>
                        </>
                      ) : (
                        <div style={{ 
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: TEXT_MUTED,
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          opacity: 0.6,
                        }}>
                          없음
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 20px", fontWeight: 500, maxWidth: "200px" }}>
                    <div style={{ 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap",
                      title: banner.title
                    }}>
                      {banner.title}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 20px", maxWidth: "300px" }}>
                    {banner.linkUrl ? (
                      <a 
                        href={banner.linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: ACCENT, 
                          textDecoration: "none",
                          fontSize: "0.875rem",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={banner.linkUrl}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                      >
                        {banner.linkUrl}
                      </a>
                    ) : (
                      <span style={{ color: TEXT_MUTED, fontSize: "0.875rem" }}>-</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 20px", textAlign: "center" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      display: "inline-block",
                      background: banner.isActive === 1 
                        ? "rgba(34,197,94,0.2)" 
                        : "rgba(148,163,184,0.2)",
                      color: banner.isActive === 1 
                        ? "#86efac" 
                        : "#94a3b8",
                    }}>
                      {banner.isActive === 1 ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, padding: "14px 16px" }}>
                    <div style={{ 
                      display: "flex", 
                      gap: "4px", 
                      flexWrap: "nowrap",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}>
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0 || orderMutation.isPending}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: `1px solid ${BORDER}`,
                          background: "rgba(84, 87, 99, 0.1)",
                          color: TEXT_WHITE,
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: (index === 0 || orderMutation.isPending) ? "not-allowed" : "pointer",
                          opacity: (index === 0 || orderMutation.isPending) ? 0.4 : 0.9,
                          transition: "all 0.2s ease",
                          minWidth: "36px",
                        }}
                        onMouseEnter={(e) => {
                          if (index !== 0 && !orderMutation.isPending) {
                            e.currentTarget.style.background = ACCENT;
                            e.currentTarget.style.borderColor = ACCENT;
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(71, 85, 105, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index !== 0 && !orderMutation.isPending) {
                            e.currentTarget.style.background = "rgba(84, 87, 99, 0.1)";
                            e.currentTarget.style.borderColor = BORDER;
                            e.currentTarget.style.opacity = "0.9";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === filteredAndSortedBanners.length - 1 || orderMutation.isPending}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: `1px solid ${BORDER}`,
                          background: "rgba(84, 87, 99, 0.1)",
                          color: TEXT_WHITE,
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: (index === filteredAndSortedBanners.length - 1 || orderMutation.isPending) ? "not-allowed" : "pointer",
                          opacity: (index === filteredAndSortedBanners.length - 1 || orderMutation.isPending) ? 0.4 : 0.9,
                          transition: "all 0.2s ease",
                          minWidth: "36px",
                        }}
                        onMouseEnter={(e) => {
                          if (index !== filteredAndSortedBanners.length - 1 && !orderMutation.isPending) {
                            e.currentTarget.style.background = ACCENT;
                            e.currentTarget.style.borderColor = ACCENT;
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(71, 85, 105, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index !== filteredAndSortedBanners.length - 1 && !orderMutation.isPending) {
                            e.currentTarget.style.background = "rgba(84, 87, 99, 0.1)";
                            e.currentTarget.style.borderColor = BORDER;
                            e.currentTarget.style.opacity = "0.9";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => onEdit(banner)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "6px",
                          border: `1px solid ${ACCENT}`,
                          background: "rgba(71, 85, 105, 0.1)",
                          color: ACCENT,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                          minWidth: "60px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = ACCENT;
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(71, 85, 105, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(71, 85, 105, 0.1)";
                          e.currentTarget.style.color = ACCENT;
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => toggleMutation.mutate(banner.bannerId)}
                        disabled={toggleMutation.isPending}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "6px",
                          border: `1px solid ${banner.isActive === 1 ? "#94a3b8" : "#22c55e"}`,
                          background: banner.isActive === 1 ? "rgba(148, 163, 184, 0.1)" : "rgba(34, 197, 94, 0.1)",
                          color: banner.isActive === 1 ? "#94a3b8" : "#22c55e",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: toggleMutation.isPending ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                          minWidth: "60px",
                          opacity: toggleMutation.isPending ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!toggleMutation.isPending) {
                            e.currentTarget.style.background = banner.isActive === 1 ? "#94a3b8" : "#22c55e";
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = banner.isActive === 1 
                              ? "0 2px 8px rgba(148, 163, 184, 0.3)" 
                              : "0 2px 8px rgba(34, 197, 94, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!toggleMutation.isPending) {
                            e.currentTarget.style.background = banner.isActive === 1 ? "rgba(148, 163, 184, 0.1)" : "rgba(34, 197, 94, 0.1)";
                            e.currentTarget.style.color = banner.isActive === 1 ? "#94a3b8" : "#22c55e";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        {banner.isActive === 1 ? "비활성" : "활성"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(banner.bannerId)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "6px",
                          border: "1px solid #ef4444",
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#ef4444",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                          minWidth: "60px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#ef4444";
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(239, 68, 68, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                          e.currentTarget.style.color = "#ef4444";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAndSortedBanners.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle, padding: "48px 24px", textAlign: "center", color: TEXT_MUTED }} colSpan={6}>
                    <div style={{ marginBottom: "12px", fontWeight: 600 }}>배너 없음</div>
                    <div>등록된 배너가 없습니다. 위 폼을 사용하여 배너를 추가하세요.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        title="배너 삭제"
        message="정말로 이 배너를 삭제하시겠습니까?"
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteMutation.mutate(deleteConfirmId);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
        confirmText="삭제"
        cancelText="취소"
        confirmButtonStyle={{ background: "#ef4444", color: "#ffffff" }}
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
