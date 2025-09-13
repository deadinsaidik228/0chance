"use client"

import { createContext, useContext, type ReactNode } from "react"
import { MockConnection, MockPublicKey, LAMPORTS_PER_SOL } from "@/lib/mock-solana"

interface SolanaContextType {
  connection: MockConnection
  getBalance: (publicKey: string) => Promise<number>
  requestAirdrop: (publicKey: string, amount: number) => Promise<string>
}

const SolanaContext = createContext<SolanaContextType | null>(null)

export function SolanaProvider({ children }: { children: ReactNode }) {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
  const connection = new MockConnection(rpcUrl)

  const getBalance = async (publicKey: string): Promise<number> => {
    try {
      const pubKey = new MockPublicKey(publicKey)
      const balance = await connection.getBalance(pubKey)
      return balance
    } catch (error) {
      console.error("Failed to get balance:", error)
      return 0
    }
  }

  const requestAirdrop = async (publicKey: string, amount: number): Promise<string> => {
    try {
      const pubKey = new MockPublicKey(publicKey)
      const signature = await connection.requestAirdrop(pubKey, amount * LAMPORTS_PER_SOL)
      await connection.confirmTransaction(signature)
      return signature
    } catch (error) {
      console.error("Failed to request airdrop:", error)
      throw error
    }
  }

  return <SolanaContext.Provider value={{ connection, getBalance, requestAirdrop }}>{children}</SolanaContext.Provider>
}

export function useSolana() {
  const context = useContext(SolanaContext)
  if (!context) {
    throw new Error("useSolana must be used within SolanaProvider")
  }
  return context
}
