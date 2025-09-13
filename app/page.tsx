"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletButton } from "@/components/wallet-button"
import { DevnetFaucet } from "@/components/devnet-faucet"

export default function DeFiDashboard() {
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const totalValueLocked = 7500000
  const totalUsers = 12450
  const totalVolume24h = 10600000
  const totalFees24h = 31800

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-blue-900 font-bold text-lg">₿</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">SolanaYield</h1>
                  <p className="text-sm text-muted-foreground">DeFi Protocol on Solana Devnet</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {isDark ? "☀️" : "🌙"}
                </Button>
                <WalletButton />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <DevnetFaucet />
          </div>

          {/* Protocol Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value Locked</p>
                    <p className="text-2xl font-bold">${formatNumber(totalValueLocked)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💧</span>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 mr-1">↗️</span>
                  <span className="text-sm text-green-500">+12.5% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <p className="text-2xl font-bold">${formatNumber(totalVolume24h)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 mr-1">↗️</span>
                  <span className="text-sm text-green-500">+8.2% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{formatNumber(totalUsers)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 mr-1">↗️</span>
                  <span className="text-sm text-green-500">+156 new users</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">24h Fees</p>
                    <p className="text-2xl font-bold">${formatNumber(totalFees24h)}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 mr-1">↗️</span>
                  <span className="text-sm text-green-500">+15.3% from yesterday</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            {["overview", "farms", "pools", "swap", "governance", "analytics"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>📈</span>
                    Top Yield Farms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "SOL-USDC Farm", tvl: 2500000, apy: 0.185 },
                    { name: "RAY-SOL Farm", tvl: 1800000, apy: 0.225 },
                    { name: "ORCA-USDC Farm", tvl: 1200000, apy: 0.165 },
                  ].map((farm, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{farm.name}</p>
                        <p className="text-sm text-muted-foreground">TVL: ${formatNumber(farm.tvl)}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        {(farm.apy * 100).toFixed(1)}% APY
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>💧</span>
                    Top Liquidity Pools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "SOL/USDC", volume: 5200000, apy: 0.125 },
                    { name: "RAY/SOL", volume: 3800000, apy: 0.145 },
                    { name: "ORCA/USDC", volume: 2100000, apy: 0.115 },
                  ].map((pool, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{pool.name}</p>
                        <p className="text-sm text-muted-foreground">Volume: ${formatNumber(pool.volume)}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {(pool.apy * 100).toFixed(1)}% APY
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "farms" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Yield Farming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "SOL-USDC Farm", tvl: 2500000, apy: 0.185, staked: 0 },
                  { name: "RAY-SOL Farm", tvl: 1800000, apy: 0.225, staked: 0 },
                  { name: "ORCA-USDC Farm", tvl: 1200000, apy: 0.165, staked: 0 },
                ].map((farm, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle>{farm.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>APY:</span>
                        <Badge className="bg-emerald-100 text-emerald-700">{(farm.apy * 100).toFixed(1)}%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>TVL:</span>
                        <span>${formatNumber(farm.tvl)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Your Stake:</span>
                        <span>${formatNumber(farm.staked)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">Stake</Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Unstake
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab !== "overview" && activeTab !== "farms" && (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2 capitalize">{activeTab}</h3>
                <p className="text-muted-foreground">This section is coming soon!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
