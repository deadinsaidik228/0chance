"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNumber, formatPercentage } from "@/lib/solana-utils"
import { TrendingUp, Coins, Gift } from "lucide-react"

interface YieldFarm {
  id: string
  name: string
  stakingToken: string
  rewardToken: string
  apy: number
  tvl: number
  rewardRate: number
}

interface YieldFarmCardProps {
  farm: YieldFarm
  onStake: (farmId: string, amount: number) => void
  onUnstake: (farmId: string, amount: number) => void
  onClaimRewards: (farmId: string) => void
}

export function YieldFarmCard({ farm, onStake, onUnstake, onClaimRewards }: YieldFarmCardProps) {
  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")

  // Mock user data
  const userStaked = 125.5
  const pendingRewards = 8.75
  const userBalance = 500.0

  const handleStake = () => {
    const amount = Number.parseFloat(stakeAmount)
    if (amount > 0) {
      onStake(farm.id, amount)
      setStakeAmount("")
    }
  }

  const handleUnstake = () => {
    const amount = Number.parseFloat(unstakeAmount)
    if (amount > 0) {
      onUnstake(farm.id, amount)
      setUnstakeAmount("")
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{farm.name}</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <TrendingUp className="w-3 h-3 mr-1" />
            {formatPercentage(farm.apy)} APY
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Stake: {farm.stakingToken}</span>
          <span>Earn: {farm.rewardToken}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Farm Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Value Locked</p>
            <p className="font-medium">${formatNumber(farm.tvl)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Reward Rate</p>
            <p className="font-medium">
              {farm.rewardRate} {farm.rewardToken}/sec
            </p>
          </div>
        </div>

        {/* User Position */}
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Coins className="w-4 h-4" />
              Your Stake
            </span>
            <span className="font-medium">
              {formatNumber(userStaked)} {farm.stakingToken}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Gift className="w-4 h-4" />
              Pending Rewards
            </span>
            <span className="font-medium text-primary">
              {formatNumber(pendingRewards)} {farm.rewardToken}
            </span>
          </div>
        </div>

        {/* Action Tabs */}
        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="unstake">Unstake</TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-3 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Available Balance</span>
                <span>
                  {formatNumber(userBalance)} {farm.stakingToken}
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => setStakeAmount(userBalance.toString())}>
                  Max
                </Button>
              </div>
            </div>
            <Button
              onClick={handleStake}
              disabled={!stakeAmount || Number.parseFloat(stakeAmount) <= 0}
              className="w-full"
            >
              Stake Tokens
            </Button>
          </TabsContent>

          <TabsContent value="unstake" className="space-y-3 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Staked Balance</span>
                <span>
                  {formatNumber(userStaked)} {farm.stakingToken}
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => setUnstakeAmount(userStaked.toString())}>
                  Max
                </Button>
              </div>
            </div>
            <Button
              onClick={handleUnstake}
              disabled={!unstakeAmount || Number.parseFloat(unstakeAmount) <= 0}
              variant="outline"
              className="w-full bg-transparent"
            >
              Unstake Tokens
            </Button>
          </TabsContent>
        </Tabs>

        {/* Claim Rewards Button */}
        <Button
          onClick={() => onClaimRewards(farm.id)}
          disabled={pendingRewards <= 0}
          variant="secondary"
          className="w-full"
        >
          Claim {formatNumber(pendingRewards)} {farm.rewardToken}
        </Button>
      </CardContent>
    </Card>
  )
}
