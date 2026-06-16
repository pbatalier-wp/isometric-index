import { Routes, Route } from "react-router-dom";
import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { ArticleTrailProvider } from "./context/ArticleTrailContext";
import { ResearchNavProvider } from "./context/ResearchNavContext";
import { ViewVariantProvider } from "./context/ViewVariantContext";
import { VariantSidenav } from "./components/VariantSidenav/VariantSidenav";
import IndexLayout from "./layout/IndexLayout";

export default function App() {
  return (
    <ViewVariantProvider>
      <ArticleTrailProvider>
        <ResearchNavProvider>
          <Routes>
            <Route path="/*" element={<IndexLayout />} />
          </Routes>
          <VariantSidenav />
          <DialRoot position="top-right" />
        </ResearchNavProvider>
      </ArticleTrailProvider>
    </ViewVariantProvider>
  );
}
