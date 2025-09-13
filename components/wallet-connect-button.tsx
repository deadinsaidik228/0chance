"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react"
import { shortenAddress } from "@/lib/solana-utils"

export function WalletConnectButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress] = useState("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU")
  const [balance] = useState(12.45)

  const handleConnect = () => {
    // In a real app, this would trigger wallet connection
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
  }

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} className="flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="font-mono">{shortenAddress(walletAddress)}</span>
          <Badge variant="secondary" className="ml-2">
            {balance.toFixed(2)} SOL
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3 border-b">
          <p className="text-sm font-medium">Wallet Address</p>
          <p className="text-xs text-muted-foreground font-mono">{walletAddress}</p>
          <p className="text-sm mt-2">Balance: {balance.toFixed(4)} SOL</p>
        </div>

        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>

        <DropdownMenuItem>
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
