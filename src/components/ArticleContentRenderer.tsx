import type { ArticleContentBlock } from "../types/research";

interface ArticleContentRendererProps {
  blocks: ArticleContentBlock[];
}

function renderInlineText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} style={{ fontWeight: 500, color: "var(--article-h3-color)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function ArticleContentRenderer({ blocks }: ArticleContentRendererProps) {
  return (
    <div className="article-content-blocks">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={index}
                className={
                  block.variant === "lead" ? "article-paragraph article-lead" : "article-paragraph"
                }
              >
                {renderInlineText(block.text)}
              </p>
            );
          case "heading":
            if (block.level === 2) {
              return (
                <h2 key={index} className="article-h2">
                  {block.text}
                </h2>
              );
            }
            return (
              <h3 key={index} className="article-h3">
                {block.text}
              </h3>
            );
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag key={index} className="article-list">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {typeof item === "string" ? (
                      renderInlineText(item)
                    ) : (
                      <>
                        <strong>{item.term}</strong>
                        {`: ${item.text}`}
                      </>
                    )}
                  </li>
                ))}
              </ListTag>
            );
          }
          case "divider":
            return <hr key={index} className="article-divider" />;
          case "figure":
            return (
              <figure key={index} className="article-figure">
                <img src={block.src} alt={block.alt ?? ""} />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          case "references":
            return (
              <div key={index} className="article-references">
                {block.items.map((item, itemIndex) => (
                  <p key={itemIndex} className="article-paragraph">
                    {item}
                  </p>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
