import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/components/wallet-provider"
import { SolanaProvider } from "@/components/solana-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "SolanaYield - DeFi Protocol",
  description: "Advanced DeFi yield farming platform on Solana blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${inter.variable}`}>
        <SolanaProvider>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </SolanaProvider>
      </body>
    </html>
  )
}
