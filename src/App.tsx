import { useEffect, useRef, useState } from "react";
import "./App.css";
import { motion, useAnimate } from "motion/react";

const COLORS = [
  "#e63946",
  "#f4a261",
  "#e9c46a",
  "#2a9d8f",
  "#264653",
  "#a8dadc",
  "#457b9d",
  "#1d3557",
  "#f1faee",
  "#6d6875",
];

const CARD_W = 200;
const CARD_H = 260;
const STEP_X = 40;
const CARD_COUNT = 50;

interface Focused {
  cardId: number;
  color: string;
  originX: number;
  originY: number;
  zIndex: number;
}

function Modal({
  focused,
  onDismiss,
  dismissRef,
}: {
  focused: Focused;
  onDismiss: () => void;
  dismissRef: React.MutableRefObject<(() => void) | null>;
}) {
  const [scope, animate] = useAnimate();
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleDismiss = () => {
    if (backdropRef.current) {
      animate(backdropRef.current, { opacity: 0 }, { duration: 0.2 });
    }
    // Already absolute inside the container — zIndex works correctly
    animate(scope.current, { zIndex: focused.zIndex - 1 }, { duration: 0 })
      .then(() => animate(
        scope.current,
        { x: 0, y: 0, left: focused.originX + 150, top: focused.originY, width: CARD_W, height: CARD_H, borderRadius: 4 },
        { type: "spring", stiffness: 400, damping: 40, restDelta: 1, restSpeed: 10 },
      ))
      .then(() => animate(scope.current, { left: focused.originX, rotateY: -15 }, { duration: 0.15, ease: "easeIn" }))
      .then(() => onDismiss());
  };

  useEffect(() => {
    dismissRef.current = handleDismiss;
    return () => { dismissRef.current = null; };
  });

  useEffect(() => {
    animate(
      scope.current,
      { left: focused.originX + 150, top: focused.originY, width: CARD_W, height: CARD_H, borderRadius: 4, rotateY: 0 },
      { duration: 0.2, ease: "easeOut" },
    ).then(() =>
      animate(
        scope.current,
        { left: "50%", top: "50%", x: "-50%", y: "-50%", width: 400, height: 520, borderRadius: 12 },
        { type: "spring", stiffness: 280, damping: 28 },
      )
    );
  }, []);

  return (
    <>
      {/* Backdrop is fixed, outside stacking context — that's fine */}
      <motion.div
        ref={backdropRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleDismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 10000,
        }}
      />
      {/* Card is absolute inside the container — shares stacking context with cards */}
      <motion.div
        ref={scope}
        onClick={handleDismiss}
        initial={{
          left: focused.originX,
          top: focused.originY,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 4,
          rotateY: -15,
          x: 0,
          y: 0,
          zIndex: 99999,
        }}
        style={{
          position: "absolute",
          backgroundColor: focused.color,
          cursor: "pointer",
        }}
      />
    </>
  );
}

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [focused, setFocused] = useState<Focused | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const accRef = useRef(0);
  const dismissRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (focused) return;
      e.preventDefault();
      accRef.current += e.deltaY * 0.4;
      setScroll(accRef.current);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [focused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleModalDismiss = () => {
    setTransitioning(true);
    setFocused(null);
    setTimeout(() => setTransitioning(false), 100);
  };

  const loopSpan = CARD_COUNT * STEP_X;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        perspective: "4000px",
        perspectiveOrigin: "50% 50%",
        pointerEvents: transitioning ? "none" : "auto",
      }}
    >
      {Array.from({ length: CARD_COUNT }, (_, i) => {
        const laps = Math.floor(scroll / loopSpan);
        const rawPos = i * STEP_X - scroll;
        const pos = ((rawPos % loopSpan) + loopSpan) % loopSpan;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const x = vw - CARD_W + 40 - (pos / loopSpan) * (vw + loopSpan);
        const y = 40 + (pos / loopSpan) * (vh + 200);

        const cardId = i + laps * CARD_COUNT + (rawPos < 0 ? CARD_COUNT : 0);
        const color = COLORS[((cardId % COLORS.length) + COLORS.length) % COLORS.length];

        const isThisFocused = focused?.cardId === cardId;

        return (
          <motion.div
            key={i}
            whileHover="hover"
            style={{
              position: "absolute",
              left: x,
              top: y,
              zIndex: Math.round(pos),
              cursor: "pointer",
              visibility: isThisFocused ? "hidden" : "visible",
            }}
            onClick={() =>
              setFocused({ cardId, color, originX: x, originY: y, zIndex: Math.round(pos) })
            }
          >
            <motion.div
              variants={{
                hover: { y: -50, transition: { duration: 0.2 } },
                initial: { y: 0 },
              }}
              style={{
                width: CARD_W,
                height: CARD_H,
                backgroundColor: color,
                transform: "rotateY(-15deg)",
                transformOrigin: "center center",
                borderRadius: 4,
              }}
            />
          </motion.div>
        );
      })}

      {/* Modal lives inside the container so it shares the same stacking context */}
      {focused && (
        <Modal
          key={focused.cardId}
          focused={focused}
          onDismiss={handleModalDismiss}
          dismissRef={dismissRef}
        />
      )}
    </div>
  );
}
