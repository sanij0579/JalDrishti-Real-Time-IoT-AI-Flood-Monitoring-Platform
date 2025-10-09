import React from "react";

type CardProps = {
  text: string;
  children?: React.ReactNode;
};

export default function Card({ text, children }: CardProps) {
  return (
    <div style={{
      maxWidth: "600px",
      margin: "1rem auto",
      padding: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      backgroundColor: "#f5f5f5"
    }}>
      <p style={{ marginBottom: "0.5rem" }}>{text}</p>
      {children}
    </div>
  );
}