# Mission Room session notes

28 Sep 2026. Written so this work can continue on another PC. No code.

The project lives in this OneDrive folder, so this file should sync without a git commit. The git history has not been updated with the rebuild. GitHub `main` may still be the old calculator until someone commits and pushes.

## What this product is

From `Untitled.md` (28 Sep 2026, James), not from the old calculator.

Prescience sells Immersive Project Controls. That is a Mission Room wall, hardware and software from Mission Room, wrapped in Prescience services: process optimisation, data insight, facilitation, and training, including Prescience 3PO. The thing being sold is the session in the room, not the screen.

The room is a 6 m by 2 m three-wall projected “Cine” setup, run from one Windows PC, with four infrared pens, infrared cameras, and short-throw projectors. Anything that runs on Windows can run on the walls.

What Prescience has actually run, in the Hub or at a booth:

- Infrared pen control. The pen is a left-click. Hold for the radial launcher. The lid has to be off.
- Markup and redlining, saved as an image of one, two, or three screens.
- Radial and side (“rocket”) launchers. Pen, screen layout, zoom, app launcher.
- Launching an app straight across the walls. PowerPoint can fill all three.
- Screen layouts over one, two, or three adjacent screens. Screens must be contiguous.
- A three-wall PowerPoint template, including a looping lobby display. Built for ActivUs.
- Self-service troubleshooting.
- Third-party apps: Miro, Bluebeam, Navisworks Freedom, Revizto, Teams, Zoom.
- Oracle Aconex model and clash review, at Sydney Build 2024.
- Novade dashboards, gauges, and defect forms pinned on floor plans, at Sydney Build 2024.

Documented, not filmed: casting a laptop in, remote viewers joining with a 4-digit code, and Mission Whiteboard.

Vendor footage only, Mission Room UK (HS2 Euston, TransPennine, Network Rail): BIM and 4D, 360° site and route capture, digital rehearsal, control-room dashboards, training quizzes. Do not present these as Prescience demos.

Not shown anywhere: a live Oracle P6 or Primavera Cloud schedule in the room. The launcher has an “OPC & Whiteboard” shortcut. There are recorded “CPM & Lean” and “CPM & Risk” videos. No live schedule, risk, or status review has been filmed. That is the main gap against Prescience’s core business.

How it is sold: a structured pilot of up to two weeks, then consulting to develop, embed, and train three use cases. Pricing stays with the sales team.

The one full client delivery on record is CPB / ActivUs, Logan and Gold Coast Faster Rail. Room supplied, familiarisation on 15 Oct 2025, a PowerPoint template, a six-part tutorial series, cheat sheets and FAQ, and six scenario concepts. Those six are proposals, not built demos: design review with client software, training and induction, crisis management, rail possessions, events and community engagement, and live schedule markup.

Prospect demos ran in the Milton (Brisbane) and Homebush (Sydney) rooms from about May 2024 to May 2025, mostly rail, mining, energy, and construction. Which of those rooms is operational still needs confirming. The FY27 Q2 plan is to build a session around a live project decision rather than a generic product tour.

## What we decided to build

The old app in this repo was a Novade Field Ops ROI calculator wearing a Mission Room name. A large explorer, dollar reveals, scenario sliders, and a model of assumptions. Storage keys were still the Field Ops names. The landing page said MissionRoom Lead-gen, but every path after it fed that model.

Advice given, and then followed: do not adapt that calculator. Delete it and start in this same repo, because this repo and the Vercel project were already the lead-gen site.

The new product is a short gated marketing walkthrough, not an ROI tool.

1. Sector. Rail, mining, energy, or construction.
2. Decision. Only modules that have actually been run: design review, quality and safety (Novade), or a three-wall stakeholder story.
3. The room. Place one thing on the left, centre, and right wall. Pick one pen action: mark up and send, or spread the layout.
4. A brief. Name, company, work email. The brief stays in the browser. Copy it and send it to whoever books the Hub. Nothing is posted to a CRM yet.

Left off the menu on purpose: live P6, 360° capture, digital rehearsal, control-room dashboards, training quizzes, and the six ActivUs concepts. Those are gaps, vendor footage, or proposals.

A static Vite site cannot truly lock the content. The JavaScript bundle is public. The form is at the end. A hard wall in front would need a form tool that redirects in with a token. That was left for later.

## What was removed

Deleted from this repo: the calculation engine, guided estimate, explorer, assumptions, share links, saved Field Ops session, the Novade image, and the bundled standalone page.

The previous Vercel production deployment of the calculator was removed. That old deployment URL returns 404.

The Vercel project that remains is `missionroom-lead-gen`, account `jamesdarcy001-create` / team scope `jamesd1`.

Live site: https://missionroom-lead-gen.vercel.app

## How the interface was rebuilt

The first replacement was a rough four-step sketch. It was then thrown out visually and rebuilt from the Serro design system, with Anduril motion used only where it makes the steps feel like instrumentation. Serro leads.

Source files, on this PC only, not in the repo:

`C:\Users\jamesdarcy\Downloads\DESIGN JSONS`

- `serro-design-spec-graphite-blueprint.json`
- `serro-motion-ux-spec.json`
- `andu-motion-ux-spec.part(1).json` through part 4
- The `.txt` files in that folder were empty

Serro, as used here:

- Dark only. Graphite background `#272727`, ivory type `#faf9f5`, sand for secondary copy `#dcd5ca`. No pure black page, no pure white body text.
- One accent, used like a signal light. Serro’s blue (`#3e77e8`, with a lighter `#7b93ff` for small text) was shifted to red. Button fill `#e23c33`, hover `#ff4d42`, small accent text `#ff9a92`. Red appears on the primary button, eyebrows, the active step numeral, and the selected-row marker. Nowhere else.
- Structure is 1px hairlines, not filled cards. A left and right rail frame the column on wide screens. A tick band of vertical strokes sits along the bottom.
- Two voices of type. Soft grotesque for statements. Monospace for labels. A pixel face for the step numeral only.
- Headlines are large, tight, sentence case, and end with a full stop.
- Buttons are square. No hover lift, scale, or shadow. Hover is a colour change only. One filled primary button per view. The header action is an outline, not a second fill.
- Choices are numbered rows (`01/`, `02/`) with a hairline underneath, not cards. Facts on the brief are label-left, value-right spec rows.
- The three walls sit inside a product window: dark chrome, three dots, Inter for the UI inside the window only.

Motion, Serro first, Anduril second:

- Reveals travel a short distance (about 4px for headlines, about 16px for rows) and settle on an exponential ease-out. They play once per step.
- Rules draw from the left.
- Eyebrows decode through random characters once, then stop. Body copy is never scrambled.
- Wall labels snap in from the left when the visitor swaps what is on a wall.
- `prefers-reduced-motion` turns the animation off and shows the final eyebrow text immediately.

Restart Soft and Proto Mono are commercial and were not in the repo, so the type follows Serro’s own fallbacks: Inter Tight for display and body, JetBrains Mono for labels, Silkscreen for the pixel numeral. Inter, already in `public/fonts`, is used only inside the room window.

## What the live walkthrough does

Opening line: “A session on three walls.” It says the brief is built from sessions already run, and that it does not price the room or estimate a saving.

Header: Prescience mark, step labels (Sector, Decision, Room, Brief), and an outline action. Completed steps can be jumped back to.

Steps:

1. Sector. Rail notes the CPB / ActivUs delivery. Mining and energy note prospect sessions. Construction notes Sydney Build 2024.
2. Decision. Design review (Hub, plus Aconex at Sydney Build). Quality and safety (Novade at Sydney Build). Stakeholder story (the ActivUs three-wall deck, run in the Hub).
3. The room. A three-wall window. Each wall can be reassigned, and the piece that was there swaps to the other wall so nothing is duplicated. Pen action is mark up and send, or spread the layout.
4. Brief. Name, company, work email. “Show Brief” reveals a spec sheet. “Copy Brief” copies it. “Back” returns to the room. “Start Again” clears the session.

Checked in the browser: full path including a wall swap, desktop width with the three walls side by side and the opening screen fitting without a scroll, and a phone width with no horizontal overflow.

## Files that matter

- `Untitled.md` is the source of truth for what can be claimed. Do not treat it as app copy to paste wholesale. It also lists gaps and unfilmed PTHUB videos.
- `session.md` is this note.
- `src/content.js` holds the sectors, decisions, wall copy, pen actions, and the brief text.
- `src/App.jsx` is the walkthrough.
- `src/index.css` is the Serro-derived visual system, with the accent in red.
- `README.md` describes the app as a session brief, with no ROI calculation.

Stack: React 19, Vite, plain CSS. Dev with `npm install` then `npm run dev`. Production build is `npm run build`. Deploy, from this folder, with the Vercel CLI to the existing `missionroom-lead-gen` project.

## Still open

- Commit and push, if the other PC should get this through GitHub rather than OneDrive. Not done in this chat.
- Connect the brief form to whatever Prescience uses for leads. Until then, say plainly that the brief stays in the browser.
- Copy the Design JSONS folder to the other PC if the visual system needs to be extended. It is not in the repo.
- Confirm Milton and Homebush are both still operational before the copy names them as bookable rooms. The app currently says “book it in the Hub.”
- Confirm Aconex and Novade demo logins still exist. Both booth demos are from May 2024.
- Do not add live P6, vendor-only UK footage, or the six ActivUs concepts until they have been run and filmed.
- A real content gate, if the campaign needs one, is a later add.
