export const SECTORS = [
  {
    id: "rail",
    label: "Rail",
    detail: "The one full room delivery so far is a rail alliance: CPB / ActivUs, Logan and Gold Coast Faster Rail.",
  },
  {
    id: "mining",
    label: "Mining",
    detail: "Prospect sessions in our rooms have included mining clients.",
  },
  {
    id: "energy",
    label: "Energy",
    detail: "Prospect sessions in our rooms have included energy clients.",
  },
  {
    id: "construction",
    label: "Construction",
    detail: "Shown at Sydney Build 2024, and in construction prospect sessions.",
  },
]

export const DECISIONS = [
  {
    id: "design",
    title: "Design review",
    summary: "Walk a model on the wall, put the clashes beside it, and mark up what has to change.",
    evidence: "Run in our Hub, and with Oracle Aconex at Sydney Build 2024.",
    walls: [
      {
        id: "model",
        label: "Model",
        detail: "Navisworks Freedom or Revizto. Walk and zoom with the pen.",
      },
      {
        id: "clashes",
        label: "Clashes",
        detail: "Aconex Design Issues across the walls. The example we have shown is a cable tray through a beam.",
      },
      {
        id: "drawing",
        label: "Drawing",
        detail: "A PDF to redline. One, two, or three screens can be saved as an image.",
      },
    ],
  },
  {
    id: "quality",
    title: "Quality and safety",
    summary: "Put the KPIs on the wall, then pin a defect on the floor plan and work it in the room.",
    evidence: "Shown at Sydney Build 2024 with Novade dashboards, gauges, and defect forms.",
    walls: [
      {
        id: "heatmap",
        label: "KPI heatmap",
        detail: "Novade heatmaps on one wall.",
      },
      {
        id: "gauges",
        label: "Gauges",
        detail: "Novade gauges for the same project.",
      },
      {
        id: "defect",
        label: "Defect on a plan",
        detail: "A defect form pinned on a floor plan.",
      },
    ],
  },
  {
    id: "story",
    title: "Stakeholder story",
    summary: "One briefing across three walls, for the people who need to see the job rather than a laptop slide.",
    evidence: "The three-wall PowerPoint template was built for CPB / ActivUs and run in our Hub.",
    walls: [
      {
        id: "welcome",
        label: "Welcome",
        detail: "Who is in the room, and the decision this session is for.",
      },
      {
        id: "story",
        label: "The story",
        detail: "One slide spanning the three walls, with guides and a notes zone.",
      },
      {
        id: "lobby",
        label: "Lobby loop",
        detail: "The same deck looping on the walls before people sit down.",
      },
    ],
  },
]

export const PENS = [
  {
    id: "markup",
    label: "Mark up and send",
    detail: "Draw over any wall, erase, then save the screens as an image to email.",
  },
  {
    id: "layout",
    label: "Spread the layout",
    detail: "One app across all three walls, or a different app on each. The screens have to sit next to each other.",
  },
]

export const WALL_NAMES = ["Left", "Centre", "Right"]

export function buildBrief({ sector, decision, walls, pen, contact }) {
  return [
    "Mission Room session brief",
    "",
    `For: ${contact.name.trim()}, ${contact.company.trim()}`,
    `Email: ${contact.email.trim()}`,
    `Sector: ${sector.label}`,
    `Decision: ${decision.title}`,
    "",
    "On the walls",
    ...walls.map((wall, index) => `${WALL_NAMES[index]}: ${wall.label}. ${wall.detail}`),
    "",
    `With the pen: ${pen.label}. ${pen.detail}`,
    "",
    decision.summary,
    "",
    "This is a session in the room. Book it in the Hub.",
  ].join("\n")
}
