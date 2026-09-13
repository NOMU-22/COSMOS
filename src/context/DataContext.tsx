"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GamingZone,
  PricingTier,
  Offer,
  EventTournament,
  Game,
  Review,
  GalleryImage,
  BusinessSettings,
} from "@/types";

interface DataContextType {
  zones: GamingZone[];
  pricing: PricingTier[];
  offers: Offer[];
  events: EventTournament[];
  games: Game[];
  reviews: Review[];
  gallery: GalleryImage[];
  settings: BusinessSettings | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  zones: [],
  pricing: [],
  offers: [],
  events: [],
  games: [],
  reviews: [],
  gallery: [],
  settings: null,
  isLoading: true,
  refreshData: async () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<{
    zones: GamingZone[];
    pricing: PricingTier[];
    offers: Offer[];
    events: EventTournament[];
    games: Game[];
    reviews: Review[];
    gallery: GalleryImage[];
    settings: BusinessSettings | null;
  }>({
    zones: [],
    pricing: [],
    offers: [],
    events: [],
    games: [],
    reviews: [],
    gallery: [],
    settings: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      const res = await fetch("/api/public/data");
      const json = await res.json();
      setData({
        zones: json.zones || [],
        pricing: json.pricing || [],
        offers: json.offers || [],
        events: json.events || [],
        games: json.games || [],
        reviews: json.reviews || [],
        gallery: json.gallery || [],
        settings: json.settings || null,
      });
    } catch (error) {
      console.error("Failed to load public data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        ...data,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
