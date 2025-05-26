import type React from "react"
import { MainNav } from "@/components/main-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { NavigationEvents } from "@/components/navigation-events"
import { AuthProvider } from "@/contexts/auth-context"

import "./globals.css"

export { metadata } from "./metadata"

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <MainNav />
            <main className="pt-16">{children}</main>
            <NavigationEvents />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 