"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "./wallet-provider"
import { useSolana } from "./solana-provider"
import { useToast } from "@/hooks/use-toast"

export function DevnetFaucet() {
  const { connected, publicKey } = useWallet()
  const { requestAirdrop, getBalance } = useSolana()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)

  const handleAirdrop = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const signature = await requestAirdrop(publicKey, 1)
      toast({
        title: "Airdrop Successful!",
        description: `Received 1 SOL. Transaction: ${signature.slice(0, 8)}...`,
      })
      // Update balance after airdrop
      const newBalance = await getBalance(publicKey)
      setBalance(newBalance)
    } catch (error) {
      toast({
        title: "Airdrop Failed",
        description: "Please try again later or check if you've reached the daily limit.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckBalance = async () => {
    if (!publicKey) return

    try {
      const currentBalance = await getBalance(publicKey)
      setBalance(currentBalance)
    } catch (error) {
      toast({
        title: "Failed to check balance",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!connected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Connect your wallet to use the devnet faucet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🚰</span>
          Devnet Faucet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Your Balance:</span>
          <span className="font-mono">{balance !== null ? `${balance.toFixed(4)} SOL` : "Click to check"}</span>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCheckBalance} variant="outline" className="flex-1 bg-transparent">
            Check Balance
          </Button>
          <Button onClick={handleAirdrop} disabled={loading} className="flex-1">
            {loading ? "Requesting..." : "Get 1 SOL"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">Devnet SOL has no real value. Use it for testing only.</p>
      </CardContent>
    </Card>
  )
}
