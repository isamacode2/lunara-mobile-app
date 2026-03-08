
"use client"

import { ShieldCheck, Lock, EyeOff, UserCheck, MapPinOff, Smartphone } from 'lucide-react';

export default function SafetyPage() {
  const privacyPoints = [
    { text: "No public profiles. Never visible to non-members or search engines.", icon: EyeOff },
    { text: "Mutual unlock required. Profiles only visible when both consent.", icon: Lock },
    { text: "Screenshot deterrence. Technical measures to discourage capture.", icon: Smartphone },
    { text: "Zero data selling. Never sold, shared with advertisers, or monetised.", icon: ShieldCheck },
    { text: "Approximate location only. Exact location never exposed.", icon: MapPinOff },
    { text: "Data encryption in transit and at rest.", icon: ShieldCheck },
  ];

  const consentPoints = [
    { text: "Intent declaration before connecting. Shared with the other person." },
    { text: "Mutual consent for messaging. Both must accept." },
    { text: "Relationship transparency required. Deception is a violation." },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 bg-white min-h-screen">
      <header className="mb-12">
        <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-3">Privacy & Safety</p>
        <h1 className="text-4xl font-bold text-secondary mb-4 tracking-tight">The Lunara Standard</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          How we protect you. What we expect. No ambiguity.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-secondary mb-8">Privacy by Design</h2>
        <ul className="space-y-6">
          {privacyPoints.map((point, i) => (
            <li key={i} className="flex gap-4 items-start group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              <p className="text-muted-foreground leading-snug group-hover:text-secondary transition-colors">
                {point.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-px bg-border w-full mb-12" />

      <section className="mb-20">
        <h2 className="text-xl font-bold text-secondary mb-8">Consent Architecture</h2>
        <ul className="space-y-6">
          {consentPoints.map((point, i) => (
            <li key={i} className="flex gap-4 items-start group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              <p className="text-muted-foreground leading-snug group-hover:text-secondary transition-colors">
                {point.text}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
