export interface Wisdom {
  text: string;
  source: string;
}

const wisdomQuotes: Wisdom[] = [
  { text: "The mind is everything. What you think you become.", source: "Buddha" },
  { text: "In the middle of difficulty lies opportunity.", source: "Einstein" },
  { text: "Focus on the journey, not the destination.", source: "Unknown" },
  { text: "The only way to do great work is to love what you do.", source: "Steve Jobs" },
  { text: "Mental toughness is not about having no emotions, it's about managing them.", source: "Tony Robbins" },
  { text: "The greatest weapon against stress is our ability to choose one thought over another.", source: "William James" },
  { text: "Your calm mind is the ultimate weapon against your challenges.", source: "Bryant McGill" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", source: "Thich Nhat Hanh" },
  { text: "Pressure is a privilege - it only comes to those who earn it.", source: "Unknown" },
  { text: "The mind is like water. When it's turbulent, it's difficult to see. When it's calm, everything becomes clear.", source: "Prasanna Mahesh" },
];

export function getWisdomForDay(): Wisdom {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return wisdomQuotes[dayOfYear % wisdomQuotes.length];
}
