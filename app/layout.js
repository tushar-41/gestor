import "./globals.css";
import { Toaster } from "sonner";
import { DM_Sans, Playfair_Display } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700"],
});

export const metadata = {
  title: "Gestor - Track your developer learning journey",
  description:
    "Gestor helps developers plan, track, and visualize their learning journey. " +
    "Manage topics, log review sessions with spaced repetition, link projects, and chart " +
    "your growth across every skill you master.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className={dmSans.className}>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
        {children}
      </body>
    </html>
  );
}
