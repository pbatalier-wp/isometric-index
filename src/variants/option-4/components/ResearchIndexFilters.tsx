import type { ArticleTypeFilter } from "../utils/filterArticles";

interface ResearchIndexFiltersProps {
  selectedTypes: ArticleTypeFilter[];
  onToggleType: (type: ArticleTypeFilter) => void;
}

const TYPE_OPTIONS: { id: ArticleTypeFilter; label: string }[] = [
  { id: "tool", label: "Tool" },
  { id: "paper", label: "Paper" },
  { id: "blog", label: "Blog" },
];

const MONO_STYLE = {
  margin: 0,
  fontFamily: "var(--font-mono)",
  fontSize: 24,
  lineHeight: 1.28,
  color: "var(--color-text)",
  opacity: 0.5,
  whiteSpace: "nowrap" as const,
};

export function ResearchIndexFilters({
  selectedTypes,
  onToggleType,
}: ResearchIndexFiltersProps) {
  return (
    <div style={{ marginTop: 48 }}>
      <p style={MONO_STYLE}>[ type ]</p>
      <ul
        style={{
          listStyle: "none",
          margin: "8px 0 0",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {TYPE_OPTIONS.map((option) => {
          const isSelected = selectedTypes.includes(option.id);
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => onToggleType(option.id)}
                style={{
                  display: "flex",
                  gap: 4,
                  alignItems: "flex-start",
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={MONO_STYLE}>[ ]</span>
                <span
                  style={{
                    paddingTop: 4,
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    lineHeight: 1.24,
                    letterSpacing: "-0.16px",
                    color: "var(--color-text)",
                    opacity: isSelected ? 1 : 0.5,
                  }}
                >
                  {option.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
