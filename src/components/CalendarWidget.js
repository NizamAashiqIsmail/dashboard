"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

export default function CalendarWidget() {
  const [date, setDate] = useState(new Date());

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box"
      }}
    >


      <div
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "85%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "scale(0.9)",
          transformOrigin: "top center"
        }}
      >
        <Calendar
          onChange={setDate}
          value={date}
          style={{ width: "100%", maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}
