import React from "react";
import {createRoot} from "react-dom/client";
import {KageLandingPage} from "@designcodeio/threeui/components/KageLandingPage";
import "@designcodeio/threeui/style.css";
import "./styles.css";

function App(){
  return <KageLandingPage className="kage-portfolio" sourceUrl="/landing-pages/kage.html"/>;
}
createRoot(document.getElementById("root")).render(<App/>);
