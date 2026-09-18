export type Medicine = {
  id: string;
  name: string;
  dose: string;
  time: string;
  emoji: string;
  taken: boolean;
  note: string;
};

export type Appointment = {
  id: string;
  who: string;
  what: string;
  when: string;
  where: string;
  emoji: string;
};

export type Bill = {
  id: string;
  name: string;
  amount: string;
  due: string;
  emoji: string;
  paid: boolean;
};

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  emoji: string;
  note: string;
};

export type Clinic = {
  id: string;
  name: string;
  distance: string;
  hours: string;
  emoji: string;
};

export const initialMedicines: Medicine[] = [
  {
    id: "m1",
    name: "Lisinopril",
    dose: "10 mg · 1 tablet",
    time: "Morning · 8:00 AM",
    emoji: "💊",
    taken: true,
    note: "This one relaxes your blood vessels so your heart has an easier job. Take it with a glass of water.",
  },
  {
    id: "m2",
    name: "Cholesterol tablet",
    dose: "20 mg · 1 tablet",
    time: "With lunch · 12:30 PM",
    emoji: "🍽️",
    taken: false,
    note: "Best taken with food. It keeps the fatty bits in your blood down.",
  },
  {
    id: "m3",
    name: "Vitamin D",
    dose: "1 capsule",
    time: "After dinner · 6:00 PM",
    emoji: "🌙",
    taken: false,
    note: "Helps your bones stay strong, especially when you don't get much sunshine.",
  },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    who: "Dr. Okafor",
    what: "Heart check-up",
    when: "Friday, 17 May · 2:30 PM",
    where: "Riverside Clinic, Room 4",
    emoji: "🫀",
  },
  {
    id: "a2",
    who: "Ms. Lane",
    what: "Eye test",
    when: "Tuesday, 21 May · 11:00 AM",
    where: "Green Valley Opticians",
    emoji: "👓",
  },
];

export const clinics: Clinic[] = [
  { id: "c1", name: "Riverside Health Center", distance: "0.4 miles away", hours: "Open until 6 PM", emoji: "🏥" },
  { id: "c2", name: "Saint Jude Medical Plaza", distance: "1.2 miles away", hours: "Open 24 hours", emoji: "🚑" },
  { id: "c3", name: "Green Valley Pharmacy", distance: "1.5 miles away", hours: "Quick clinic · Open until 8 PM", emoji: "💚" },
];

export const initialBills: Bill[] = [
  { id: "b1", name: "Electricity", amount: "$42.60", due: "Due in 3 days", emoji: "💡", paid: false },
  { id: "b2", name: "Telephone & internet", amount: "$28.00", due: "Due in 9 days", emoji: "📱", paid: false },
  { id: "b3", name: "Water", amount: "$18.25", due: "Paid on 2 May", emoji: "🚿", paid: true },
];

export const family: FamilyMember[] = [
  { id: "f1", name: "Sophie", relation: "Daughter", phone: "555-0123", emoji: "👩‍🦰", note: "Proud of you, Mum. See you Sunday!" },
  { id: "f2", name: "Robert", relation: "Son", phone: "555-0198", emoji: "👨‍💼", note: "Dinner's booked. Bring your appetite!" },
  { id: "f3", name: "Lily", relation: "Granddaughter", phone: "555-0144", emoji: "🎈", note: "Miss you! I sent new photos." },
];

export type ScamVerdict = {
  level: "safe" | "careful" | "scam";
  title: string;
  emoji: string;
  reason: string;
  advice: string;
};

const scamWords = [
  "gift card",
  "bitcoin",
  "crypto",
  "wire",
  "urgent",
  "immediately",
  "arrest",
  "warrant",
  "frozen",
  "suspend",
  "one-time code",
  "otp",
  "password",
  "pin",
  "social security",
  "lottery",
  "prize",
  "won",
  "refund",
  "click this link",
  "verify your account",
  "remote access",
  "anydesk",
  "do not tell",
];

const safeWords = ["appointment reminder", "your parcel is out for delivery", "library", "see you sunday"];

export function checkScam(text: string): ScamVerdict {
  const t = text.toLowerCase().trim();
  if (!t) {
    return {
      level: "careful",
      emoji: "✍️",
      title: "Paste the message first",
      reason: "I need to see the message or read out what the caller said.",
      advice: "Type or paste it in the box above, then press Check it for me.",
    };
  }
  const hits = scamWords.filter((w) => t.includes(w));
  if (hits.length >= 2) {
    return {
      level: "scam",
      emoji: "🚨",
      title: "This looks like a scam",
      reason: `I spotted warning signs: ${hits.slice(0, 3).join(", ")}.`,
      advice: "Do not reply, do not press any link, and never share codes or card numbers. Delete it, then tell Sophie.",
    };
  }
  if (hits.length === 1) {
    return {
      level: "careful",
      emoji: "⚠️",
      title: "Please be careful",
      reason: `The phrase "${hits[0]}" is often used by scammers.`,
      advice: "Don't act on it yet. Ring your bank or family on a number you already know.",
    };
  }
  if (safeWords.some((w) => t.includes(w))) {
    return {
      level: "safe",
      emoji: "✅",
      title: "This looks safe",
      reason: "It reads like an ordinary everyday message.",
      advice: "Still, never share codes or card numbers by text, even with a familiar name.",
    };
  }
  return {
    level: "careful",
    emoji: "🤔",
    title: "Nothing obviously wrong",
    reason: "I didn't find the usual scam phrases, but I can't be certain.",
    advice: "If it asks for money, codes or personal details, treat it as a scam and check with family first.",
  };
}

export function hazelReply(question: string): string {
  const q = question.toLowerCase();
  if (!q.trim()) return "I'm here, Margaret. Ask me anything at all.";
  if (q.includes("medicine") || q.includes("pill") || q.includes("tablet"))
    return "You have three medicines today. The morning one is done ✅. The lunch tablet is next at 12:30 — take it with food and a glass of water. Would you like me to remind you?";
  if (q.includes("doctor") || q.includes("appointment"))
    return "Your next visit is Dr. Okafor on Friday, 17 May at 2:30 PM at Riverside Clinic, Room 4. It's a 10 minute drive. I can ask Robert to take you 🚗.";
  if (q.includes("bill") || q.includes("pay") || q.includes("money"))
    return "Two bills are waiting: electricity $42.60 (due in 3 days) and phone $28.00 (due in 9 days). Open the Bills page and press the big Pay button — I'll walk you through each step.";
  if (q.includes("scam") || q.includes("fraud") || q.includes("strange message"))
    return "Never share codes, passwords or card numbers, and never pay with gift cards. Paste the message into Scam Shield and I'll check it for you 🛡️.";
  if (q.includes("call") || q.includes("family") || q.includes("sophie") || q.includes("video"))
    return "Go to the Family page and press the big green Call button next to their photo. Sophie is usually free after 5 PM ❤️.";
  if (q.includes("lonely") || q.includes("sad") || q.includes("alone"))
    return "I'm sorry you're feeling that way, Margaret. Lily sent you new photos this morning, and Sophie loves a surprise call. Shall we ring her together? 🌷";
  if (q.includes("weather") || q.includes("walk"))
    return "It's 22°C and sunny today — lovely for a short walk. Take your stick and a bottle of water 🌤️.";
  if (q.includes("help") || q.includes("human"))
    return "Press the big orange Need help? button at the bottom right and a real person will ring you back within a few minutes. You're never stuck 💛.";
  return "I've made a note of that. In plain words: take it one step at a time, and I'll stay right here with you. You can also try asking about your medicines, doctor visits, bills, family or a suspicious message.";
}
