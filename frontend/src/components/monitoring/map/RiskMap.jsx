import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "./RiskMap.css";

// 지역 좌표 매핑 (필수)
const REGION_COORDS = {
  서울: [37.5665, 126.9780],
  부산: [35.1796, 129.0756],
  대구: [35.8714, 128.6014],
  인천: [37.4563, 126.7052],
  광주: [35.1595, 126.8526],
  대전: [36.3504, 127.3845],
};

export default function RiskMap({ data }) {
  if (!data || data.length === 0) {
    return <div className="map-empty">지역 데이터 없음</div>;
  }

  return (
    <div className="risk-map-wrapper">
      <h3 className="map-title">📍 지역별 사기 발생 현황</h3>

      <MapContainer
        center={[36.5, 127.8]}
        zoom={7}
        className="risk-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data.map((region, idx) => {
          const position = REGION_COORDS[region.region];
          if (!position) return null;

          return (
            <CircleMarker
              key={idx}
              center={position}
              radius={Math.min(30, region.count)}
              pathOptions={{
                color: getColor(region.count),
                fillOpacity: 0.6,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div>
                  <strong>{region.region}</strong>
                  <br />
                  발생 건수: {region.count}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

// 발생 건수에 따른 색상
function getColor(count) {
  if (count > 80) return "#d32f2f";
  if (count > 40) return "#f57c00";
  if (count > 20) return "#fbc02d";
  return "#388e3c";
}
