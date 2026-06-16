import { Routes, Route } from "react-router-dom";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { ArticleTrailProvider } from "./context/ArticleTrailContext";
import { ResearchNavProvider } from "./context/ResearchNavContext";
import IndexLayout from "./layout/IndexLayout";

export default function App() {
  return (
    <ArticleTrailProvider>
      <ResearchNavProvider>
        <Routes>
          <Route path="/*" element={<IndexLayout />} />
        </Routes>
        <DialRoot position="top-right" />
      </ResearchNavProvider>
    </ArticleTrailProvider>
  );
}
