import { useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "services" | "contact">("home");

  const renderTab = () => {
    switch (activeTab) {
      case "home": return <Home />;
      case "about": return <About />;
      case "services": return <Services />;
      case "contact": return <Contact />;
    }
  };

  return (
    <div id="root">
      <nav className="navbar">
        <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "active" : ""}>Home</button>
        <button onClick={() => setActiveTab("about")} className={activeTab === "about" ? "active" : ""}>About</button>
        <button onClick={() => setActiveTab("services")} className={activeTab === "services" ? "active" : ""}>Services</button>
        <button onClick={() => setActiveTab("contact")} className={activeTab === "contact" ? "active" : ""}>Contact</button>
      </nav>

      <main>
        {renderTab()}
      </main>
    </div>
  );
}

export default App;