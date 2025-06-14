'use client';
import { useEffect, useState } from 'react';

export default function Quote() {
  const quotes = [
   {
  content: "Believe you can and you're halfway there.",
  author: "Theodore Roosevelt"
},
{
  content: "Your time is limited, so don’t waste it living someone else’s life.",
  author: "Steve Jobs"
},
{
  content: "I never dream of success. I work for it.",
  author: "Estée Lauder"
},
{
  content: "Don't watch the clock; do what it does. Keep going.",
  author: "Sam Levenson"
},
{
  content: "It always seems impossible until it's done.",
  author: "Nelson Mandela"
},
{
  content: "The future depends on what you do today.",
  author: "Mahatma Gandhi"
},
{
  content: "If you want to lift yourself up, lift up someone else.",
  author: "Booker T. Washington"
},
{
  content: "You miss 100% of the shots you don’t take.",
  author: "Wayne Gretzky"
},
{
  content: "Quality means doing it right when no one is looking.",
  author: "Henry Ford"
},
{
  content: "In the middle of every difficulty lies opportunity.",
  author: "Albert Einstein"
}

  ];

  const [quote, setQuote] = useState(null);

  const pickRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    pickRandomQuote();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(to bottom right, #ffffff, #f3f4f6)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        {quote && (
          <>
            <p
              style={{
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: "#333",
                marginBottom: "12px"
              }}
            >
              "{quote.content}"
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#666",
                textAlign: "right"
              }}
            >
              – {quote.author}
            </p>
          </>
        )}
      </div>

      <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={pickRandomQuote}
          style={{
            padding: "6px 16px",
            borderRadius: "999px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "0.85rem",
            transition: "background-color 0.2s ease"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
        >
          New Quote
        </button>
      </div>
    </div>
  );
}
