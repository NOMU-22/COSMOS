import React, { Suspense } from "react";
import BookingWizard from "@/components/BookingWizard";

export const metadata = {
  title: "Book Your Slot | Cosmos Gaming Mumbai",
  description: "Select date, choose PC, PS5, VR or Racing Sim stations, view real-time availability and confirm your booking online.",
};

export default function BookPage() {
  return (
    <div className="min-h-[85vh] relative">
      <div className="cosmos-glow-orb w-[500px] h-[500px] bg-purple-600/15 top-10 left-1/2 -translate-x-1/2" />
      <Suspense fallback={<div className="py-24 text-center text-xs text-slate-400">Loading booking engine...</div>}>
        <BookingWizard />
      </Suspense>
    </div>
  );
}
