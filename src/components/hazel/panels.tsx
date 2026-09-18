import { useState } from "react";
import {
  appointments,
  checkScam,
  clinics,
  family,
  hazelReply,
  initialBills,
  type Bill,
  type Medicine,
  type ScamVerdict,
} from "@/lib/hazel-data";

export function Card({
  emoji,
  title,
  subtitle,
  children,
  tone = "white",
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "white" | "plum";
}) {
  const plum = tone === "plum";
  return (
    <section
      className={
        plum
          ? "rounded-[2rem] bg-plum p-6 sm:p-8 text-cream"
          : "card-soft p-6 sm:p-8"
      }
    >
      <div className="flex items-center gap-4">
        <div
          className={`size-14 shrink-0 rounded-2xl grid place-items-center text-3xl ${
            plum ? "bg-cream/15" : "bg-cream"
          }`}
          aria-hidden="true"
        >
          {emoji}
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight">{title}</h2>
          {subtitle && (
            <p className={`font-semibold ${plum ? "text-cream/70" : "text-ink/55"}`}>{subtitle}</p>
          )}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function BigButton({
  children,
  onClick,
  tone = "coral",
  className = "",
  as,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "coral" | "teal" | "sun" | "plum" | "quiet";
  className?: string;
  as?: "a";
  href?: string;
}) {
  const tones: Record<string, string> = {
    coral: "bg-coral text-cream",
    teal: "bg-teal text-cream",
    sun: "bg-sun text-ink",
    plum: "bg-plum text-cream",
    quiet: "bg-cream text-ink border-2 border-ink/10",
  };
  const cls = `inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 font-display font-bold text-xl transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 ${tones[tone]} ${className}`;
  if (as === "a") {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ---------------- Today ---------------- */

export function TodayPanel({
  medicines,
  onToggle,
  onGo,
}: {
  medicines: Medicine[];
  onToggle: (id: string) => void;
  onGo: (tab: string) => void;
}) {
  const done = medicines.filter((m) => m.taken).length;
  const next = medicines.find((m) => !m.taken);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card emoji="☀️" title="Your day so far" subtitle="Tuesday, 14 May">
        <div className="space-y-4">
          <div className="rounded-2xl bg-cream p-5">
            <p className="big-text">
              You've taken <span className="text-teal font-extrabold">{done} of {medicines.length}</span> medicines.
            </p>
            <p className="big-text text-ink/70">
              {next ? `Next up: ${next.name} — ${next.time}.` : "All done for today. Well done! 🎉"}
            </p>
          </div>
          <div className="rounded-2xl bg-sun/20 p-5">
            <p className="big-text">🩺 Dr. Okafor on Friday at 2:30 PM.</p>
            <p className="big-text">💡 Electricity bill due in 3 days.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <BigButton onClick={() => onGo("medicines")}>💊 Take medicine</BigButton>
            <BigButton tone="quiet" onClick={() => onGo("family")}>📞 Call family</BigButton>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card emoji="🌤️" title="Outside today" subtitle="Sunny Oaks, Maple Avenue">
          <div className="flex items-center gap-6">
            <p className="font-display font-bold text-5xl">22°C</p>
            <p className="big-text text-ink/70">Sunny and calm — a lovely afternoon for a short walk.</p>
          </div>
        </Card>
        <Card emoji="💌" title="Notes from your family" subtitle="Left for you this morning">
          <div className="space-y-3">
            {family.map((f) => (
              <div key={f.id} className="rounded-2xl bg-cream p-4">
                <p className="font-bold text-lg">
                  {f.emoji} {f.name}
                </p>
                <p className="big-text text-ink/70">{f.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Medicines ---------------- */

export function MedicinesPanel({
  medicines,
  onToggle,
  onAdd,
}: {
  medicines: Medicine[];
  onToggle: (id: string) => void;
  onAdd: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const done = medicines.filter((m) => m.taken).length;
  return (
    <div className="space-y-6">
      <Card
        emoji="💊"
        title="My medicines"
        subtitle={`${done} of ${medicines.length} taken today — tap the big circle when you take one`}
      >
        <div className="space-y-4">
          {medicines.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl p-5 border-2 ${
                m.taken ? "bg-teal/10 border-teal/30" : "bg-cream border-ink/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onToggle(m.id)}
                  aria-pressed={m.taken}
                  aria-label={m.taken ? `Mark ${m.name} as not taken` : `Mark ${m.name} as taken`}
                  className={`size-16 shrink-0 rounded-full grid place-items-center text-3xl font-bold transition-transform duration-200 active:scale-95 ${
                    m.taken ? "bg-teal text-cream" : "bg-white border-2 border-dashed border-ink/25 text-ink/40"
                  }`}
                >
                  {m.taken ? "✓" : "＋"}
                </button>
                <div className="flex-1">
                  <p className={`font-display font-bold text-2xl ${m.taken ? "text-teal" : ""}`}>
                    {m.emoji} {m.name}
                  </p>
                  <p className="big-text text-ink/60">
                    {m.dose} · {m.time}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-white/80 border-2 border-plum/10 p-4">
                <p className="font-bold text-plum">🤖 Hazel explains it simply:</p>
                <p className="big-text text-ink/80">{m.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card emoji="➕" title="Add a new medicine" subtitle="Type the name on the box and I'll set it up">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="For example: Metformin"
            aria-label="Medicine name"
            className="flex-1 rounded-2xl bg-cream px-6 py-4 big-text border-2 border-transparent focus:border-coral outline-none"
          />
          <BigButton
            onClick={() => {
              if (name.trim()) {
                onAdd(name.trim());
                setName("");
              }
            }}
          >
            Add it
          </BigButton>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Appointments ---------------- */

export function AppointmentsPanel() {
  const [booked, setBooked] = useState<string | null>(null);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card emoji="🩺" title="Your appointments" subtitle="Everything already in the diary">
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a.id} className="rounded-2xl bg-cream p-5">
              <p className="font-display font-bold text-2xl">
                {a.emoji} {a.who}
              </p>
              <p className="big-text text-ink/70">{a.what}</p>
              <p className="big-text font-extrabold text-plum">{a.when}</p>
              <p className="big-text text-ink/60">{a.where}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card emoji="📍" title="Clinics near you" subtitle="Based on Maple Avenue">
        <div className="space-y-3">
          {clinics.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border-2 border-ink/5 p-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p className="font-bold text-xl">
                  {c.emoji} {c.name}
                </p>
                <p className="big-text text-ink/55">
                  {c.distance} · {c.hours}
                </p>
              </div>
              <BigButton tone="teal" onClick={() => setBooked(c.name)} className="text-lg px-6 py-3">
                Book
              </BigButton>
            </div>
          ))}
          {booked && (
            <div className="rounded-2xl bg-teal/15 border-2 border-teal/30 p-5">
              <p className="big-text font-extrabold text-teal">✅ Request sent to {booked}</p>
              <p className="big-text text-ink/75">
                They will ring you back to agree a time. I've also told Sophie so she can take you.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Bills ---------------- */

export function BillsPanel() {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [step, setStep] = useState<{ bill: Bill; stage: number } | null>(null);

  const pay = (bill: Bill) => setStep({ bill, stage: 1 });
  const confirm = () => {
    if (!step) return;
    setBills((b) => b.map((x) => (x.id === step.bill.id ? { ...x, paid: true, due: "Paid today" } : x)));
    setStep({ ...step, stage: 2 });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card emoji="💰" title="Bills to look after" subtitle="Big clear buttons — nothing happens by accident">
        <div className="space-y-4">
          {bills.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3 border-2 ${
                b.paid ? "bg-teal/10 border-teal/30" : "bg-cream border-ink/5"
              }`}
            >
              <div>
                <p className="font-display font-bold text-2xl">
                  {b.emoji} {b.name}
                </p>
                <p className="big-text text-ink/60">
                  {b.amount} · {b.due}
                </p>
              </div>
              {b.paid ? (
                <span className="font-display font-bold text-xl text-teal">✅ Paid</span>
              ) : (
                <BigButton onClick={() => pay(b)}>Pay now</BigButton>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card emoji="🧾" title="Step by step" subtitle="I'll stay with you through every step">
        {!step && (
          <p className="big-text text-ink/70">
            Choose a bill on the left and press <strong>Pay now</strong>. I'll show you exactly what to press, one step
            at a time.
          </p>
        )}
        {step?.stage === 1 && (
          <div className="space-y-4">
            <p className="big-text">
              Step 1 of 2 — You are about to pay <strong>{step.bill.name}</strong> for{" "}
              <strong>{step.bill.amount}</strong> from your savings account ending 4412.
            </p>
            <p className="big-text text-ink/70">Only press Yes if you recognise this bill.</p>
            <div className="flex flex-wrap gap-3">
              <BigButton tone="teal" onClick={confirm}>
                Yes, pay it
              </BigButton>
              <BigButton tone="quiet" onClick={() => setStep(null)}>
                No, go back
              </BigButton>
            </div>
          </div>
        )}
        {step?.stage === 2 && (
          <div className="space-y-4">
            <p className="big-text font-extrabold text-teal">🎉 All done, Margaret.</p>
            <p className="big-text text-ink/75">
              {step.bill.name} is paid. I've saved the receipt and sent a copy to Sophie so she knows it's handled.
            </p>
            <BigButton tone="quiet" onClick={() => setStep(null)}>
              Finish
            </BigButton>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------- Family ---------------- */

export function FamilyPanel() {
  const [calling, setCalling] = useState<string | null>(null);
  const [number, setNumber] = useState("555-0123");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card emoji="👨‍👩‍👧" title="Your people" subtitle="One big button to reach them">
        <div className="space-y-4">
          {family.map((f) => (
            <div key={f.id} className="rounded-2xl bg-cream p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-white grid place-items-center text-3xl">{f.emoji}</div>
                <div>
                  <p className="font-display font-bold text-2xl">{f.name}</p>
                  <p className="big-text text-ink/55">
                    {f.relation} · {f.phone}
                  </p>
                </div>
              </div>
              <BigButton tone="teal" onClick={() => setCalling(f.name)}>
                📞 Call
              </BigButton>
            </div>
          ))}
          {calling && (
            <div className="rounded-2xl bg-teal/15 border-2 border-teal/30 p-5">
              <p className="big-text font-extrabold text-teal">📞 Ringing {calling}…</p>
              <p className="big-text text-ink/70">Hold the phone to your ear. I'll hang up if nobody answers.</p>
              <BigButton tone="quiet" className="mt-3" onClick={() => setCalling(null)}>
                End call
              </BigButton>
            </div>
          )}
        </div>
      </Card>

      <Card emoji="☎️" title="Dial a number yourself" subtitle="Nice big keys, no squinting">
        <div className="space-y-4">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            aria-label="Phone number"
            className="w-full rounded-2xl bg-cream px-6 py-4 font-display font-bold text-3xl tracking-wide border-2 border-transparent focus:border-sun outline-none"
          />
          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setNumber((n) => n + k)}
                className="rounded-2xl bg-cream py-5 font-display font-bold text-3xl border-2 border-ink/5 hover:bg-sun/25 active:scale-95 transition"
              >
                {k}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <BigButton as="a" href={`tel:${number}`} tone="sun">
              Start call
            </BigButton>
            <BigButton tone="quiet" onClick={() => setNumber("")}>
              Clear
            </BigButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Scam Shield ---------------- */

export function ScamPanel() {
  const [text, setText] = useState("");
  const [verdict, setVerdict] = useState<ScamVerdict | null>(null);
  const colors = {
    safe: "bg-teal/15 border-teal/40 text-teal",
    careful: "bg-sun/25 border-sun/60 text-ink",
    scam: "bg-coral/15 border-coral/50 text-coral-deep",
  } as const;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card emoji="🛡️" title="Scam Shield" subtitle="Paste a message or type what the caller said">
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            aria-label="Suspicious message"
            placeholder="For example: Your pension is frozen, call this number immediately and give your one-time code."
            className="w-full rounded-2xl bg-cream px-6 py-4 big-text border-2 border-transparent focus:border-coral outline-none"
          />
          <div className="flex flex-wrap gap-3">
            <BigButton onClick={() => setVerdict(checkScam(text))}>Check it for me</BigButton>
            <BigButton
              tone="quiet"
              onClick={() => {
                setText("");
                setVerdict(null);
              }}
            >
              Clear
            </BigButton>
          </div>
          {verdict && (
            <div className={`rounded-2xl border-2 p-5 ${colors[verdict.level]}`}>
              <p className="font-display font-bold text-2xl">
                {verdict.emoji} {verdict.title}
              </p>
              <p className="big-text text-ink/80 mt-2">{verdict.reason}</p>
              <p className="big-text text-ink/80 mt-1">{verdict.advice}</p>
            </div>
          )}
        </div>
      </Card>

      <Card emoji="📋" title="Golden rules" subtitle="Four things that keep you safe">
        <ul className="space-y-3">
          {[
            "🔐 Never share a code, PIN or password — no real bank ever asks.",
            "🎁 Nobody genuine is ever paid in gift cards or Bitcoin.",
            "⏰ 'Act right now' is the oldest trick there is. Slow down.",
            "📵 Hang up, then ring back on a number you already know.",
          ].map((r) => (
            <li key={r} className="rounded-2xl bg-cream p-4 big-text">
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-2xl bg-teal/12 border-2 border-teal/25 p-5">
          <p className="big-text font-extrabold text-teal">Shield is switched on</p>
          <p className="big-text text-ink/70">12 known scam callers were blocked this month.</p>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Hazel chat ---------------- */

type Msg = { id: number; from: "me" | "hazel"; text: string };

export function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "hazel", text: "Hello Margaret 🌻 I'm Hazel. Ask me anything, in your own words." },
  ]);
  const [input, setInput] = useState("");

  const send = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setMessages((m) => [
      ...m,
      { id: m.length + 1, from: "me", text: q },
      { id: m.length + 2, from: "hazel", text: hazelReply(q) },
    ]);
    setInput("");
  };

  const suggestions = [
    "What medicine do I take next?",
    "When is my doctor visit?",
    "Which bills still need paying?",
    "I got a strange message",
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card emoji="🤖" title="Talk to Hazel" subtitle="Plain words. No jargon. No rush." tone="plum">
          <div className="space-y-4 max-h-[26rem] overflow-y-auto pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl p-4 big-text max-w-[85%] ${
                  m.from === "me"
                    ? "bg-cream/15 rounded-tl-sm text-cream"
                    : "bg-sun text-ink rounded-tr-sm ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form
            className="mt-6 flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Ask Hazel"
              placeholder="Type your question…"
              className="flex-1 rounded-2xl bg-cream/15 px-6 py-4 big-text text-cream placeholder-cream/60 outline-none border-2 border-transparent focus:border-sun"
            />
            <button
              type="submit"
              className="rounded-2xl bg-cream text-plum px-8 py-4 font-display font-bold text-xl hover:-translate-y-0.5 transition-transform"
            >
              Send
            </button>
          </form>
        </Card>
      </div>

      <Card emoji="💡" title="Not sure what to ask?" subtitle="Tap one of these">
        <div className="space-y-3">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="w-full text-left rounded-2xl bg-cream p-4 big-text hover:bg-sun/20 transition"
            >
              {s}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export { BigButton };
