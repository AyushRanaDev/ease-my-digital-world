import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AppointmentsPanel,
  BillsPanel,
  ChatPanel,
  FamilyPanel,
  MedicinesPanel,
  ScamPanel,
  TodayPanel,
} from "@/components/hazel/panels";
import { initialMedicines, type Medicine } from "@/lib/hazel-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hazel — a caring daily companion for seniors" },
      {
        name: "description",
        content:
          "Hazel is a warm, easy website that helps older adults with medicines, doctor visits, bills, family calls and spotting scams — with a friendly AI helper alongside.",
      },
      { property: "og:title", content: "Hazel — a caring daily companion for seniors" },
      {
        property: "og:description",
        content:
          "Medicines, appointments, bills, family calls and scam checks in one big, friendly, easy-to-read place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const tabs = [
  { id: "today", label: "Home", emoji: "🏠" },
  { id: "medicines", label: "Medicines", emoji: "💊" },
  { id: "appointments", label: "Doctors", emoji: "🩺" },
  { id: "bills", label: "Bills", emoji: "💰" },
  { id: "family", label: "Family", emoji: "💌" },
  { id: "scam", label: "Scam Shield", emoji: "🛡️" },
  { id: "chat", label: "Ask Hazel", emoji: "🤖" },
];

function Home() {
  const [tab, setTab] = useState("today");
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [helpOpen, setHelpOpen] = useState(false);

  const toggleMedicine = (id: string) =>
    setMedicines((list) => list.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)));

  const addMedicine = (name: string) =>
    setMedicines((list) => [
      ...list,
      {
        id: `m${list.length + 1}`,
        name,
        dose: "1 tablet",
        time: "Time not set yet",
        emoji: "🆕",
        taken: false,
        note: "I'll look this one up and explain it in plain words once your pharmacy confirms the dose.",
      },
    ]);

  return (
    <div className="min-h-screen bg-cream text-ink font-body pb-32">
      <header className="mx-auto max-w-6xl px-5 pt-8 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-2xl bg-coral grid place-items-center text-3xl" aria-hidden="true">
            🌻
          </div>
          <div>
            <p className="font-display font-bold text-2xl leading-none">Hazel</p>
            <p className="font-semibold text-ink/50">Your friendly everyday helper</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-full pl-2 pr-5 py-2 border-2 border-ink/10">
          <div className="size-11 rounded-full bg-sun grid place-items-center text-2xl" aria-hidden="true">
            👵
          </div>
          <div className="leading-tight">
            <p className="font-bold text-lg">Margaret</p>
            <p className="font-semibold text-ink/50 text-sm">Good morning!</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5">
        <div className="rounded-[2.5rem] bg-white border-4 border-sun/40 p-8 sm:p-12 flex flex-col md:flex-row gap-8 items-center shadow-[0_20px_40px_-24px_rgba(91,75,196,0.4)]">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 bg-teal/15 text-teal font-bold px-4 py-2 rounded-full">
              ✨ Welcome back
            </span>
            <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[1.05] mt-4">
              Good morning, <span className="text-coral">Margaret</span>!
            </h1>
            <p className="mt-4 big-text text-ink/70 max-w-lg text-xl">
              You have{" "}
              <span className="text-plum font-extrabold">
                {medicines.filter((m) => !m.taken).length} medicines
              </span>{" "}
              left and 2 bills to look at. Press any big button below — nothing can break.
            </p>
          </div>
          <div className="md:w-64 shrink-0 rounded-3xl bg-cream p-6 border-2 border-sun/30">
            <p className="text-sm font-bold text-ink/50 uppercase tracking-wider">Where you are</p>
            <p className="font-display font-bold text-xl mt-1">Sunny Oaks Estate</p>
            <p className="font-semibold text-ink/60">Maple Avenue, Room 402</p>
            <p className="mt-3 flex items-center gap-2 text-teal font-bold">
              <span className="size-2 rounded-full bg-teal animate-pulse" aria-hidden="true" />
              Family can see you're safe
            </p>
          </div>
        </div>
      </section>

      <nav className="mx-auto max-w-6xl px-5 mt-8" aria-label="Main sections">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {tabs.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-full px-6 py-4 font-display font-bold text-xl border-2 transition-transform duration-200 hover:-translate-y-0.5 ${
                  active
                    ? "bg-coral text-cream border-coral"
                    : "bg-white text-ink border-ink/10 hover:border-coral/40"
                }`}
              >
                {t.emoji} {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 mt-6">
        {tab === "today" && <TodayPanel medicines={medicines} onToggle={toggleMedicine} onGo={setTab} />}
        {tab === "medicines" && (
          <MedicinesPanel medicines={medicines} onToggle={toggleMedicine} onAdd={addMedicine} />
        )}
        {tab === "appointments" && <AppointmentsPanel />}
        {tab === "bills" && <BillsPanel />}
        {tab === "family" && <FamilyPanel />}
        {tab === "scam" && <ScamPanel />}
        {tab === "chat" && <ChatPanel />}
      </main>

      <footer className="mx-auto max-w-6xl px-5 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-ink/5 pt-8">
        <p className="font-display font-bold text-xl">🌻 Hazel</p>
        <p className="font-semibold text-ink/50">Always here so you can stay independent.</p>
      </footer>

      {helpOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-[22rem] max-w-[calc(100vw-3rem)] rounded-[2rem] bg-white border-4 border-coral/30 p-6 shadow-xl">
          <p className="font-display font-bold text-2xl">We're getting someone 💛</p>
          <p className="big-text text-ink/70 mt-2">
            A real person will ring you on 555-0100 within a few minutes. Sophie has been told too.
          </p>
          <button
            type="button"
            onClick={() => setHelpOpen(false)}
            className="mt-4 w-full rounded-2xl bg-cream border-2 border-ink/10 py-3 font-display font-bold text-xl"
          >
            Close
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setHelpOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-coral text-cream pl-4 pr-7 py-4 font-display font-bold text-2xl shadow-lg transition-transform duration-200 hover:-translate-y-1"
      >
        <span className="size-12 grid place-items-center rounded-full bg-cream/20 text-3xl" aria-hidden="true">
          🆘
        </span>
        Need help?
      </button>
    </div>
  );
}
