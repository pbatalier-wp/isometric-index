import { useOpenArticle } from "../hooks/useOpenArticle";
import { getRandomArticle } from "../data/articles";

interface CenterMarkProps {
  disabled?: boolean;
}

export function CenterMark({ disabled = false }: CenterMarkProps) {
  const openArticle = useOpenArticle();

  const handleLucky = () => {
    if (disabled) return;
    const article = getRandomArticle();
    openArticle(article.slug, article.id);
  };

  return (
    <div className={`center-mark${disabled ? " center-mark--disabled" : ""}`}>
      <p className="center-mark-copy">Start somewhere unexpected.</p>
      <button
        type="button"
        className="center-lucky-button"
        onClick={handleLucky}
        disabled={disabled}
      >
        I&apos;m feeling curious
      </button>
    </div>
  );
}
