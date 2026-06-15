import { Routes, Route } from "react-router-dom";
import ConcentricIndex from "./pages/ConcentricIndex";
import IsometricView from "./pages/IsometricView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ConcentricIndex />} />
      <Route path="/area/:areaSlug" element={<IsometricView />} />
    </Routes>
  );
}
