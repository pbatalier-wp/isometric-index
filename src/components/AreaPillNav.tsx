import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { ResearchArea } from "../types/research";
import { bridgeWidthForHeight, buildChainClipPath } from "../utils/navChromePath";

interface AreaPillNavProps {
  areas: ResearchArea[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
  onLeadClick: () => void;
  homeActive?: boolean;
  leadDisabled?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  placement?: "top" | "bottom";
}

const GLASS_SHADOW_LIGHT =
  "inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(255, 255, 255, 0.1)";

const GLASS_SHADOW_DARK =
  "inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.22)";

const NAV_SEGMENT_STYLE = {
  position: "relative" as const,
  display: "flex",
  alignItems: "stretch",
  width: "fit-content" as const,
  padding: 4,
};

const SEGMENT_GAP = 6;

const BUTTON_STYLE = {
  height: 40,
  padding: "10px 16px 11px",
  borderRadius: 100,
  border: "none",
  background: "transparent",
  fontFamily: "var(--font-serif)",
  fontSize: 16,
  cursor: "pointer",
  letterSpacing: "-0.16px",
  lineHeight: 1.24,
  whiteSpace: "nowrap" as const,
  position: "relative" as const,
  zIndex: 1,
};

interface PillState {
  left: number;
  width: number;
  opacity: number;
}

const HOME_TARGET = "__home";

export function AreaPillNav({
  areas,
  activeSlug,
  onSelect,
  onLeadClick,
  homeActive = false,
  leadDisabled = false,
  hidden = false,
  disabled = false,
  placement = "bottom",
}: AreaPillNavProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const leadSegmentRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLButtonElement>(null);
  const navSegmentRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const [chromeHovered, setChromeHovered] = useState(false);
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const [pill, setPill] = useState<PillState>({ left: 0, width: 0, opacity: 0 });
  const [chainClip, setChainClip] = useState<string | undefined>();

  const inverted = chromeHovered;
  const activeTarget =
    homeActive && !activeSlug ? HOME_TARGET : activeSlug;
  const target = hoveredTarget ?? activeTarget;
  const chromeColor = inverted ? "rgba(255, 255, 255, 0.84)" : "var(--color-text)";

  useLayoutEffect(() => {
    const updateClip = () => {
      const row = rowRef.current;
      const leadSegment = leadSegmentRef.current;
      const bridge = bridgeRef.current;
      if (!row || !leadSegment || !bridge) return;

      const width = row.offsetWidth;
      const leadEnd = leadSegment.offsetWidth;
      const height = row.offsetHeight;
      const bridgeWidth = bridgeWidthForHeight(height);

      bridge.style.width = `${bridgeWidth}px`;

      if (width > 0 && leadEnd > 0 && bridgeWidth > 0 && height > 0) {
        setChainClip(buildChainClipPath(width, leadEnd, bridgeWidth, height));
      }
    };

    updateClip();

    const row = rowRef.current;
    const leadSegment = leadSegmentRef.current;
    const bridge = bridgeRef.current;
    if (!row || !leadSegment || !bridge) return;

    const observer = new ResizeObserver(updateClip);
    observer.observe(row);
    observer.observe(leadSegment);
    observer.observe(bridge);
    if (navSegmentRef.current) observer.observe(navSegmentRef.current);

    return () => observer.disconnect();
  }, [areas]);

  useLayoutEffect(() => {
    if (!target || !rowRef.current) {
      setPill((current) => ({ ...current, opacity: 0 }));
      return;
    }

    if (target === HOME_TARGET) {
      const lead = leadRef.current;
      const leadSegment = leadSegmentRef.current;
      if (!lead || !leadSegment) return;

      setPill({
        left: leadSegment.offsetLeft + lead.offsetLeft,
        width: lead.offsetWidth,
        opacity: 1,
      });
      return;
    }

    const button = buttonRefs.current.get(target);
    const navSegment = navSegmentRef.current;
    if (!button || !navSegment) return;

    setPill({
      left: navSegment.offsetLeft + button.offsetLeft,
      width: button.offsetWidth,
      opacity: 1,
    });
  }, [target, areas, homeActive, activeSlug]);

  const isLeadHighlighted =
    hoveredTarget === HOME_TARGET ||
    (activeTarget === HOME_TARGET && hoveredTarget === null);

  return (
    <motion.nav
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.35 }}
      style={{
        position: "fixed",
        ...(placement === "top" ? { top: 24 } : { bottom: 24 }),
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <div
        ref={rowRef}
        onMouseEnter={() => setChromeHovered(true)}
        onMouseLeave={() => {
          setChromeHovered(false);
          setHoveredTarget(null);
        }}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          width: "fit-content",
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            clipPath: chainClip,
            background: inverted ? "rgba(20, 22, 32, 0.94)" : "rgba(128, 128, 128, 0.07)",
            boxShadow: inverted ? GLASS_SHADOW_DARK : GLASS_SHADOW_LIGHT,
            backdropFilter: "blur(1.6px) saturate(1.08) brightness(1.01)",
            WebkitBackdropFilter: "blur(1.6px) saturate(1.08) brightness(1.01)",
            transition: "background 0.28s ease, box-shadow 0.28s ease",
            pointerEvents: "none",
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: pill.left,
            width: pill.width,
            height: "calc(100% - 8px)",
            borderRadius: 999,
            background: inverted ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.1)",
            opacity: pill.opacity,
            transform: "translateY(-50%) scaleX(1.08)",
            transition:
              "left 0.24s ease, width 0.24s ease, opacity 0.18s ease, background 0.28s ease",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div ref={leadSegmentRef} style={NAV_SEGMENT_STYLE}>
          <button
            ref={leadRef}
            type="button"
            onClick={leadDisabled ? undefined : onLeadClick}
            onMouseEnter={() => setHoveredTarget(HOME_TARGET)}
            style={{
              ...BUTTON_STYLE,
              color: chromeColor,
              opacity: isLeadHighlighted ? 1 : 0.5,
              cursor: leadDisabled ? "default" : "pointer",
              transition: "opacity 0.18s ease, color 0.28s ease",
            }}
          >
            All research
          </button>
        </div>
        <div
          ref={bridgeRef}
          aria-hidden
          style={{
            flexShrink: 0,
            width: 27,
            pointerEvents: "none",
          }}
        />
        <div
          ref={navSegmentRef}
          style={{
            ...NAV_SEGMENT_STYLE,
            gap: SEGMENT_GAP,
          }}
        >
          {areas.map((area) => {
            const isActive = activeSlug === area.slug;
            const isHovered = hoveredTarget === area.slug;
            const isHighlighted = isActive || isHovered;

            return (
              <button
                key={area.id}
                ref={(node) => {
                  if (node) buttonRefs.current.set(area.slug, node);
                  else buttonRefs.current.delete(area.slug);
                }}
                type="button"
                onClick={() => onSelect(area.slug)}
                onMouseEnter={() => setHoveredTarget(area.slug)}
                style={{
                  ...BUTTON_STYLE,
                  color: chromeColor,
                  opacity: isHighlighted ? 1 : 0.5,
                  transition: "opacity 0.18s ease, color 0.28s ease",
                }}
              >
                {area.label}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
