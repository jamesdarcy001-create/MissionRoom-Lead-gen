import { useEffect, useState } from "react"
import mark from "./assets/width_550.png?inline"
import { DECISIONS, PENS, SECTORS, WALL_NAMES, buildBrief } from "./content.js"

const STEPS = [
  { id: "sector", label: "Sector" },
  { id: "decision", label: "Decision" },
  { id: "room", label: "Room" },
  { id: "brief", label: "Brief" },
]

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789"
const TICKS = [5, 3, 8, 4, 2, 7, 5, 9, 3, 6, 4, 8, 2, 5, 7, 3, 6, 4, 9, 2, 5, 8, 3, 6, 4, 7, 2, 5]

const EMPTY = { name: "", email: "", company: "" }

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function useReduced() {
  const [reduce, setReduce] = useState(reducedMotion)
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduce(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])
  return reduce
}

function scramble(text) {
  return [...text]
    .map((ch, index) => (ch === " " || ch === "/" || ch === "." ? ch : GLYPHS[index % GLYPHS.length]))
    .join("")
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function Decode({ text }) {
  const reduce = useReduced()
  const [out, setOut] = useState(() => scramble(text))

  useEffect(() => {
    if (reduce) return undefined
    const chars = [...text]
    const start = performance.now()
    let frame = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 780)
      setOut(
        chars
          .map((ch, index) => {
            if (ch === " " || ch === "/" || ch === ".") return ch
            const revealAt = 0.18 + (index / chars.length) * 0.62
            if (t >= revealAt) return ch
            return GLYPHS[(Math.floor(now / 45) + index) % GLYPHS.length]
          })
          .join(""),
      )
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, reduce])

  return <p className="eyebrow">{reduce ? text : out}</p>
}

export default function App() {
  const [step, setStep] = useState(0)
  const [sectorId, setSectorId] = useState(null)
  const [decisionId, setDecisionId] = useState(null)
  const [wallIds, setWallIds] = useState([])
  const [penId, setPenId] = useState(PENS[0].id)
  const [contact, setContact] = useState(EMPTY)
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const sector = SECTORS.find((item) => item.id === sectorId) ?? null
  const decision = DECISIONS.find((item) => item.id === decisionId) ?? null
  const pen = PENS.find((item) => item.id === penId) ?? PENS[0]
  const walls = decision
    ? wallIds.map((id) => decision.walls.find((wall) => wall.id === id)).filter(Boolean)
    : []
  const contactReady = contact.name.trim() && contact.company.trim() && validEmail(contact.email)
  const brief =
    sector && decision && walls.length === 3
      ? buildBrief({ sector, decision, walls, pen, contact })
      : ""

  function chooseDecision(id) {
    const next = DECISIONS.find((item) => item.id === id)
    setDecisionId(id)
    setWallIds(next.walls.map((wall) => wall.id))
  }

  function assignWall(index, itemId) {
    setWallIds((current) => {
      const next = [...current]
      const other = next.indexOf(itemId)
      if (other !== -1 && other !== index) next[other] = next[index]
      next[index] = itemId
      return next
    })
  }

  function go(next) {
    if (next < step) {
      setRevealed(false)
      setCopied(false)
    }
    setStep(next)
  }

  function restart() {
    setStep(0)
    setSectorId(null)
    setDecisionId(null)
    setWallIds([])
    setPenId(PENS[0].id)
    setContact(EMPTY)
    setRevealed(false)
    setCopied(false)
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const canContinue =
    step === 0 || (step === 1 && sectorId) || (step === 2 && decisionId) || step === 3

  return (
    <div className="app">
      <header className="nav">
        <img src={mark} alt="Prescience Technology" className="mark" />
        <nav className="nav-steps" aria-label="Session steps">
          {STEPS.map((item, index) => {
            const n = index + 1
            const state = step === n ? "on" : step > n ? "done" : ""
            return (
              <span key={item.id} className={`nav-step ${state}`}>
                {index > 0 && <i className="dot" aria-hidden />}
                {step > n ? (
                  <button type="button" onClick={() => go(n)}>
                    0{n} {item.label}
                  </button>
                ) : (
                  <span>0{n} {item.label}</span>
                )}
              </span>
            )
          })}
        </nav>
        <button type="button" className="nav-cta" onClick={() => go(step === 0 ? 1 : 0)}>
          {step === 0 ? "Build Brief" : "Start"}
        </button>
      </header>

      <div className="rails">
        <aside className="rail" aria-hidden>
          {step > 0 && <div className="index">0{step}</div>}
        </aside>
        <main className="stage enter" key={step}>
          {step === 0 && <Intro onStart={() => go(1)} />}
          {step === 1 && (
            <Choice
              code="01 / Sector"
              title="Which job is this for."
              options={SECTORS}
              selected={sectorId}
              onSelect={setSectorId}
            />
          )}
          {step === 2 && (
            <Choice
              code="02 / Decision"
              title="What the room decides."
              options={DECISIONS.map((item) => ({
                id: item.id,
                label: item.title,
                detail: `${item.summary} ${item.evidence}`,
              }))}
              selected={decisionId}
              onSelect={chooseDecision}
            />
          )}
          {step === 3 && decision && (
            <Room
              decision={decision}
              wallIds={wallIds}
              penId={penId}
              onAssign={assignWall}
              onPen={setPenId}
            />
          )}
          {step === 4 && (
            <Brief
              contact={contact}
              contactReady={contactReady}
              revealed={revealed}
              copied={copied}
              sector={sector}
              decision={decision}
              walls={walls}
              pen={pen}
              onContact={(patch) => {
                setContact((current) => ({ ...current, ...patch }))
                setRevealed(false)
                setCopied(false)
              }}
              onReveal={() => setRevealed(true)}
              onCopy={copyBrief}
              onEdit={() => go(3)}
              onRestart={restart}
            />
          )}
          {step > 0 && step < 4 && (
            <div className="actions">
              <button type="button" className="btn secondary" onClick={() => go(step - 1)}>
                Back
              </button>
              <button type="button" className="btn primary" disabled={!canContinue} onClick={() => go(step + 1)}>
                Continue
              </button>
            </div>
          )}
        </main>
        <aside className="rail right" aria-hidden />
      </div>
      <TickBand />
    </div>
  )
}

function TickBand() {
  return (
    <div className="band" aria-hidden>
      {TICKS.map((gap, index) => (
        <i key={index} style={{ marginRight: gap }} />
      ))}
    </div>
  )
}

function Intro({ onStart }) {
  return (
    <section>
      <Decode text="Immersive Project Controls" />
      <h1 className="display hero-display">A session on three walls.</h1>
      <p className="lead">
        Prescience sells the room, and the decision you bring into it. Six metres by two. One PC. Four pens.
      </p>
      <p className="lead">
        This builds a brief from sessions we have already run. It does not price the room, and it does not estimate a saving.
      </p>
      <div className="rule" />
      <div className="actions">
        <button type="button" className="btn primary" onClick={onStart}>
          Build A Session
        </button>
      </div>
    </section>
  )
}

function Choice({ code, title, options, selected, onSelect }) {
  return (
    <section>
      <Decode text={code} />
      <h1 className="display">{title}</h1>
      <div className="rule" />
      <div className="rows" role="listbox" aria-label={code}>
        {options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            role="option"
            aria-selected={selected === option.id}
            className={selected === option.id ? "row on" : "row"}
            onClick={() => onSelect(option.id)}
          >
            <span className="row-index">0{index + 1}/</span>
            <span>
              <span className="row-label">{option.label}</span>
              <span className="row-detail">{option.detail}</span>
            </span>
            <i className="marker" aria-hidden />
          </button>
        ))}
      </div>
    </section>
  )
}

function Room({ decision, wallIds, penId, onAssign, onPen }) {
  return (
    <section>
      <Decode text="03 / The Room" />
      <h1 className="display">{decision.title}.</h1>
      <p className="lead">{decision.evidence}</p>
      <div className="window">
        <div className="chrome">
          <span /><span /><span />
          <em>Mission Room</em>
        </div>
        <div className="walls">
          {wallIds.map((wallId, index) => {
            const wall = decision.walls.find((item) => item.id === wallId)
            return (
              <article key={WALL_NAMES[index]} className={index === 1 ? "wall centre" : "wall"}>
                <p className="wall-name">{WALL_NAMES[index]}</p>
                <h2 key={wall.id}>{wall.label}</h2>
                <p>{wall.detail}</p>
                <label>
                  <span className="wall-name">Place</span>
                  <select value={wallId} onChange={(event) => onAssign(index, event.target.value)}>
                    {decision.walls.map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </select>
                </label>
              </article>
            )
          })}
        </div>
      </div>
      <p className="pen-kicker">With the pen</p>
      <div className="rows pens" role="listbox" aria-label="Pen action">
        {PENS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={penId === item.id}
            className={penId === item.id ? "row on" : "row"}
            onClick={() => onPen(item.id)}
          >
            <span className="row-index">0{index + 1}/</span>
            <span>
              <span className="row-label">{item.label}</span>
              <span className="row-detail">{item.detail}</span>
            </span>
            <i className="marker" aria-hidden />
          </button>
        ))}
      </div>
    </section>
  )
}

function Brief({
  contact, contactReady, revealed, copied, sector, decision, walls, pen,
  onContact, onReveal, onCopy, onEdit, onRestart,
}) {
  return (
    <section>
      <Decode text="04 / Brief" />
      <h1 className="display">Who is in the room.</h1>
      <p className="lead">
        The brief stays in this browser. Copy it, and send it to the person booking the Hub.
      </p>
      <form
        className="form"
        onSubmit={(event) => {
          event.preventDefault()
          if (contactReady) onReveal()
        }}
      >
        <label className="field">
          <span>Name</span>
          <input value={contact.name} autoComplete="name" onChange={(event) => onContact({ name: event.target.value })} />
        </label>
        <label className="field">
          <span>Company</span>
          <input value={contact.company} autoComplete="organization" onChange={(event) => onContact({ company: event.target.value })} />
        </label>
        <label className="field">
          <span>Work email</span>
          <input type="email" value={contact.email} autoComplete="email" onChange={(event) => onContact({ email: event.target.value })} />
        </label>
        <div className="actions">
          <button type="button" className="btn secondary" onClick={onEdit}>Back</button>
          <button type="submit" className={revealed ? "btn secondary" : "btn primary"} disabled={!contactReady}>
            Show Brief
          </button>
        </div>
      </form>
      {revealed && sector && decision && (
        <div className="sheet">
          <div className="rule" />
          <div className="spec"><b>For</b><span>{contact.name.trim()}, {contact.company.trim()}</span></div>
          <div className="spec"><b>Email</b><span>{contact.email.trim()}</span></div>
          <div className="spec"><b>Sector</b><span>{sector.label}</span></div>
          <div className="spec"><b>Decision</b><span>{decision.title}</span></div>
          {walls.map((wall, index) => (
            <div className="spec" key={WALL_NAMES[index]}>
              <b>{WALL_NAMES[index]}</b>
              <span>{wall.label}. {wall.detail}</span>
            </div>
          ))}
          <div className="spec"><b>Pen</b><span>{pen.label}. {pen.detail}</span></div>
          <div className="actions">
            <button type="button" className="btn primary" onClick={onCopy}>{copied ? "Copied" : "Copy Brief"}</button>
            <button type="button" className="btn secondary" onClick={onRestart}>Start Again</button>
          </div>
        </div>
      )}
    </section>
  )
}
