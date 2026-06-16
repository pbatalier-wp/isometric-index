import { useRef } from "react";
import { motion } from "motion/react";
import type { MorphEndpoint } from "../../../components/AreaTransitionCards";
import type { ResearchArea, ResearchArticle } from "../../../types/research";
import { STAGGER_DELAY } from "../config/transitions";

interface ColumnTransitionCardsProps {
  area: ResearchArea;
  articles: ResearchArticle[];
  fromByArticle: Map<string, MorphEndpoint>;
  toByArticle: Map<string, MorphEndpoint>;
  onComplete: () => void;
}

interface ColumnMorphCardProps {
  area: ResearchArea;
  article: ResearchArticle;
  from: MorphEndpoint;
  to: MorphEndpoint;
  index: number;
  onComplete: () => void;
}

function ColumnMorphCard({ area, article, from, to, index, onComplete }: ColumnMorphCardProps) {
  return (
    <motion.div
      initial={{
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        borderRadius: from.borderRadius,
      }}
      animate={{
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        borderRadius: to.borderRadius,
      }}
      transition={{
        duration: 0.6,
        ease: [0, 0, 0.2, 1],
        delay: index * STAGGER_DELAY,
      }}
      onAnimationComplete={onComplete}
      style={{
        position: "absolute",
        zIndex: 200,
        overflow: "hidden",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        backgroundColor: area.accentColor,
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
  );
}

export function ColumnTransitionCards({
  area,
  articles,
  fromByArticle,
  toByArticle,
  onComplete,
}: ColumnTransitionCardsProps) {
  const completedRef = useRef(0);

  const handleComplete = () => {
    completedRef.current += 1;
    if (completedRef.current === articles.length) onComplete();
  };

  return (
    <>
      {articles.map((article, index) => {
        const from = fromByArticle.get(article.id);
        const to = toByArticle.get(article.id);
        if (!from || !to) return null;

        return (
          <ColumnMorphCard
            key={article.id}
            area={area}
            article={article}
            from={from}
            to={to}
            index={index}
            onComplete={handleComplete}
          />
        );
      })}
    </>
  );
}
