"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { MockPhantomWallet } from "@/lib/mock-solana"

interface WalletContextType {
  wallet: MockPhantomWallet | null
  connected: boolean
  publicKey: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet] = useState(() => new MockPhantomWallet())
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setConnected(true)
      setPublicKey(wallet.publicKey.toString())
    }
  }, [wallet])

  const connect = async () => {
    try {
      await wallet.connect()
      setConnected(wallet.connected)
      setPublicKey(wallet.publicKey?.toString() || null)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnect = async () => {
    try {
      await wallet.disconnect()
      setConnected(wallet.connected)
      setPublicKey(wallet.publicKey?.toString() || null)
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  return (
    <WalletContext.Provider value={{ wallet, connected, publicKey, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}
