import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { PartyDetails } from './components/PartyDetails';
import { DressCode } from './components/DressCode';
import { PartyVibes } from './components/PartyVibes';
import { RSVPForm } from './components/RSVPForm';
import { Location } from './components/Location';
import { Footer } from './components/Footer';
import { HostDrawer } from './components/HostDrawer';
import { MusicPlayerWidget } from './components/MusicPlayerWidget';

export default function App() {
  const [hostDrawerOpen, setHostDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07070c] text-white selection:bg-fuchsia-500 selection:text-white relative bg-noise">
      {/* Fixed Sticky Navbar */}
      <Navbar onOpenHost={() => setHostDrawerOpen(true)} />

      {/* Hero Section with Interactive 3D Disco Ball */}
      <main>
        <Hero />

        {/* Live Countdown to Oct 3, 2026, 9:30 PM */}
        <Countdown />

        {/* The Important Stuff (When, Where, What to Bring) */}
        <PartyDetails />

        {/* Dress Code Section (No Theme, Black is 37% cooler) */}
        <DressCode />

        {/* The Party Vibe (Expect Absolutely Nothing) */}
        <PartyVibes />

        {/* RSVP Section (Functional with dynamic guests & confetti) */}
        <RSVPForm />

        {/* Location Section (Map preview & directions) */}
        <Location />
      </main>

      {/* Footer */}
      <Footer onOpenHost={() => setHostDrawerOpen(true)} />

      {/* Persistent Audio Player Widget for Silver Lines by ANOTR */}
      <MusicPlayerWidget />

      {/* Host Guest List & Google Sheets Setup Drawer */}
      <HostDrawer
        isOpen={hostDrawerOpen}
        onClose={() => setHostDrawerOpen(false)}
      />
    </div>
  );
}
