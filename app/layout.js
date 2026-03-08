import Header from "@/components/header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

export const metadata = {
  title: "Spott",
  description: "Discover and create amazing events",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-linear-to-br from-gray-950 via-zinc-900 to-stone-900 text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider appearance={{ baseTheme: dark }}>
            <ConvexClientProvider>
              <Header />
              <main className="relative min-h-screen mx-auto pt-40 md:pt-32">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                  <div className="absolute bottom-0 left-1/32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
                  <div className="absolute top-0 right-1/32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 min-h-[70vh]">{children}</div>
                <footer className="border-t border-gray-800/50 py-8 px-6 max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>
                      © {new Date().getFullYear()} Utkarsh. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                      <a
                        href="https://github.com/Utkarsh164"
                        target="_blank"
                        className="hover:text-white transition"
                      >
                        GitHub
                      </a>

                      <a
                        href="https://github.com/Utkarsh164/spott"
                        target="_blank"
                        className="hover:text-white transition"
                      >
                        Repo
                      </a>
                    </div>
                  </div>
                </footer>
                <Toaster richColors />
              </main>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
