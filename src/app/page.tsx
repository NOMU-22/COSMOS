import React from "react";
import Hero from "@/components/Hero";
import GamingZones from "@/components/GamingZones";
import PricingSection from "@/components/PricingSection";
import OffersSection from "@/components/OffersSection";
import EventsSection from "@/components/EventsSection";
import ReviewsSection from "@/components/ReviewsSection";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <GamingZones />
      <PricingSection />
      <OffersSection />
      <EventsSection />
      <ReviewsSection />
      <LocationSection />
    </div>
  );
}
