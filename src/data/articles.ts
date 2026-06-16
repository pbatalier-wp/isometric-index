import type { ResearchArticle } from "../types/research";

export const researchArticles: ResearchArticle[] = [
  {
    id: "layout-aware-id-fraud",
    slug: "layout-aware-id-fraud",
    title: "Layout-Aware Representation Learning for Open-Set ID Fraud Discovery",
    date: "Apr 2026",
    authors: ["Jinxing Li", "Nicholas Ren", "Cathy Chang", "Hongkai Pan", "Daniel George"],
    summary:
      "A layout-aware representation learning framework for identity documents that maps each document into a discriminative 512-dimensional embedding space with strong inter-class separability and intra-class compactness.",
    areaId: "fraud-intelligence",
    href: "https://withpersona.com/research/layout-aware-representation-learning-for-open-set-id-fraud-discovery",
    thumbnail: "/thumbnails/fraud-1.png",
  },
  {
    id: "identity-muling",
    slug: "identity-muling",
    title: "Identity Muling and Techniques to Combat the Rise of Second-Party Fraud",
    date: "Jan 2026",
    authors: ["Louis DeNicola"],
    summary:
      "Examines how identity muling works, why it is difficult to detect, and which risk signals and defense strategies organizations can use to identify and disrupt identity mule operations.",
    areaId: "fraud-intelligence",
    href: "https://withpersona.com/research/identity-muling-and-techniques-to-combat-the-rise-of-second-party-fraud",
    thumbnail: "/thumbnails/fraud-2.png",
  },
  {
    id: "threat-domain-partitioning",
    slug: "threat-domain-partitioning",
    title: "Threat Domain Partitioning and Sorted Rejection Labeling: Benchmarking for Adversarial Environments",
    date: "Oct 2025",
    authors: ["Charles Yeh", "Daniel Lee", "Hongkai Pan"],
    summary:
      "Introduces a practical framework that defines business-aligned benchmarks that are cheaper to label, stable under performative drift, and foundational for systematic fraud model development.",
    areaId: "fraud-intelligence",
    href: "https://withpersona.com/research/threat-domain-partitioning-and-sorted-rejection-labeling-benchmarking-for-adversarial-environments",
    thumbnail: "/thumbnails/fraud-3.png",
  },
  {
    id: "modernizing-kyb",
    slug: "modernizing-kyb",
    title: "Modernizing Know Your Business (KYB) with online credibility signals",
    date: "Oct 2025",
    authors: ["Sam Breitbach"],
    summary:
      "Explores how integrating online credibility signals from a business's website, social media presence, and customer reviews adds vital context to KYB.",
    areaId: "fraud-intelligence",
    href: "https://withpersona.com/research/modernizing-know-your-business-kyb-with-online-credibility-signals",
    thumbnail: "/thumbnails/privacy.png",
  },
  {
    id: "identity-leakage-isp",
    slug: "identity-leakage-isp",
    title: "From Measurement to Mitigation: Quantifying and Reducing Identity Leakage in Image Representation Encoders with Linear Subspace Removal",
    date: "Apr 2026",
    authors: ["Daniel George", "Charles Yeh", "Daniel Lee", "Yifei Zhang"],
    summary:
      "A comprehensive study of identity leakage in visual embeddings and Identity Sanitization Projection (ISP) as an effective mitigation toward more privacy-friendly vision models.",
    areaId: "data-privacy",
    href: "https://withpersona.com/research/from-measurement-to-mitigation-quantifying-and-reducing-identity-leakage-in-image-representation-encoders-with-linear-subspace-removal",
    thumbnail: "/thumbnails/privacy.png",
  },
  {
    id: "global-age-verification",
    slug: "global-age-verification",
    title: "Navigating Global Age Verification Laws in the Digital Era",
    date: "Oct 2024",
    authors: ["Kerwell Liao"],
    summary:
      "Understanding emerging laws and implementing adaptable, privacy-conscious verification systems to protect minors, maintain trust, and meet evolving global standards.",
    areaId: "online-safety",
    href: "https://withpersona.com/research/navigating-global-age-verification-laws-in-the-digital-era",
    thumbnail: "/thumbnails/safety-1.png",
  },
  {
    id: "atlas",
    slug: "atlas",
    title: "Atlas: a global age regulation tracker",
    date: "May 2026",
    authors: ["Persona"],
    summary:
      "Persona Atlas is a free, collaborative database and API designed to help compliance teams navigate the complex landscape of age assurance and privacy laws.",
    areaId: "online-safety",
    href: "https://withpersona.com/research/atlas-a-global-age-regulation-tracker",
    thumbnail: "/thumbnails/atlas.png",
    isTool: true,
  },
  {
    id: "understanding-digital-identity",
    slug: "understanding-digital-identity",
    title: "Understanding and Verifying Digital Identity",
    date: "Jul 2025",
    authors: ["Shana Vu"],
    summary:
      "Digital identity connects who people are in the real world with how they interact online, combining personal data, behavioral patterns, and technological signals to establish authenticity.",
    areaId: "accessible-identity",
    href: "https://withpersona.com/research/understanding-and-verifying-digital-identity",
    thumbnail: "/thumbnails/accessible.png",
  },
];

export function getArticlesByArea(areaId: string): ResearchArticle[] {
  return researchArticles.filter((article) => article.areaId === areaId);
}

export function getArticleById(id: string): ResearchArticle | undefined {
  return researchArticles.find((article) => article.id === id);
}

export function getArticleBySlug(slug: string): ResearchArticle | undefined {
  return researchArticles.find((article) => article.slug === slug);
}
