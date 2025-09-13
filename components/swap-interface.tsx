"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Settings } from "lucide-react"
import { type LiquidityPool, LiquidityPoolManager } from "@/lib/liquidity-pool"
import { formatNumber, formatPercentage } from "@/lib/solana-utils"

interface SwapInterfaceProps {
  pools: LiquidityPool[]
  onSwap: (poolId: string, inputToken: "A" | "B", inputAmount: number) => void
}

export function SwapInterface({ pools, onSwap }: SwapInterfaceProps) {
  const [selectedPool, setSelectedPool] = useState<string>("")
  const [inputAmount, setInputAmount] = useState<string>("")
  const [inputToken, setInputToken] = useState<"A" | "B">("A")
  const [slippage, setSlippage] = useState<number>(0.5)

  const pool = pools.find((p) => p.id === selectedPool)
  const poolManager = new LiquidityPoolManager({} as any) // Mock for demo

  const swapCalculation =
    pool && inputAmount
      ? poolManager.calculateSwapOutput(
          Number.parseFloat(inputAmount),
          inputToken === "A" ? pool.tokenA.reserve : pool.tokenB.reserve,
          inputToken === "A" ? pool.tokenB.reserve : pool.tokenA.reserve,
        )
      : null

  const handleSwap = () => {
    if (!pool || !inputAmount) return
    onSwap(pool.id, inputToken, Number.parseFloat(inputAmount))
  }

  const toggleTokens = () => {
    setInputToken(inputToken === "A" ? "B" : "A")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Swap Tokens</CardTitle>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pool Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Pool</label>
          <Select value={selectedPool} onValueChange={setSelectedPool}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a trading pair" />
            </SelectTrigger>
            <SelectContent>
              {pools.map((pool) => (
                <SelectItem key={pool.id} value={pool.id}>
                  {pool.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {pool && (
          <>
            {/* Input Token */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">From</label>
                <span className="text-xs text-muted-foreground">
                  Balance: {formatNumber(1000)} {inputToken === "A" ? pool.tokenA.symbol : pool.tokenB.symbol}
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" className="min-w-20 bg-transparent">
                  {inputToken === "A" ? pool.tokenA.symbol : pool.tokenB.symbol}
                </Button>
              </div>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" onClick={toggleTokens} className="rounded-full p-2">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Output Token */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={swapCalculation ? swapCalculation.outputAmount.toFixed(6) : ""}
                  readOnly
                  className="flex-1 bg-muted"
                />
                <Button variant="outline" className="min-w-20 bg-transparent">
                  {inputToken === "A" ? pool.tokenB.symbol : pool.tokenA.symbol}
                </Button>
              </div>
            </div>

            {/* Swap Details */}
            {swapCalculation && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Price Impact</span>
                  <span className={swapCalculation.priceImpact > 0.05 ? "text-destructive" : ""}>
                    {formatPercentage(swapCalculation.priceImpact)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Trading Fee</span>
                  <span>
                    {swapCalculation.fee.toFixed(6)} {inputToken === "A" ? pool.tokenA.symbol : pool.tokenB.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Minimum Received</span>
                  <span>{(swapCalculation.outputAmount * (1 - slippage / 100)).toFixed(6)}</span>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={!inputAmount || Number.parseFloat(inputAmount) <= 0}
              className="w-full"
              size="lg"
            >
              {!inputAmount ? "Enter Amount" : "Swap Tokens"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
