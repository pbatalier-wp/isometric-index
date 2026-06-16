import { useRef, useState } from "react";
import { motion, type Transition } from "motion/react";
import type { ResearchArea, ResearchArticle } from "../types/research";
import { buildFlattenTransition } from "../utils/transitionMotion";

export interface MorphEndpoint {
  left: number;
  top: number;
  width: number;
  height: number;
  rotateY: number;
  borderRadius: number;
}

export type TransitionDirection = "to-isometric" | "to-concentric";

interface AreaTransitionCardsProps {
  area: ResearchArea;
  articles: ResearchArticle[];
  fromByArticle: Map<string, MorphEndpoint>;
  toByArticle: Map<string, MorphEndpoint>;
  direction: TransitionDirection;
  morphTransition: Transition;
  flattenDuration?: number;
  onComplete: () => void;
}

interface MorphCardProps {
  area: ResearchArea;
  article: ResearchArticle;
  from: MorphEndpoint;
  to: MorphEndpoint;
  direction: TransitionDirection;
  morphTransition: Transition;
  flattenDuration: number;
  onComplete: () => void;
}

function MorphCard({
  area,
  article,
  from,
  to,
  direction,
  morphTransition,
  flattenDuration,
  onComplete,
}: MorphCardProps) {
  const [phase, setPhase] = useState<"flatten" | "morph">(
    direction === "to-concentric" ? "flatten" : "morph",
  );
  const flattenTransition = buildFlattenTransition(flattenDuration);
  const isFlattening = direction === "to-concentric" && phase === "flatten";

  return (
    <motion.div
      initial={{
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
      }}
      animate={{
        left: isFlattening ? from.left : to.left,
        top: isFlattening ? from.top : to.top,
        width: isFlattening ? from.width : to.width,
        height: isFlattening ? from.height : to.height,
      }}
      transition={isFlattening ? { duration: 0 } : morphTransition}
      onAnimationComplete={() => {
        if (!isFlattening) onComplete();
      }}
      style={{
        position: "absolute",
        zIndex: 200,
      }}
    >
      <motion.div
        initial={{ rotateY: from.rotateY, borderRadius: from.borderRadius }}
        animate={{
          rotateY: isFlattening ? 0 : to.rotateY,
          borderRadius: isFlattening ? 6.4 : to.borderRadius,
        }}
        transition={isFlattening ? flattenTransition : morphTransition}
        onAnimationComplete={() => {
          if (isFlattening) setPhase("morph");
        }}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          backgroundColor: area.accentColor,
          transformOrigin: "center center",
        }}
      >
        <img
          src={article.thumbnail}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function AreaTransitionCards({
  area,
  articles,
  fromByArticle,
  toByArticle,
  direction,
  morphTransition,
  flattenDuration = 0.22,
  onComplete,
}: AreaTransitionCardsProps) {
  const completedRef = useRef(0);

  const handleComplete = () => {
    completedRef.current += 1;
    if (completedRef.current === articles.length) onComplete();
  };

  return (
    <>
      {articles.map((article) => {
        const from = fromByArticle.get(article.id);
        const to = toByArticle.get(article.id);
        if (!from || !to) return null;

        return (
          <MorphCard
            key={article.id}
            area={area}
            article={article}
            from={from}
            to={to}
            direction={direction}
            morphTransition={morphTransition}
            flattenDuration={flattenDuration}
            onComplete={handleComplete}
          />
        );
      })}
    </>
  );
}
