import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_VARIANT_ID, getVariantById } from "../variants/registry";
import type { ViewVariant } from "../variants/types";

const VARIANT_STORAGE_KEY = "isometric-index:view-variant";
const SIDENAV_COLLAPSED_KEY = "isometric-index:sidenav-collapsed";

function readStorage(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore quota / private browsing errors
  }
}

interface ViewVariantContextValue {
  activeVariant: ViewVariant;
  activeVariantId: string;
  setVariant: (id: string) => void;
  sidenavCollapsed: boolean;
  setSidenavCollapsed: (collapsed: boolean) => void;
  toggleSidenavCollapsed: () => void;
  canSwitchVariant: boolean;
  isTransitioning: boolean;
  setTransitioning: (transitioning: boolean) => void;
}

const ViewVariantContext = createContext<ViewVariantContextValue | null>(null);

export function ViewVariantProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeVariantId, setActiveVariantId] = useState(() =>
    readStorage(VARIANT_STORAGE_KEY, DEFAULT_VARIANT_ID),
  );
  const [sidenavCollapsed, setSidenavCollapsedState] = useState(() =>
    readStorage(SIDENAV_COLLAPSED_KEY, "false") === "true",
  );
  const [isTransitioning, setTransitioning] = useState(false);
  const [isArticleOpen, setIsArticleOpen] = useState(
    () => location.pathname.startsWith("/article/"),
  );

  useEffect(() => {
    setIsArticleOpen(location.pathname.startsWith("/article/"));
  }, [location.pathname]);

  const activeVariant = useMemo(
    () => getVariantById(activeVariantId),
    [activeVariantId],
  );

  const canSwitchVariant = !isArticleOpen && !isTransitioning;

  const setSidenavCollapsed = useCallback((collapsed: boolean) => {
    setSidenavCollapsedState(collapsed);
    writeStorage(SIDENAV_COLLAPSED_KEY, String(collapsed));
  }, []);

  const toggleSidenavCollapsed = useCallback(() => {
    setSidenavCollapsedState((prev) => {
      const next = !prev;
      writeStorage(SIDENAV_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  const setVariant = useCallback(
    (id: string) => {
      if (!canSwitchVariant || id === activeVariantId) return;
      if (!getVariantById(id)) return;

      setActiveVariantId(id);
      writeStorage(VARIANT_STORAGE_KEY, id);

      const nextVariant = getVariantById(id);
      const areaMatch = location.pathname.match(/^\/area\/([^/]+)/);

      if (nextVariant.routing === "stacked") {
        if (areaMatch || (!location.pathname.startsWith("/article/") && location.pathname !== "/")) {
          navigate("/", { replace: true });
        }
      } else if (areaMatch) {
        navigate(`/area/${areaMatch[1]}`, { replace: true });
      } else if (!location.pathname.startsWith("/article/")) {
        navigate("/", { replace: true });
      }
    },
    [activeVariantId, canSwitchVariant, location.pathname, navigate],
  );

  const value = useMemo(
    () => ({
      activeVariant,
      activeVariantId,
      setVariant,
      sidenavCollapsed,
      setSidenavCollapsed,
      toggleSidenavCollapsed,
      canSwitchVariant,
      isTransitioning,
      setTransitioning,
    }),
    [
      activeVariant,
      activeVariantId,
      setVariant,
      sidenavCollapsed,
      setSidenavCollapsed,
      toggleSidenavCollapsed,
      canSwitchVariant,
      isTransitioning,
    ],
  );

  return (
    <ViewVariantContext.Provider value={value}>{children}</ViewVariantContext.Provider>
  );
}

export function useViewVariant() {
  const context = useContext(ViewVariantContext);
  if (!context) {
    throw new Error("useViewVariant must be used within ViewVariantProvider");
  }
  return context;
}

export function useViewVariantTransition() {
  const { setTransitioning } = useViewVariant();
  return { setTransitioning };
}
