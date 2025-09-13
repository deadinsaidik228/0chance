"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatNumber } from "@/lib/solana-utils"
import { TrendingUp, TrendingDown, Activity, DollarSign, Zap } from "lucide-react"

// Mock data for charts
const tvlData = [
  { date: "2024-01-01", tvl: 5200000 },
  { date: "2024-01-02", tvl: 5450000 },
  { date: "2024-01-03", tvl: 5800000 },
  { date: "2024-01-04", tvl: 6100000 },
  { date: "2024-01-05", tvl: 6350000 },
  { date: "2024-01-06", tvl: 6800000 },
  { date: "2024-01-07", tvl: 7500000 },
]

const volumeData = [
  { date: "2024-01-01", volume: 8500000, fees: 25500 },
  { date: "2024-01-02", volume: 9200000, fees: 27600 },
  { date: "2024-01-03", volume: 8800000, fees: 26400 },
  { date: "2024-01-04", volume: 10100000, fees: 30300 },
  { date: "2024-01-05", volume: 9600000, fees: 28800 },
  { date: "2024-01-06", volume: 11200000, fees: 33600 },
  { date: "2024-01-07", volume: 10600000, fees: 31800 },
]

const farmDistribution = [
  { name: "SOL-USDC LP", value: 35, color: "bg-emerald-500" },
  { name: "USDC Single", value: 25, color: "bg-emerald-600" },
  { name: "SOL Single", value: 30, color: "bg-teal-500" },
  { name: "Others", value: 10, color: "bg-teal-600" },
]

const userGrowthData = [
  { date: "2024-01-01", users: 8500, newUsers: 120 },
  { date: "2024-01-02", users: 8920, newUsers: 420 },
  { date: "2024-01-03", users: 9350, newUsers: 430 },
  { date: "2024-01-04", users: 9800, newUsers: 450 },
  { date: "2024-01-05", users: 10250, newUsers: 450 },
  { date: "2024-01-06", users: 10720, newUsers: 470 },
  { date: "2024-01-07", users: 12450, newUsers: 1730 },
]

const apyData = [
  { farm: "SOL-USDC LP", apy: 45, risk: "Medium" },
  { farm: "SOL Single", apy: 35, risk: "Low" },
  { farm: "USDC Single", apy: 25, risk: "Low" },
  { farm: "SOL-USDT LP", apy: 38, risk: "Medium" },
  { farm: "USDC-USDT LP", apy: 22, risk: "Low" },
]

export function AnalyticsDashboard() {
  const maxTvl = Math.max(...tvlData.map((d) => d.tvl))
  const maxVolume = Math.max(...volumeData.map((d) => d.volume))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Protocol Analytics</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Live Data
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tvl">TVL & Volume</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="yields">Yields</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Protocol Revenue</p>
                    <p className="text-xl font-bold">$31.8K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+15.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Farms</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+2 new</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg APY</p>
                    <p className="text-xl font-bold">33.2%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-chart-2" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">-2.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-xl font-bold">45.2K</p>
                  </div>
                  <Activity className="w-8 h-8 text-chart-3" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+8.7%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farm Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>TVL Distribution by Farm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>APY Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apyData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.farm}</span>
                        <span className="text-sm font-bold text-primary">{item.apy}%</span>
                      </div>
                      <Progress value={(item.apy / 50) * 100} className="h-2" />
                      <span className="text-xs text-muted-foreground">Risk: {item.risk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tvl" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Value Locked (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tvlData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20">{item.date.slice(5)}</span>
                      <div className="flex-1 bg-muted rounded-full h-4 relative overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(item.tvl / maxTvl) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-16">${(item.tvl / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume & Fees (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {volumeData.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.date.slice(5)}</span>
                        <div className="text-xs">
                          <span className="text-emerald-600">Vol: ${(item.volume / 1000000).toFixed(1)}M</span>
                          <span className="text-emerald-800 ml-2">Fees: ${(item.fees / 1000).toFixed(1)}K</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-3 relative overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${(item.volume / maxVolume) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth (7 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userGrowthData.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <span className="text-sm text-muted-foreground w-20">{item.date.slice(5)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Total Users</span>
                        <span className="text-sm font-bold">{formatNumber(item.users)}</span>
                      </div>
                      <Progress value={(item.users / 15000) * 100} className="h-2 mb-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">New Users</span>
                        <span className="text-xs font-medium text-emerald-600">+{item.newUsers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yields" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {apyData.map((farm, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{farm.farm}</p>
                        <p className="text-sm text-muted-foreground">Risk Level: {farm.risk}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{farm.apy}%</p>
                      <p className="text-sm text-muted-foreground">APY</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={(farm.apy / 50) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
