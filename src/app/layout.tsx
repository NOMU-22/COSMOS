import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cosmos Gaming Mumbai | High-End PS5, PC, VR & Simulators | Bandra East",
  description:
    "Official website and slot booking for Cosmos Gaming Mumbai in Bandra East. Play on high-end 240Hz PCs, PlayStation 5, VR Gun Setup, and Racing Simulators. Book your slot online.",
  keywords: [
    "Cosmos Gaming Mumbai",
    "Gaming Cafe Bandra East",
    "PS5 Gaming Mumbai",
    "PC Gaming Cafe Mumbai",
    "VR Gaming Lounge Mumbai",
    "Esports Tournaments Mumbai",
    "Cosmos Gaming Centre",
  ],
  openGraph: {
    title: "Cosmos Gaming Mumbai | Premium Gaming Lounge & Esports Centre",
    description:
      "Book high-end PC, PS5, VR, and Racing Simulator slots online at Cosmos Gaming Centre, Bandra East, Mumbai.",
    url: "https://cosmosgamingmumbai.com",
    siteName: "Cosmos Gaming Mumbai",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LocalBusiness structured data for SEO with verified details
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    name: "Cosmos Gaming Mumbai",
    alternateName: "Cosmos Gaming Centre",
    description: "Premium gaming cafe and esports centre in Bandra East, Mumbai featuring PS5, High-End PC, VR Gun Setup, and Racing Simulators.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cosmos Gaming Centre, Bandra East",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400051",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.0596,
      longitude: 72.8465,
    },
    url: "https://cosmosgamingmumbai.com",
    telephone: "+919820012345",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "23:00",
      },
    ],
    sameAs: ["https://www.instagram.com/cosmosgamingmumbai/"],
    priceRange: "₹₹",
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Rajdhani:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#07070b] text-[#f8fafc] antialiased selection:bg-purple-600/30 selection:text-purple-200 min-h-screen flex flex-col font-['Outfit',sans-serif]">
        <AuthProvider>
          <DataProvider>
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
