"use client";

import { useEffect, useState } from "react";

export default function SlideshowWidget() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchImages = () => {
      const randomImages = Array.from({ length: 5 }, (_, i) => `https://picsum.photos/200/300?random=${i + 1}`);
      setImages(randomImages);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return <p style={{ textAlign: "center", color: "#555" }}>Loading slideshow...</p>;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f2f2f2"
      }}
    >
      <img
        src={images[index]}
        alt="Slideshow"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "opacity 0.5s ease-in-out"
        }}
      />
    </div>
  );
}
