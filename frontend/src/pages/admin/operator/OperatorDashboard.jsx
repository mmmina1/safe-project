import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from '../../../api/axios'

const CARD_BG = "#363a4d";
const BORDER = "#545763";
const BORDER_LIGHT = "#6b7280";
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#9ca3af";

const cardStyle = {
  padding: "20px 24px",
  borderRadius: "12px",
  border: `1px solid ${BORDER}`,
  background: CARD_BG,
  minWidth: "160px",
  textDecoration: "none",
  color: TEXT_WHITE,
  display: "block",
  transition: "box-shadow 0.2s, border-color 0.2s",
};
const cardHover = {
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  borderColor: BORDER_LIGHT,
};

export default function OperatorDashboard() {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["operatorDashboardStats"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard/stats");
      return res.data;
    },
  });

  if (isLoading) return <div style={{ padding: 24, color: TEXT_MUTED }}>불러오는 중...</div>;
  if (isError) return <div style={{ padding: 24, color: "#94a3b8" }}>에러: {String(error?.message || error)}</div>;

  const items = [
    { label: "회원 수", value: stats?.userCount ?? 0, to: "/operator/users" },
    { label: "대기 CS", value: stats?.pendingCsCount ?? 0, to: "/operator/cs" },
    { label: "접수 신고", value: stats?.pendingReportCount ?? 0, to: "/operator/community-reports" },
    { label: "공지사항", value: stats?.noticeCount ?? 0, to: "/operator/notices" },
    { label: "배너", value: stats?.bannerCount ?? 0, to: "/operator/banners" },
    { label: "블랙리스트", value: stats?.blacklistCount ?? 0, to: "/operator/blacklist" },
    { label: "서비스 상품", value: stats?.productCount ?? 0, to: "/operator/products" },
    { label: "블라인드 사유", value: stats?.blindReasonCount ?? 0, to: "/operator/blind-reasons" },
  ];

  return (
    <div style={{ padding: "0 4px", color: TEXT_WHITE }}>
      <h1 style={{ fontWeight: 800, marginBottom: 8, color: TEXT_WHITE }}>운영자 대시보드</h1>
      <p style={{ color: TEXT_MUTED, marginBottom: 28 }}>
        항목을 클릭하면 해당 관리 페이지로 이동합니다.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.borderColor = BORDER;
            }}
          >
            <div style={{ fontSize: "0.875rem", color: TEXT_MUTED, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: TEXT_WHITE }}>{item.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
