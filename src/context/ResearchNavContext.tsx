import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { AreaPillNav } from "../components/AreaPillNav";
import { researchAreas } from "../data/areas";

export type ResearchNavView = "concentric" | "isometric";

export interface ResearchNavPageState {
  activeSlug: string | null;
  hidden: boolean;
  disabled: boolean;
  onSelectArea: (slug: string) => void;
  onBackToConcentric: () => void;
}

interface ResearchNavContextValue {
  setPageState: (state: ResearchNavPageState) => void;
}

const noop = () => {};

const defaultPageState: ResearchNavPageState = {
  activeSlug: null,
  hidden: false,
  disabled: false,
  onSelectArea: noop,
  onBackToConcentric: noop,
};

const ResearchNavContext = createContext<ResearchNavContextValue | null>(null);

export function ResearchNavProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [pageState, setPageState] = useState<ResearchNavPageState>(defaultPageState);

  const routeMatch = location.pathname.match(/^\/area\/([^/]+)/);
  const isArticleRoute = location.pathname.startsWith("/article/");
  const view: ResearchNavView = routeMatch ? "isometric" : "concentric";
  const routeAreaSlug = routeMatch?.[1] ?? null;
  const activeSlug = pageState.activeSlug ?? routeAreaSlug;

  const contextValue = useMemo(() => ({ setPageState }), []);

  return (
    <ResearchNavContext.Provider value={contextValue}>
      {children}
      <AreaPillNav
        areas={researchAreas}
        activeSlug={activeSlug}
        homeActive={view === "concentric"}
        onSelect={pageState.onSelectArea}
        onLeadClick={pageState.onBackToConcentric}
        leadDisabled={view === "concentric"}
        hidden={pageState.hidden || isArticleRoute}
        disabled={pageState.disabled}
      />
    </ResearchNavContext.Provider>
  );
}

export function useResearchNav(state: ResearchNavPageState) {
  const context = useContext(ResearchNavContext);
  if (!context) {
    throw new Error("useResearchNav must be used within ResearchNavProvider");
  }

  const { setPageState } = context;

  useLayoutEffect(() => {
    setPageState(state);
  }, [
    state.activeSlug,
    state.hidden,
    state.disabled,
    state.onSelectArea,
    state.onBackToConcentric,
    setPageState,
  ]);
}
