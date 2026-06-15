import type { ResearchArea } from "../types/research";

export const researchAreas: ResearchArea[] = [
  {
    id: "fraud-intelligence",
    slug: "fraud-intelligence",
    label: "Fraud intelligence",
    accentColor: "#264653",
    clusterAngle: -Math.PI / 4,
  },
  {
    id: "data-privacy",
    slug: "data-privacy",
    label: "Data privacy",
    accentColor: "#457b9d",
    clusterAngle: Math.PI / 4,
  },
  {
    id: "online-safety",
    slug: "online-safety",
    label: "Online safety",
    accentColor: "#2a9d8f",
    clusterAngle: (3 * Math.PI) / 4,
  },
  {
    id: "accessible-identity",
    slug: "accessible-identity",
    label: "Accessible identity",
    accentColor: "#e9c46a",
    clusterAngle: (-3 * Math.PI) / 4,
  },
];

export function getAreaBySlug(slug: string): ResearchArea | undefined {
  return researchAreas.find((area) => area.slug === slug);
}

export function getAreaById(id: string): ResearchArea | undefined {
  return researchAreas.find((area) => area.id === id);
}
