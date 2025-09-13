"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatNumber, shortenAddress } from "@/lib/solana-utils"
import { Clock, CheckCircle, XCircle, Calendar, User } from "lucide-react"

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

interface ProposalCardProps {
  proposal: Proposal
  onVote: (proposalId: number, vote: "for" | "against") => void
}

export function ProposalCard({ proposal, onVote }: ProposalCardProps) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0
  const quorumProgress = (totalVotes / proposal.quorum) * 100

  const isActive = proposal.status === "active"
  const hasEnded = new Date() > proposal.endTime
  const timeLeft = proposal.endTime.getTime() - Date.now()
  const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)))

  const getStatusIcon = () => {
    switch (proposal.status) {
      case "active":
        return <Clock className="w-4 h-4" />
      case "queued":
        return <Calendar className="w-4 h-4" />
      case "executed":
        return <CheckCircle className="w-4 h-4" />
      case "failed":
        return <XCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = () => {
    switch (proposal.status) {
      case "active":
        return "bg-green-500/10 text-green-500"
      case "queued":
        return "bg-yellow-500/10 text-yellow-500"
      case "executed":
        return "bg-blue-500/10 text-blue-500"
      case "failed":
        return "bg-red-500/10 text-red-500"
    }
  }

  const getTypeLabel = () => {
    switch (proposal.type) {
      case "parameter":
        return "Parameter Change"
      case "treasury":
        return "Treasury Spend"
      case "upgrade":
        return "Contract Upgrade"
      case "farm":
        return "Add Farm"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                #{proposal.id} {proposal.title}
              </CardTitle>
              <Badge variant="outline" className={getStatusIcon && getStatusColor()}>
                {getStatusIcon()}
                <span className="ml-1 capitalize">{proposal.status}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{shortenAddress(proposal.proposer)}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getTypeLabel()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{proposal.description}</p>

        {/* Voting Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>For: {formatNumber(proposal.votesFor)}</span>
            <span>Against: {formatNumber(proposal.votesAgainst)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
              <div className="bg-green-500 transition-all duration-300" style={{ width: `${forPercentage}%` }} />
              <div className="bg-red-500 transition-all duration-300" style={{ width: `${againstPercentage}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{forPercentage.toFixed(1)}% For</span>
              <span>{againstPercentage.toFixed(1)}% Against</span>
            </div>
          </div>

          {/* Quorum Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Quorum Progress</span>
              <span>
                {formatNumber(totalVotes)} / {formatNumber(proposal.quorum)}
              </span>
            </div>
            <Progress value={Math.min(100, quorumProgress)} className="h-1" />
          </div>
        </div>

        {/* Time Information */}
        <div className="flex items-center justify-between text-sm">
          {isActive && !hasEnded ? (
            <span className="text-muted-foreground">{daysLeft > 0 ? `${daysLeft} days left` : "Ends today"}</span>
          ) : proposal.status === "queued" && proposal.executionTime ? (
            <span className="text-muted-foreground">Execution: {proposal.executionTime.toLocaleDateString()}</span>
          ) : (
            <span className="text-muted-foreground">Ended: {proposal.endTime.toLocaleDateString()}</span>
          )}
        </div>

        {/* Voting Buttons */}
        {isActive && !hasEnded && (
          <div className="flex gap-2 pt-2">
            <Button onClick={() => onVote(proposal.id, "for")} className="flex-1" size="sm">
              Vote For
            </Button>
            <Button onClick={() => onVote(proposal.id, "against")} variant="outline" className="flex-1" size="sm">
              Vote Against
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
