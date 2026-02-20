import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../../api/axiosInstance"

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
  transition: "all 0.2s ease",
  position: "relative",
  overflow: "hidden",
};
const cardHover = {
  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
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

  // CS 상담 상태별 분포 데이터
  const { data: csConsultations = [] } = useQuery({
    queryKey: ["csConsultationsForChart"],
    queryFn: async () => {
      const res = await api.get("/admin/cs/consultations");
      return res.data;
    },
  });

  // 공지사항 데이터 (타입별 분포용)
  const { data: notices = [] } = useQuery({
    queryKey: ["noticesForChart"],
    queryFn: async () => {
      const res = await api.get("/admin/notices");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div style={{ 
        padding: 48, 
        textAlign: "center", 
        color: TEXT_MUTED,
        animation: "fadeIn 0.3s ease-in"
      }}>
        <div style={{ 
          marginBottom: 12, 
          fontWeight: 600,
          animation: "pulse 1.5s ease-in-out infinite"
        }}>로딩 중</div>
        <div style={{ fontSize: "0.875rem" }}>대시보드 데이터를 불러오는 중...</div>
      </div>
    );
  }
  if (isError) {
    return (
      <div style={{ 
        padding: 48, 
        textAlign: "center", 
        color: "#94a3b8",
        animation: "fadeIn 0.3s ease-in"
      }}>
        <div style={{ marginBottom: 12, fontWeight: 600 }}>에러</div>
        <div>에러: {String(error?.message || error)}</div>
      </div>
    );
  }

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

  // 막대그래프용 데이터
  const barChartData = [
    { name: "회원", value: stats?.userCount ?? 0 },
    { name: "대기 CS", value: stats?.pendingCsCount ?? 0 },
    { name: "신고", value: stats?.pendingReportCount ?? 0 },
    { name: "공지", value: stats?.noticeCount ?? 0 },
    { name: "배너", value: stats?.bannerCount ?? 0 },
    { name: "블랙", value: stats?.blacklistCount ?? 0 },
    { name: "상품", value: stats?.productCount ?? 0 },
    { name: "블라인드", value: stats?.blindReasonCount ?? 0 },
  ];

  // CS 상담 상태별 분포 계산
  const csStatusCounts = {
    대기: 0,
    진행중: 0,
    완료: 0,
  };
  
  csConsultations.forEach((cs) => {
    if (cs.status === "PENDING") csStatusCounts.대기++;
    else if (cs.status === "IN_PROGRESS") csStatusCounts.진행중++;
    else if (cs.status === "COMPLETED") csStatusCounts.완료++;
  });

  // 공지사항 타입별 분포 계산
  const noticeTypeCounts = {
    일반: 0,
    사기동향: 0,
    매뉴얼: 0,
  };
  
  notices.forEach((notice) => {
    if (notice.type === "GENERAL") noticeTypeCounts.일반++;
    else if (notice.type === "FRAUD_TREND") noticeTypeCounts.사기동향++;
    else if (notice.type === "MANUAL") noticeTypeCounts.매뉴얼++;
  });

  // 파이 차트용 데이터 - CS 상담이 있으면 CS 상태별, 없으면 공지사항 타입별
  const totalCs = csStatusCounts.대기 + csStatusCounts.진행중 + csStatusCounts.완료;
  const totalNotices = noticeTypeCounts.일반 + noticeTypeCounts.사기동향 + noticeTypeCounts.매뉴얼;
  
  let pieChartData = [];
  let pieChartTitle = "";
  let pieChartColors = {};
  
  if (totalCs > 0) {
    // CS 상담이 있으면 CS 상태별 분포 표시
    pieChartData = [
      { name: "대기", value: csStatusCounts.대기 },
      { name: "진행중", value: csStatusCounts.진행중 },
      { name: "완료", value: csStatusCounts.완료 },
    ].filter(item => item.value > 0);
    pieChartTitle = "CS 상담 상태 분포";
    pieChartColors = {
      대기: "#f59e0b",      // 주황색
      진행중: "#3b82f6",    // 파란색
      완료: "#10b981",      // 초록색
    };
  } else if (totalNotices > 0) {
    // CS 상담이 없고 공지사항이 있으면 공지사항 타입별 분포 표시
    pieChartData = [
      { name: "일반", value: noticeTypeCounts.일반 },
      { name: "사기동향", value: noticeTypeCounts.사기동향 },
      { name: "매뉴얼", value: noticeTypeCounts.매뉴얼 },
    ].filter(item => item.value > 0);
    pieChartTitle = "공지사항 타입별 분포";
    pieChartColors = {
      일반: "#475569",      // 회색
      사기동향: "#ef4444",   // 빨간색
      매뉴얼: "#6366f1",     // 보라색
    };
  } else {
    // 둘 다 없으면 빈 배열
    pieChartData = [];
    pieChartTitle = "CS 상담 상태 분포";
  }

  return (
    <div style={{ padding: "0", color: TEXT_WHITE, animation: "fadeIn 0.4s ease-in" }}>
      <div style={{ marginBottom: "60px", marginTop: "8px" }}>
        <h1 style={{ fontWeight: 800, marginBottom: "24px", color: TEXT_WHITE, fontSize: "1.75rem" }}>운영자 대시보드</h1>
        <p style={{ color: TEXT_MUTED, marginBottom: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>
          항목을 클릭하면 해당 관리 페이지로 이동합니다.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "24px",
          marginBottom: "56px",
        }}
      >
        {items.map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              ...cardStyle,
              animation: `fadeIn 0.3s ease-in ${index * 0.05}s both`,
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, {
                ...cardHover,
                transform: "translateY(-2px)",
              });
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.borderColor = BORDER;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: "0.875rem", color: TEXT_MUTED, marginBottom: "12px", fontWeight: 500 }}>{item.label}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: TEXT_WHITE, lineHeight: 1.2 }}>{item.value.toLocaleString()}</div>
          </Link>
        ))}
      </div>

      {/* 그래프 섹션 */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "20px", 
        marginTop: "32px",
        marginBottom: "24px",
        animation: "fadeIn 0.5s ease-in 0.2s both",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "auto",
      }}>
        {/* 막대 그래프 */}
        <div style={{ 
          background: CARD_BG, 
          padding: "16px 20px", 
          borderRadius: "12px", 
          border: `1px solid ${BORDER}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.2s ease",
          minWidth: "0",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: TEXT_WHITE }}>
            통계 현황
          </h2>
          <div style={{ width: "100%", height: "260px", minHeight: 180, minWidth: "0", overflow: "hidden" }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
              <BarChart data={barChartData} margin={{ top: 12, right: 12, left: 8, bottom: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: TEXT_WHITE, fontSize: 10, fontWeight: 500 }}
                  stroke={BORDER}
                  angle={0}
                  textAnchor="middle"
                  height={32}
                  interval={0}
                />
                <YAxis 
                  tick={{ fill: TEXT_WHITE, fontSize: 10, fontWeight: 500 }}
                  stroke={BORDER}
                  width={38}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: CARD_BG, 
                    border: `1px solid ${BORDER}`,
                    borderRadius: "8px",
                    color: TEXT_WHITE,
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="value" fill="#475569" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 파이 차트 */}
        <div style={{ 
          background: CARD_BG, 
          padding: "16px 20px", 
          borderRadius: "12px", 
          border: `1px solid ${BORDER}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "box-shadow 0.2s ease",
          minWidth: "0",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: TEXT_WHITE }}>
            {pieChartTitle}
          </h2>
          {pieChartData.length > 0 ? (
            <div style={{ width: "100%", height: "240px", minHeight: 180, minWidth: "0", overflow: "hidden" }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={pieChartColors[entry.name] || "#475569"} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: CARD_BG, 
                      border: `1px solid ${BORDER}`,
                      borderRadius: "8px",
                      color: TEXT_WHITE,
                      fontSize: "12px",
                      fontWeight: 500
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ color: TEXT_WHITE, fontSize: "11px", fontWeight: 500 }}
                    iconSize={12}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: TEXT_MUTED, gap: "6px" }}>
              <div style={{ fontSize: "1.5rem", opacity: 0.5 }}>📊</div>
              <div style={{ fontSize: "0.875rem" }}>표시할 데이터가 없습니다.</div>
              <div style={{ fontSize: "0.8125rem", marginTop: "4px", opacity: 0.7 }}>
                CS 상담이나 공지사항을 추가하면<br />여기에 통계가 표시됩니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
