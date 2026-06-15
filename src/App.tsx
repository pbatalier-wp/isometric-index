import { Routes, Route } from "react-router-dom";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import ConcentricIndex from "./pages/ConcentricIndex";
import IsometricView from "./pages/IsometricView";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ConcentricIndex />} />
        <Route path="/area/:areaSlug" element={<IsometricView />} />
      </Routes>
      <DialRoot position="top-right" />
    </>
  );
}
