import React from "react";

type NavbarProps = {
  active: string;
  setActive: (name: string) => void;
};

export const Navbar: React.FC<NavbarProps> = ({ active, setActive }) => {
  const sections = ["Home", "About", "Services", "Contact"];

  return (
    <nav style={styles.nav}>
      {sections.map((sec) => (
        <button
          key={sec}
          onClick={() => setActive(sec)}
          style={{
            ...styles.btn,
            borderBottom: active === sec ? "3px solid #2563eb" : "3px solid transparent",
            color: active === sec ? "#2563eb" : "#1a1a1a",
          }}
        >
          {sec}
        </button>
      ))}
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    backgroundColor: "#ffffff",
    padding: "12px 0",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  btn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
    padding: "8px 14px",
    borderRadius: 8,
    transition: "all 0.3s ease",
    outline: "none",
  },
};

// Add hover effect globally
// You can put this in your index.css or a global CSS file
/*
button:hover {
  transform: scale(1.05);
  background-color: rgba(37, 99, 235, 0.1);
}
*/