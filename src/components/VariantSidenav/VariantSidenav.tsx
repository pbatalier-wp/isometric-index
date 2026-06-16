import { useViewVariant } from "../../context/ViewVariantContext";
import { VIEW_VARIANTS } from "../../variants/registry";
import "./variant-sidenav.css";

export function VariantSidenav() {
  const {
    activeVariantId,
    setVariant,
    sidenavCollapsed,
    toggleSidenavCollapsed,
    canSwitchVariant,
  } = useViewVariant();

  return (
    <nav
      className="variant-sidenav"
      data-collapsed={sidenavCollapsed}
      data-disabled={!canSwitchVariant}
      aria-label="View variants"
    >
      <div className="variant-sidenav-inner">
        <div className="variant-sidenav-toolbar">
          <span className="variant-sidenav-title">Variants</span>
          <button
            type="button"
            className="variant-sidenav-toggle"
            onClick={toggleSidenavCollapsed}
            aria-expanded={!sidenavCollapsed}
            aria-label={sidenavCollapsed ? "Expand variant panel" : "Collapse variant panel"}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M9 3L4 7l5 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <span className="variant-sidenav-collapsed-label">Variants</span>

        <div className="variant-sidenav-content" role="list">
          {VIEW_VARIANTS.map((variant) => (
            <button
              key={variant.id}
              type="button"
              role="listitem"
              className="variant-sidenav-item"
              data-active={variant.id === activeVariantId}
              disabled={!canSwitchVariant}
              onClick={() => setVariant(variant.id)}
              aria-current={variant.id === activeVariantId ? "true" : undefined}
            >
              <span className="variant-sidenav-item-label">{variant.label}</span>
              {variant.description && (
                <span className="variant-sidenav-item-description">{variant.description}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
