"use client";
import React, { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourDeg = (hour + minute / 60) * 30;
  const minuteDeg = (minute + second / 60) * 6;
  const secondDeg = second * 6;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "relative",
          width: "160px",
          height: "160px",
          border: "4px solid #333",
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Hour hand */}
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: "4px",
            height: "40px",
            backgroundColor: "#000",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
          }}
        />
        {/* Minute hand */}
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: "3px",
            height: "55px",
            backgroundColor: "#555",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
          }}
        />
        {/* Second hand */}
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            width: "2px",
            height: "70px",
            backgroundColor: "red",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${secondDeg}deg)`,
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "10px",
            height: "10px",
            backgroundColor: "#000",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        />
      </div>

      {/* Digital Clock */}
      <div
        style={{
          fontSize: "20px",
          marginTop: "10px",
          fontFamily: "monospace",
          color: "#222"
        }}
      >
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}
