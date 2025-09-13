"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LiquidityPool } from "@/lib/liquidity-pool"
import { formatNumber, formatPercentage } from "@/lib/solana-utils"
import { TrendingUp, Droplets, DollarSign } from "lucide-react"

interface LiquidityPoolCardProps {
  pool: LiquidityPool
  onAddLiquidity: (poolId: string) => void
  onRemoveLiquidity: (poolId: string) => void
}

export function LiquidityPoolCard({ pool, onAddLiquidity, onRemoveLiquidity }: LiquidityPoolCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{pool.name}</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <TrendingUp className="w-3 h-3 mr-1" />
            {formatPercentage(pool.apy)} APY
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pool Reserves */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{pool.tokenA.symbol} Reserve</p>
            <p className="font-medium">{formatNumber(pool.tokenA.reserve)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{pool.tokenB.symbol} Reserve</p>
            <p className="font-medium">{formatNumber(pool.tokenB.reserve)}</p>
          </div>
        </div>

        {/* Pool Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Droplets className="w-4 h-4 text-primary mr-1" />
            </div>
            <p className="text-xs text-muted-foreground">TVL</p>
            <p className="text-sm font-medium">${formatNumber(pool.totalLiquidity)}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-accent mr-1" />
            </div>
            <p className="text-xs text-muted-foreground">24h Volume</p>
            <p className="text-sm font-medium">${formatNumber(pool.volume24h)}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-chart-3 mr-1" />
            </div>
            <p className="text-xs text-muted-foreground">24h Fees</p>
            <p className="text-sm font-medium">${formatNumber(pool.fees24h)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={() => onAddLiquidity(pool.id)} className="flex-1" size="sm">
            Add Liquidity
          </Button>
          <Button onClick={() => onRemoveLiquidity(pool.id)} variant="outline" className="flex-1" size="sm">
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
