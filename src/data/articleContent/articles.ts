import type { ArticleContent } from "../../types/research";
import { paragraphs, section } from "./helpers";

export const layoutAwareIdFraudContent: ArticleContent = {
  slug: "layout-aware-id-fraud",
  abstract:
    "We develop a layout-aware representation learning framework for identity documents that maps each document into a discriminative 512-dimensional embedding space with strong inter-class separability and intra-class compactness.",
  blocks: [
    { type: "divider" },
    ...section(
      "Overview",
      ...paragraphs(
        "Built on DINOv3 and adapted to the document domain through supervised metric learning, the model achieves 99.83% accuracy on ID layout classification. The learned embedding similarity proves highly effective for detecting evolving real-world document fraud under adversarial and distribution-shifted settings.",
        "Identity document fraud increasingly exploits subtle layout variations, regional formats, and synthetic forgeries that evade template-matching systems. A layout-aware encoder learns to represent structural relationships between fields, seals, and security features rather than relying on brittle pixel-level cues.",
      ),
    ),
    ...section(
      "Method",
      ...paragraphs(
        "Each document is encoded into a 512-dimensional embedding optimized for open-set fraud discovery. Metric learning enforces compact clusters for legitimate layout families while preserving separation between known and emerging fraud patterns.",
        "The open-set formulation is critical for production fraud systems: new attack types appear continuously, and models must surface novel layouts as anomalies without retraining on every variant.",
      ),
    ),
    ...section(
      "Results",
      ...paragraphs(
        "On internal benchmarks spanning government IDs, passports, and regional identity cards, the layout-aware model maintains high separability under distribution shift. Embedding nearest-neighbor analysis surfaces previously unseen fraud templates for analyst review.",
        "The approach complements document authenticity checks by providing a scalable signal for template drift, re-use of compromised layouts, and synthetic document generation.",
      ),
    ),
  ],
};

export const identityMulingContent: ArticleContent = {
  slug: "identity-muling",
  abstract:
    "As identity verification systems improve at detecting deepfakes and synthetic identities, fraudsters are increasingly turning to identity muling, a form of second-party fraud that relies on real people willingly sharing their identities.",
  blocks: [
    { type: "divider" },
    ...section(
      "What is identity muling?",
      ...paragraphs(
        "Identity muling occurs when a legitimate individual completes verification on behalf of a fraudster, either willingly or under coercion. Because the biometric and document signals belong to a real person, muling attacks bypass many synthetic-fraud defenses.",
        "This white paper examines how identity muling works, why it is difficult to detect, how it differs from identity theft and other muling schemes, and which risk signals organizations can use to identify and disrupt operations.",
      ),
    ),
    ...section(
      "Detection challenges",
      ...paragraphs(
        "Second-party fraud produces genuine credentials and live biometrics, making conventional document and liveness checks insufficient. Fraud rings recruit mules through social engineering, gig-economy job posts, and coerced participation.",
        "Effective detection requires combining identity signals with behavioral, device, network, and velocity features that reveal orchestration patterns across accounts and sessions.",
      ),
    ),
    ...section(
      "Defense strategies",
      {
        type: "list",
        items: [
          {
            term: "Behavioral risk",
            text: "Unusual navigation patterns, rushed submissions, and coaching indicators during live capture.",
          },
          {
            term: "Device intelligence",
            text: "Shared hardware fingerprints across unrelated applicants and emulator usage.",
          },
          {
            term: "Network analysis",
            text: "Clustering of applicants linked through IP, referral codes, or payout destinations.",
          },
          {
            term: "Step-up verification",
            text: "Additional checks triggered when muling risk scores exceed policy thresholds.",
          },
        ],
      },
    ),
  ],
};

export const modernizingKybContent: ArticleContent = {
  slug: "modernizing-kyb",
  abstract:
    "Traditional Know Your Business checks confirm a company's legal existence but often miss signs of real-world legitimacy or fraud. Integrating online credibility signals adds vital context to KYB.",
  blocks: [
    { type: "divider" },
    ...section(
      "Beyond registry data",
      ...paragraphs(
        "Registry filings establish that a business exists on paper, but they rarely indicate whether the entity operates a legitimate storefront, maintains an active customer base, or presents synthetic credibility signals.",
        "This paper explores how website presence, social media activity, customer reviews, and digital footprint consistency can strengthen KYB decisions without adding unnecessary friction for legitimate merchants.",
      ),
    ),
    ...section(
      "Online credibility signals",
      {
        type: "list",
        items: [
          {
            term: "Web presence",
            text: "Domain age, SSL configuration, contact pages, and consistency between stated and observed business activity.",
          },
          {
            term: "Social proof",
            text: "Review volume, sentiment patterns, and whether engagement appears organic versus manufactured.",
          },
          {
            term: "Cross-source alignment",
            text: "Matching business names, addresses, and categories across registry, web, and social profiles.",
          },
        ],
      },
    ),
    ...section(
      "Operational impact",
      ...paragraphs(
        "Combining registry data with digital footprint analysis helps organizations verify businesses more holistically, accelerate onboarding, meet regulatory standards, and reduce fraud risk from shell companies and synthetic merchants.",
      ),
    ),
  ],
};

export const identityLeakageIspContent: ArticleContent = {
  slug: "identity-leakage-isp",
  abstract:
    "We present a comprehensive study of identity leakage in visual embeddings and introduce Identity Sanitization Projection (ISP) as an effective mitigation toward more privacy-friendly vision models.",
  blocks: [
    { type: "divider" },
    ...section(
      "Measuring identity leakage",
      ...paragraphs(
        "Modern vision encoders used in identity verification can inadvertently retain sensitive identity information in embeddings intended for downstream fraud or liveness tasks. Even when explicit labels are removed, linear probes can recover attributes such as identity or demographic correlates.",
        "We quantify leakage across encoder architectures and training regimes, establishing baselines for acceptable privacy risk in production verification stacks.",
      ),
    ),
    ...section(
      "Identity Sanitization Projection",
      ...paragraphs(
        "ISP removes identity-correlated components from embeddings via linear subspace removal while preserving task-relevant signal for verification and fraud detection. The method is lightweight, compatible with existing encoders, and tunable to trade off privacy against task performance.",
        "This work takes a step toward making powerful vision models more privacy-friendly, which is crucial for real-world deployment in regulated identity contexts.",
      ),
    ),
  ],
};

export const globalAgeVerificationContent: ArticleContent = {
  slug: "global-age-verification",
  abstract:
    "As regulatory bodies worldwide strengthen age verification and data privacy regulations, organizations must balance compliance with seamless user experiences.",
  blocks: [
    { type: "divider" },
    ...section(
      "A shifting regulatory landscape",
      ...paragraphs(
        "Jurisdictions are adopting diverse approaches to age assurance, from strict document-based verification to privacy-preserving inference methods. Compliance teams must track not only minimum ages but also consent, data retention, and parental involvement requirements.",
        "Understanding emerging laws and implementing adaptable, privacy-conscious verification systems are key to protecting minors, maintaining trust, and meeting evolving global standards.",
      ),
    ),
    ...section(
      "Design principles",
      {
        type: "list",
        items: [
          {
            term: "Proportionality",
            text: "Match verification strength to content risk rather than applying one-size-fits-all checks.",
          },
          {
            term: "Privacy minimization",
            text: "Collect only the signals required for the jurisdiction and use case.",
          },
          {
            term: "Adaptability",
            text: "Support policy updates as regulations change without rebuilding entire flows.",
          },
        ],
      },
    ),
  ],
};

export const atlasContent: ArticleContent = {
  slug: "atlas",
  abstract:
    "Persona Atlas is a free, collaborative database and API designed to help compliance teams navigate the complex landscape of age assurance and privacy laws.",
  blocks: [
    { type: "divider" },
    ...section(
      "Why Atlas",
      ...paragraphs(
        "Age and privacy regulations vary by country, province, and product category. Atlas centralizes statutory requirements, implementation notes, and update history so teams can answer compliance questions without maintaining fragmented spreadsheets.",
      ),
    ),
    ...section(
      "Capabilities",
      {
        type: "list",
        items: [
          {
            term: "Regulation tracker",
            text: "Searchable coverage of age assurance and privacy obligations worldwide.",
          },
          {
            term: "API access",
            text: "Programmatic queries for product surfaces that need jurisdiction-aware policy logic.",
          },
          {
            term: "Collaborative updates",
            text: "Community contributions with review workflows to keep entries current.",
          },
        ],
      },
    ),
  ],
};

export const understandingDigitalIdentityContent: ArticleContent = {
  slug: "understanding-digital-identity",
  abstract:
    "Digital identity connects who people are in the real world with how they interact online, combining personal data, behavioral patterns, and technological signals to establish authenticity.",
  blocks: [
    { type: "divider" },
    ...section(
      "Foundations",
      ...paragraphs(
        "As digital ecosystems expand and AI-driven threats evolve, strong identity verification is essential to preserve trust, prevent fraud, and enable secure online engagement.",
        "Effective verification weaves together document evidence, biometrics, device intelligence, and behavioral signals into a risk-aware decision rather than a single binary checkpoint.",
      ),
    ),
    ...section(
      "Verification in practice",
      ...paragraphs(
        "Organizations must balance conversion, inclusivity, and security. Adaptive flows adjust verification depth based on real-time risk, reducing friction for trusted users while escalating scrutiny for high-risk sessions.",
        "This paper outlines how Persona approaches digital identity verification across industries with configurable policies, auditability, and user-centered design.",
      ),
    ),
  ],
};
