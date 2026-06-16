import type { ArticleContent } from "../../types/research";
import {
  atlasContent,
  globalAgeVerificationContent,
  identityLeakageIspContent,
  identityMulingContent,
  layoutAwareIdFraudContent,
  modernizingKybContent,
  understandingDigitalIdentityContent,
} from "./articles";
import { threatDomainPartitioningContent } from "./threat-domain-partitioning";

const articleContentBySlug: Record<string, ArticleContent> = {
  "layout-aware-id-fraud": layoutAwareIdFraudContent,
  "identity-muling": identityMulingContent,
  "threat-domain-partitioning": threatDomainPartitioningContent,
  "modernizing-kyb": modernizingKybContent,
  "identity-leakage-isp": identityLeakageIspContent,
  "global-age-verification": globalAgeVerificationContent,
  atlas: atlasContent,
  "understanding-digital-identity": understandingDigitalIdentityContent,
};

export function getArticleContent(slug: string): ArticleContent | undefined {
  return articleContentBySlug[slug];
}
