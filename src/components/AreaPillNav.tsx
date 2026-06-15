import type { ResearchArea } from "../types/research";

interface AreaPillNavProps {
  areas: ResearchArea[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}

export function AreaPillNav({ areas, activeSlug, onSelect }: AreaPillNavProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 2,
        zIndex: 50,
      }}
    >
      {areas.map((area) => {
        const isActive = activeSlug === area.slug;
        return (
          <button
            key={area.id}
            type="button"
            onClick={() => onSelect(area.slug)}
            style={{
              height: 40,
              padding: "10px 16px 11px",
              borderRadius: 100,
              border: "none",
              background: isActive ? "var(--color-pill-active)" : "transparent",
              fontFamily: "var(--font-serif)",
              fontSize: 16,
              color: "var(--color-text)",
              opacity: isActive ? 1 : 0.5,
              cursor: "pointer",
              letterSpacing: "-0.16px",
              lineHeight: 1.24,
              whiteSpace: "nowrap",
            }}
          >
            {area.label}
          </button>
        );
      })}
    </nav>
  );
}
