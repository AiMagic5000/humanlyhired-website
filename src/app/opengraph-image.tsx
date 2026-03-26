import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Humanly Hired - Enterprise Staffing & Recruitment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "white",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "24px",
            }}
          >
            <span style={{ fontSize: "48px", fontWeight: "bold", color: "#2563eb" }}>H</span>
          </div>
          <span style={{ fontSize: "48px", fontWeight: "bold", color: "white" }}>
            Humanly Hired
          </span>
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Enterprise Staffing & Recruitment Platform
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "50px",
            gap: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "36px", fontWeight: "bold", color: "white" }}>10K+</span>
            <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>Active Jobs</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "36px", fontWeight: "bold", color: "white" }}>50K+</span>
            <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>Candidates</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "36px", fontWeight: "bold", color: "white" }}>2K+</span>
            <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>Employers</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
