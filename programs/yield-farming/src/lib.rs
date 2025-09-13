use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("YieldFarmingProtocol11111111111111111111111");

#[program]
pub mod yield_farming {
    use super::*;

    pub fn initialize_farm(
        ctx: Context<InitializeFarm>,
        reward_rate: u64,
        farm_duration: i64,
    ) -> Result<()> {
        let farm = &mut ctx.accounts.farm;
        farm.authority = ctx.accounts.authority.key();
        farm.reward_token_mint = ctx.accounts.reward_token_mint.key();
        farm.staking_token_mint = ctx.accounts.staking_token_mint.key();
        farm.reward_rate = reward_rate;
        farm.farm_duration = farm_duration;
        farm.total_staked = 0;
        farm.last_update_time = Clock::get()?.unix_timestamp;
        farm.reward_per_token_stored = 0;
        farm.is_active = true;
        
        Ok(())
    }

    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
        let farm = &mut ctx.accounts.farm;
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Update rewards before changing stake
        update_reward(farm, user_stake)?;
        
        // Transfer tokens from user to farm
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.farm_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        
        // Update stake info
        user_stake.amount += amount;
        farm.total_staked += amount;
        
        Ok(())
    }

    pub fn unstake_tokens(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
        let farm = &mut ctx.accounts.farm;
        let user_stake = &mut ctx.accounts.user_stake;
        
        require!(user_stake.amount >= amount, ErrorCode::InsufficientStake);
        
        // Update rewards before changing stake
        update_reward(farm, user_stake)?;
        
        // Transfer tokens from farm to user
        let seeds = &[
            b"farm".as_ref(),
            farm.authority.as_ref(),
            &[ctx.bumps.farm],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.farm_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: farm.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;
        
        // Update stake info
        user_stake.amount -= amount;
        farm.total_staked -= amount;
        
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let farm = &mut ctx.accounts.farm;
        let user_stake = &mut ctx.accounts.user_stake;
        
        update_reward(farm, user_stake)?;
        
        let rewards = user_stake.rewards_earned;
        require!(rewards > 0, ErrorCode::NoRewards);
        
        // Transfer reward tokens to user
        let seeds = &[
            b"farm".as_ref(),
            farm.authority.as_ref(),
            &[ctx.bumps.farm],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_token_account.to_account_info(),
            to: ctx.accounts.user_reward_account.to_account_info(),
            authority: farm.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, rewards)?;
        
        user_stake.rewards_earned = 0;
        
        Ok(())
    }
}

fn update_reward(farm: &mut Farm, user_stake: &mut UserStake) -> Result<()> {
    let current_time = Clock::get()?.unix_timestamp;
    
    if farm.total_staked > 0 {
        let time_diff = current_time - farm.last_update_time;
        let reward_per_token_increase = (farm.reward_rate as u128)
            .checked_mul(time_diff as u128)
            .unwrap()
            .checked_div(farm.total_staked as u128)
            .unwrap();
        
        farm.reward_per_token_stored += reward_per_token_increase as u64;
    }
    
    if user_stake.amount > 0 {
        let user_reward_increase = (user_stake.amount as u128)
            .checked_mul((farm.reward_per_token_stored - user_stake.reward_per_token_paid) as u128)
            .unwrap()
            .checked_div(1_000_000_000 as u128) // Scale factor
            .unwrap();
        
        user_stake.rewards_earned += user_reward_increase as u64;
    }
    
    user_stake.reward_per_token_paid = farm.reward_per_token_stored;
    farm.last_update_time = current_time;
    
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeFarm<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Farm::LEN,
        seeds = [b"farm", authority.key().as_ref()],
        bump
    )]
    pub farm: Account<'info, Farm>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub reward_token_mint: Account<'info, token::Mint>,
    pub staking_token_mint: Account<'info, token::Mint>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"farm", farm.authority.as_ref()],
        bump
    )]
    pub farm: Account<'info, Farm>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserStake::LEN,
        seeds = [b"user_stake", farm.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub farm_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"farm", farm.authority.as_ref()],
        bump
    )]
    pub farm: Account<'info, Farm>,
    
    #[account(
        mut,
        seeds = [b"user_stake", farm.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub farm_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        mut,
        seeds = [b"farm", farm.authority.as_ref()],
        bump
    )]
    pub farm: Account<'info, Farm>,
    
    #[account(
        mut,
        seeds = [b"user_stake", farm.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_reward_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub reward_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Farm {
    pub authority: Pubkey,
    pub reward_token_mint: Pubkey,
    pub staking_token_mint: Pubkey,
    pub reward_rate: u64,
    pub farm_duration: i64,
    pub total_staked: u64,
    pub last_update_time: i64,
    pub reward_per_token_stored: u64,
    pub is_active: bool,
}

impl Farm {
    pub const LEN: usize = 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 1;
}

#[account]
pub struct UserStake {
    pub user: Pubkey,
    pub farm: Pubkey,
    pub amount: u64,
    pub rewards_earned: u64,
    pub reward_per_token_paid: u64,
}

impl UserStake {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    #[msg("No rewards to claim")]
    NoRewards,
    #[msg("Farm is not active")]
    FarmNotActive,
}
