import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Cinzel } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Court of Shadows",
  description: "A real-time multiplayer game of courtly intrigue and betrayal",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${cinzel.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
