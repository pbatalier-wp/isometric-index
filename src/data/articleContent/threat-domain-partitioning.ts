import type { ArticleContent } from "../../types/research";
import { section } from "./helpers";

export const threatDomainPartitioningContent: ArticleContent = {
  slug: "threat-domain-partitioning",
  abstract:
    "Several distinctions make fraud detection different from other domains such that conventional machine learning classification metrics become impractical: adversarial adaptation, expensive labels, class imbalance, and unseen classes. We present a practical framework that offers cheaper and more consistent benchmarks for such models through threat domain partitioning and sorted rejection labeling.",
  blocks: [
    { type: "divider" },
    ...section(
      "1. Introduction",
      {
        type: "paragraph",
        text: "We work on a wide range of fraud detection models, including selfie liveness and ID verification. As AI driven fraud has grown more dynamic and sophisticated, manual labeling in these use cases has become more uncertain and costly to implement. This led us to build a new framework that addresses several key challenges unique to fraud detection.",
      },
      {
        type: "paragraph",
        text: "Fraud detection benchmarking in machine learning literature typically relies on conventional classification metrics such as precision, recall, F1-score, and AUC score for evaluation. While some studies acknowledge the limitations of these metrics, nearly all evaluations are conducted on static test sets that fail to account for performative drift. In the performative prediction framework, a model's predictions directly influence the environment: when deployed, adversaries probe the model, observe outcomes, and adapt their tactics accordingly.",
      },
      {
        type: "heading",
        level: 3,
        text: "1.1 The flickering attack vector",
      },
      {
        type: "paragraph",
        text: "A newly deployed model targeting stolen identity documents exhibited excellent performance in offline testing. However, within hours of deployment, fraudsters realized this attack vector was no longer effective and ceased their attacks. This leads to a decrease in fraud caught, in turn leading to sharp drops in conventional classification metrics. But then due to the drop in metrics, the model is removed from production. When the model is removed, fraudsters return to exploit the now-undefended attack vector, causing fraud rates to spike.",
      },
    ),
    ...section(
      "2. Related work",
      {
        type: "paragraph",
        text: "These challenges in fraud detection mirror similar challenges in other adversarial contexts where attackers rapidly adapt their strategies. In contexts such as credit scoring, spam filtering, job application parsing, and intrusion detection, directly measuring a model's ability to distinguish between good and bad actors is both impractical due to labeling difficulties and misleading due to performative drift.",
      },
      {
        type: "paragraph",
        text: "Recent work has explored incorporating performative drift into model training to optimize for post-drift performance in adversarial contexts. Fraud detection, however, presents a fundamentally different challenge. Not only do classification boundaries influence agent behavior, but the overall incidence rate and attack distribution shift as bad actors become deterred and cease activity altogether.",
      },
    ),
    ...section(
      "3. Framework overview",
      {
        type: "paragraph",
        text: "Our framework comprises two complementary procedures executed at distinct stages of the model life-cycle: threat domain partitioning, conducted prior to model development, and sorted rejection labeling, performed during deployment assessment.",
      },
      {
        type: "heading",
        level: 3,
        text: "3.1 Threat domain partitioning for bad actor coverage",
      },
      {
        type: "paragraph",
        text: "Threat domain partitioning comprehensively defines the space of possible attacks into manageable categories. This capability is essential for ensuring impactful model development and enables parallel model design, where separate teams may train and evaluate models in isolated environments while maintaining cohesive coverage of the entire threat landscape.",
      },
      {
        type: "heading",
        level: 3,
        text: "3.2 Sorted rejection labeling for good actor protection",
      },
      {
        type: "paragraph",
        text: "Sorted rejection labeling efficiently measures model performance by focusing evaluation effort on the highest-risk cases. By explicitly setting thresholds that correspond to concrete false rejection rate values such as 0.01% or 0.1%, organizations can predetermine the exact percentage of users who may experience friction due to the deployed system.",
      },
    ),
    ...section(
      "4. A case study: selfie liveness verification",
      {
        type: "paragraph",
        text: "We demonstrate the application of our framework through selfie liveness verification, a widely deployed identity verification mechanism that requires users to capture real-time photographs or video to establish physical presence and verify claimed identity.",
      },
      {
        type: "list",
        items: [
          {
            term: "Generative AI",
            text: "Synthetically generated images from generative models designed to mimic authentic selfies.",
          },
          {
            term: "Digital tampering",
            text: "Manipulation of genuine images through deepfakes, inpainting, or outpainting techniques.",
          },
          {
            term: "Replay",
            text: "Pre-recorded images or videos presented to circumvent liveness detection mechanisms.",
          },
          {
            term: "Physical replica",
            text: "Physical artifacts such as silicone masks or printed photographs used for impersonation.",
          },
          {
            term: "Evasion",
            text: "Deliberate modification of physical attributes through makeup, face paint, or occlusion.",
          },
        ],
      },
    ),
    ...section(
      "5. Discussion",
      {
        type: "paragraph",
        text: "Because we develop models in parallel and benchmark them individually on false rejection rate, the overall system false rejection rate increases with each model deployment. We tolerate temporarily elevated false rejection rates and then periodically recalibrate the ensemble model back to the target false rejection rate through sorted rejection labeling.",
      },
    ),
    ...section(
      "6. Future directions",
      {
        type: "paragraph",
        text: "There is a pressing need to establish standardized definitions and taxonomies that comprehensively span the entire landscape of fraud threat domains. Since the effectiveness of anti-fraud systems is determined by their weakest link, developing a unified threat taxonomy would enable repeatable evaluation and systematic iteration of deployed systems.",
      },
    ),
    ...section(
      "7. Conclusion",
      {
        type: "paragraph",
        text: "Conventional machine learning classification metrics fail in adversarial environments where intelligent attackers rapidly adapt their strategies. Threat domain partitioning identifies vulnerable attack vectors across the entire possible attack space, while sorted rejection labeling targets and controls the false rejection rate, grounding the framework in a common business objective.",
      },
      {
        type: "paragraph",
        text: "Together, they form our framework for consistent, repeatable, and scalable model development and deployment in the face of rapid adversarial adaptation.",
      },
    ),
    { type: "heading", level: 2, text: "8. Acknowledgments" },
    {
      type: "paragraph",
      text: "We thank Jinxing Li and Injee Jeong for their review, comments, and suggestions on the draft, as well as James Chang and Daniel George for their continued input on the framework's implementation and extensions.",
    },
  ],
};
