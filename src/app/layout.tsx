import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RouteProvider } from "@/providers/route-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { cx } from "@/utils/cx";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Object Detection App",
  description: "Software to detect objects using YOLO models",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cx(inter.variable, "--background-color-gradient antialiased scroll-smooth")}>
        <RouteProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </RouteProvider>
      </body>
    </html>
  );
}