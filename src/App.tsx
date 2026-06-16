import { Routes, Route } from "react-router-dom";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { ResearchNavProvider } from "./context/ResearchNavContext";
import IndexLayout from "./layout/IndexLayout";
import ConcentricIndex from "./pages/ConcentricIndex";
import IsometricView from "./pages/IsometricView";

export default function App() {
  return (
    <ResearchNavProvider>
      <Routes>
        <Route element={<IndexLayout />}>
          <Route path="/" element={<ConcentricIndex />} />
          <Route path="/area/:areaSlug" element={<IsometricView />} />
        </Route>
      </Routes>
      <DialRoot position="top-right" />
    </ResearchNavProvider>
  );
}
