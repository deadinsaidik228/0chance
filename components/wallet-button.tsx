"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "./wallet-provider"

export function WalletButton() {
  const { connected, publicKey, connect, disconnect } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-lg text-sm">
          <span className="text-green-600 dark:text-green-400">●</span> {formatAddress(publicKey)}
        </div>
        <Button variant="outline" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return <Button onClick={connect}>Connect Phantom</Button>
}
