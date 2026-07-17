export const projects = [
  {
    id: "field-notes",
    number: "01",
    title: "Field Notes",
    category: "Editorial platform",
    year: 2026,
    accent: "coral",
    summary: "A calmer publishing system for stories made away from the desk."
  },
  {
    id: "common-ground",
    number: "02",
    title: "Common Ground",
    category: "Place & identity",
    year: 2025,
    accent: "ink",
    summary: "A neighborhood identity built from signs, sounds, and daily rituals."
  },
  {
    id: "still-moving",
    number: "03",
    title: "Still / Moving",
    category: "Digital exhibition",
    year: 2025,
    accent: "lime",
    summary: "An online exhibition where motion only appears when you slow down."
  }
] as const;

export const notes = [
  { id: 1, title: "Good websites have a point of view", date: "12 Jun 2026", readTime: "4 min" },
  { id: 2, title: "Designing for the second visit", date: "28 May 2026", readTime: "6 min" },
  { id: 3, title: "The case for fewer dashboards", date: "09 Apr 2026", readTime: "3 min" }
] as const;
