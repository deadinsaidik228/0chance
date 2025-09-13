"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateProposalDialog } from "@/components/create-proposal-dialog"
import { ProposalCard } from "@/components/proposal-card"
import { formatNumber, formatPercentage } from "@/lib/solana-utils"
import { Vote, Users, CheckCircle, Calendar } from "lucide-react"

interface Proposal {
  id: number
  title: string
  description: string
  proposer: string
  type: "parameter" | "treasury" | "upgrade" | "farm"
  status: "active" | "queued" | "executed" | "failed"
  votesFor: number
  votesAgainst: number
  quorum: number
  endTime: Date
  executionTime?: Date
}

// Mock proposals data
const mockProposals: Proposal[] = [
  {
    id: 1,
    title: "Increase SOL-USDC Farm Rewards",
    description:
      "Proposal to increase the reward rate for SOL-USDC LP farm from 100 to 150 tokens per second to attract more liquidity.",
    proposer: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    type: "parameter",
    status: "active",
    votesFor: 125000,
    votesAgainst: 45000,
    quorum: 100000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    id: 2,
    title: "Treasury Fund Marketing Initiative",
    description: "Allocate 50,000 USDC from treasury for marketing campaigns to increase protocol adoption.",
    proposer: "9yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    type: "treasury",
    status: "queued",
    votesFor: 200000,
    votesAgainst: 80000,
    quorum: 100000,
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    executionTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    id: 3,
    title: "Add BTC-SOL Liquidity Pool",
    description: "Create a new liquidity pool for BTC-SOL trading pair with 30% APY rewards.",
    proposer: "5xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    type: "farm",
    status: "executed",
    votesFor: 180000,
    votesAgainst: 20000,
    quorum: 100000,
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
]

export function GovernanceDashboard() {
  const [activeTab, setActiveTab] = useState("proposals")
  const [showCreateProposal, setShowCreateProposal] = useState(false)

  // Mock governance stats
  const governanceStats = {
    totalTokens: 10000000,
    circulatingTokens: 7500000,
    stakedTokens: 3200000,
    votingPower: 2500000,
    activeProposals: 3,
    totalProposals: 15,
    participationRate: 0.65,
  }

  const handleVote = (proposalId: number, vote: "for" | "against") => {
    console.log(`Voting ${vote} on proposal ${proposalId}`)
    // Implement voting logic
  }

  const handleDelegate = (delegateTo: string, amount: number) => {
    console.log(`Delegating ${amount} tokens to ${delegateTo}`)
    // Implement delegation logic
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Governance</h2>
          <p className="text-muted-foreground">Participate in protocol governance and shape the future</p>
        </div>
        <Button onClick={() => setShowCreateProposal(true)}>Create Proposal</Button>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Voting Power</p>
                <p className="text-xl font-bold">{formatNumber(governanceStats.votingPower)}</p>
              </div>
              <Vote className="w-8 h-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatPercentage(governanceStats.votingPower / governanceStats.circulatingTokens)} of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Proposals</p>
                <p className="text-xl font-bold">{governanceStats.activeProposals}</p>
              </div>
              <Calendar className="w-8 h-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{governanceStats.totalProposals} total proposals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participation Rate</p>
                <p className="text-xl font-bold">{formatPercentage(governanceStats.participationRate)}</p>
              </div>
              <Users className="w-8 h-8 text-chart-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Staked Tokens</p>
                <p className="text-xl font-bold">{formatNumber(governanceStats.stakedTokens)}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-chart-3" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatPercentage(governanceStats.stakedTokens / governanceStats.circulatingTokens)} of supply
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="voting">My Votes</TabsTrigger>
          <TabsTrigger value="delegation">Delegation</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Active ({mockProposals.filter((p) => p.status === "active").length})
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              Queued ({mockProposals.filter((p) => p.status === "queued").length})
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Executed ({mockProposals.filter((p) => p.status === "executed").length})
            </Badge>
          </div>

          <div className="space-y-4">
            {mockProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} onVote={handleVote} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="voting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Voting History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProposals.slice(0, 2).map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{proposal.title}</p>
                      <p className="text-sm text-muted-foreground">Voted: For • Power: 2,500 tokens</p>
                    </div>
                    <Badge variant={proposal.status === "executed" ? "default" : "secondary"}>{proposal.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delegation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delegate Voting Power</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current Delegation</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delegated to: Self</span>
                  <span className="font-medium">2,500 tokens</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Top Delegates</h4>
                {[
                  { address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", power: 125000, proposals: 8 },
                  { address: "9yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", power: 98000, proposals: 12 },
                  { address: "5xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", power: 87000, proposals: 6 },
                ].map((delegate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-mono text-sm">
                        {delegate.address.slice(0, 8)}...{delegate.address.slice(-8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(delegate.power)} voting power • {delegate.proposals} proposals
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDelegate(delegate.address, 1000)}>
                      Delegate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateProposalDialog open={showCreateProposal} onOpenChange={setShowCreateProposal} />
    </div>
  )
}
