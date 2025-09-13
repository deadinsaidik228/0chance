use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("GovernanceProtocol1111111111111111111111111");

#[program]
pub mod governance {
    use super::*;

    pub fn initialize_governance(
        ctx: Context<InitializeGovernance>,
        voting_period: i64,
        execution_delay: i64,
        proposal_threshold: u64,
        quorum_threshold: u64,
    ) -> Result<()> {
        let governance = &mut ctx.accounts.governance;
        governance.authority = ctx.accounts.authority.key();
        governance.governance_token_mint = ctx.accounts.governance_token_mint.key();
        governance.voting_period = voting_period;
        governance.execution_delay = execution_delay;
        governance.proposal_threshold = proposal_threshold;
        governance.quorum_threshold = quorum_threshold;
        governance.proposal_count = 0;
        governance.is_active = true;
        
        Ok(())
    }

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        proposal_type: ProposalType,
        execution_data: Vec<u8>,
    ) -> Result<()> {
        let governance = &mut ctx.accounts.governance;
        let proposal = &mut ctx.accounts.proposal;
        let user_tokens = &ctx.accounts.user_token_account;

        // Check if user has enough tokens to create proposal
        require!(
            user_tokens.amount >= governance.proposal_threshold,
            ErrorCode::InsufficientTokensForProposal
        );

        proposal.id = governance.proposal_count;
        proposal.proposer = ctx.accounts.proposer.key();
        proposal.title = title;
        proposal.description = description;
        proposal.proposal_type = proposal_type;
        proposal.execution_data = execution_data;
        proposal.votes_for = 0;
        proposal.votes_against = 0;
        proposal.status = ProposalStatus::Active;
        proposal.created_at = Clock::get()?.unix_timestamp;
        proposal.voting_ends_at = proposal.created_at + governance.voting_period;
        proposal.execution_eta = 0;

        governance.proposal_count += 1;

        Ok(())
    }

    pub fn cast_vote(
        ctx: Context<CastVote>,
        proposal_id: u64,
        vote: VoteType,
        voting_power: u64,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let vote_record = &mut ctx.accounts.vote_record;
        let user_tokens = &ctx.accounts.user_token_account;

        // Check if proposal is still active
        require!(
            proposal.status == ProposalStatus::Active,
            ErrorCode::ProposalNotActive
        );

        // Check if voting period hasn't ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time <= proposal.voting_ends_at,
            ErrorCode::VotingPeriodEnded
        );

        // Check if user has enough tokens
        require!(
            user_tokens.amount >= voting_power,
            ErrorCode::InsufficientVotingPower
        );

        // Check if user hasn't voted already
        require!(
            vote_record.has_voted == false,
            ErrorCode::AlreadyVoted
        );

        // Record the vote
        vote_record.voter = ctx.accounts.voter.key();
        vote_record.proposal_id = proposal_id;
        vote_record.vote = vote;
        vote_record.voting_power = voting_power;
        vote_record.has_voted = true;

        // Update proposal vote counts
        match vote {
            VoteType::For => proposal.votes_for += voting_power,
            VoteType::Against => proposal.votes_against += voting_power,
        }

        Ok(())
    }

    pub fn queue_proposal(ctx: Context<QueueProposal>, proposal_id: u64) -> Result<()> {
        let governance = &ctx.accounts.governance;
        let proposal = &mut ctx.accounts.proposal;

        // Check if proposal is active
        require!(
            proposal.status == ProposalStatus::Active,
            ErrorCode::ProposalNotActive
        );

        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time > proposal.voting_ends_at,
            ErrorCode::VotingPeriodNotEnded
        );

        // Check if proposal passed (more votes for than against and meets quorum)
        let total_votes = proposal.votes_for + proposal.votes_against;
        require!(
            total_votes >= governance.quorum_threshold,
            ErrorCode::QuorumNotMet
        );
        require!(
            proposal.votes_for > proposal.votes_against,
            ErrorCode::ProposalFailed
        );

        // Queue the proposal for execution
        proposal.status = ProposalStatus::Queued;
        proposal.execution_eta = current_time + governance.execution_delay;

        Ok(())
    }

    pub fn execute_proposal(ctx: Context<ExecuteProposal>, proposal_id: u64) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;

        // Check if proposal is queued
        require!(
            proposal.status == ProposalStatus::Queued,
            ErrorCode::ProposalNotQueued
        );

        // Check if execution delay has passed
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= proposal.execution_eta,
            ErrorCode::ExecutionDelayNotMet
        );

        // Execute the proposal (implementation depends on proposal type)
        match proposal.proposal_type {
            ProposalType::ParameterChange => {
                // Handle parameter changes
                msg!("Executing parameter change proposal");
            },
            ProposalType::TreasurySpend => {
                // Handle treasury spending
                msg!("Executing treasury spend proposal");
            },
            ProposalType::UpgradeContract => {
                // Handle contract upgrades
                msg!("Executing contract upgrade proposal");
            },
            ProposalType::AddFarm => {
                // Handle adding new farms
                msg!("Executing add farm proposal");
            },
        }

        proposal.status = ProposalStatus::Executed;

        Ok(())
    }

    pub fn delegate_voting_power(
        ctx: Context<DelegateVotingPower>,
        delegate_to: Pubkey,
        amount: u64,
    ) -> Result<()> {
        let delegation = &mut ctx.accounts.delegation;
        let user_tokens = &ctx.accounts.user_token_account;

        require!(
            user_tokens.amount >= amount,
            ErrorCode::InsufficientTokensForDelegation
        );

        delegation.delegator = ctx.accounts.delegator.key();
        delegation.delegate = delegate_to;
        delegation.amount = amount;
        delegation.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGovernance<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Governance::LEN,
        seeds = [b"governance"],
        bump
    )]
    pub governance: Account<'info, Governance>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub governance_token_mint: Account<'info, Mint>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct CreateProposal<'info> {
    #[account(mut)]
    pub governance: Account<'info, Governance>,
    
    #[account(
        init,
        payer = proposer,
        space = 8 + Proposal::LEN,
        seeds = [b"proposal", governance.key().as_ref(), &proposal_id.to_le_bytes()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub proposer: Signer<'info>,
    
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    #[account(
        init,
        payer = voter,
        space = 8 + VoteRecord::LEN,
        seeds = [b"vote", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct QueueProposal<'info> {
    pub governance: Account<'info, Governance>,
    
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
}

#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    pub executor: Signer<'info>,
}

#[derive(Accounts)]
pub struct DelegateVotingPower<'info> {
    #[account(
        init,
        payer = delegator,
        space = 8 + Delegation::LEN,
        seeds = [b"delegation", delegator.key().as_ref()],
        bump
    )]
    pub delegation: Account<'info, Delegation>,
    
    #[account(mut)]
    pub delegator: Signer<'info>,
    
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Governance {
    pub authority: Pubkey,
    pub governance_token_mint: Pubkey,
    pub voting_period: i64,
    pub execution_delay: i64,
    pub proposal_threshold: u64,
    pub quorum_threshold: u64,
    pub proposal_count: u64,
    pub is_active: bool,
}

impl Governance {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 8 + 8 + 1;
}

#[account]
pub struct Proposal {
    pub id: u64,
    pub proposer: Pubkey,
    pub title: String,
    pub description: String,
    pub proposal_type: ProposalType,
    pub execution_data: Vec<u8>,
    pub votes_for: u64,
    pub votes_against: u64,
    pub status: ProposalStatus,
    pub created_at: i64,
    pub voting_ends_at: i64,
    pub execution_eta: i64,
}

impl Proposal {
    pub const LEN: usize = 8 + 32 + 256 + 1024 + 1 + 256 + 8 + 8 + 1 + 8 + 8 + 8;
}

#[account]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub proposal_id: u64,
    pub vote: VoteType,
    pub voting_power: u64,
    pub has_voted: bool,
}

impl VoteRecord {
    pub const LEN: usize = 32 + 8 + 1 + 8 + 1;
}

#[account]
pub struct Delegation {
    pub delegator: Pubkey,
    pub delegate: Pubkey,
    pub amount: u64,
    pub created_at: i64,
}

impl Delegation {
    pub const LEN: usize = 32 + 32 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalType {
    ParameterChange,
    TreasurySpend,
    UpgradeContract,
    AddFarm,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalStatus {
    Active,
    Queued,
    Executed,
    Cancelled,
    Failed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VoteType {
    For,
    Against,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient tokens to create proposal")]
    InsufficientTokensForProposal,
    #[msg("Proposal is not active")]
    ProposalNotActive,
    #[msg("Voting period has ended")]
    VotingPeriodEnded,
    #[msg("Insufficient voting power")]
    InsufficientVotingPower,
    #[msg("User has already voted")]
    AlreadyVoted,
    #[msg("Voting period has not ended")]
    VotingPeriodNotEnded,
    #[msg("Quorum not met")]
    QuorumNotMet,
    #[msg("Proposal failed")]
    ProposalFailed,
    #[msg("Proposal is not queued")]
    ProposalNotQueued,
    #[msg("Execution delay not met")]
    ExecutionDelayNotMet,
    #[msg("Insufficient tokens for delegation")]
    InsufficientTokensForDelegation,
}
