// Mock Solana types and functions for demo purposes
export class MockPublicKey {
  private _key: string

  constructor(key: string) {
    this._key = key
  }

  toString(): string {
    return this._key
  }

  toBase58(): string {
    return this._key
  }

  static isOnCurve(): boolean {
    return true
  }
}

export class MockConnection {
  private endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async getBalance(publicKey: MockPublicKey): Promise<number> {
    // Mock balance between 0.5 and 5 SOL
    return Math.random() * 4.5 + 0.5
  }

  async requestAirdrop(publicKey: MockPublicKey, lamports: number): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return mock transaction signature
    return `mock_signature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async confirmTransaction(signature: string): Promise<void> {
    // Simulate confirmation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

export const LAMPORTS_PER_SOL = 1000000000

// Mock wallet adapter types
export interface MockWalletAdapter {
  publicKey: MockPublicKey | null
  connected: boolean
  connect(): Promise<void>
  disconnect(): Promise<void>
}

export class MockPhantomWallet implements MockWalletAdapter {
  public publicKey: MockPublicKey | null = null
  public connected = false

  async connect(): Promise<void> {
    // Check if Phantom is available
    if (typeof window !== "undefined" && (window as any).solana?.isPhantom) {
      try {
        const response = await (window as any).solana.connect()
        this.publicKey = new MockPublicKey(response.publicKey.toString())
        this.connected = true
      } catch (error) {
        // Fallback to mock wallet for demo
        this.publicKey = new MockPublicKey("Demo" + Math.random().toString(36).substr(2, 40))
        this.connected = true
      }
    } else {
      // Mock wallet for demo when Phantom is not available
      this.publicKey = new MockPublicKey("Demo" + Math.random().toString(36).substr(2, 40))
      this.connected = true
    }
  }

  async disconnect(): Promise<void> {
    if (typeof window !== "undefined" && (window as any).solana?.isPhantom) {
      try {
        await (window as any).solana.disconnect()
      } catch (error) {
        // Ignore disconnect errors
      }
    }
    this.publicKey = null
    this.connected = false
  }
}
