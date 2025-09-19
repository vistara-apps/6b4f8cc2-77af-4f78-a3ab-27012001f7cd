import { WalletClient, PublicClient } from 'viem';
import { parseUnits, formatUnits, erc20Abi } from 'viem';
import { base } from 'wagmi/chains';
import { USDC_TOKEN_ADDRESS, USDC_DECIMALS, PAYMENT_TIMEOUT, CONFIRMATION_BLOCKS } from './constants';

export interface PaymentRequest {
  drawId: string;
  ticketCount: number;
  ticketPrice: number; // Price per ticket in USDC
  recipientAddress: string;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  confirmations?: number;
}

export class PaymentService {
  private publicClient: PublicClient | null = null;

  constructor() {
    // Public client will be initialized when needed
  }

  private async getPublicClient(): Promise<PublicClient> {
    if (!this.publicClient) {
      const { createPublicClient, http } = await import('viem');
      this.publicClient = createPublicClient({
        chain: base,
        transport: http(),
      }) as PublicClient;
    }
    return this.publicClient;
  }

  /**
   * Process USDC payment for lottery tickets using x402 protocol
   */
  async processTicketPayment(
    walletClient: WalletClient,
    paymentRequest: PaymentRequest
  ): Promise<PaymentResult> {
    try {
      const { drawId, ticketCount, ticketPrice, recipientAddress } = paymentRequest;
      
      if (!walletClient.account) {
        throw new Error('Wallet not connected');
      }

      // Calculate total amount in USDC (with decimals)
      const totalAmount = ticketCount * ticketPrice;
      const amountInWei = parseUnits(totalAmount.toString(), USDC_DECIMALS);

      console.log(`Processing payment for Draw ${drawId}:`, {
        ticketCount,
        ticketPrice,
        totalAmount,
        amountInWei: amountInWei.toString(),
      });

      // Check USDC balance
      const balance = await this.checkUSDCBalance(walletClient);
      if (balance < totalAmount) {
        throw new Error(`Insufficient USDC balance. Required: ${totalAmount} USDC, Available: ${balance} USDC`);
      }

      // Execute USDC transfer
      const hash = await walletClient.writeContract({
        address: USDC_TOKEN_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, amountInWei],
        chain: base,
        account: walletClient.account,
      });

      console.log('Transaction submitted:', hash);

      // Wait for transaction confirmation
      const publicClient = await this.getPublicClient();
      const confirmations = await this.waitForConfirmation(publicClient, hash);

      return {
        success: true,
        transactionHash: hash,
        confirmations,
      };

    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error',
      };
    }
  }

  /**
   * Check USDC balance for the connected wallet
   */
  async checkUSDCBalance(walletClient: WalletClient): Promise<number> {
    try {
      if (!walletClient.account) {
        throw new Error('Wallet not connected');
      }

      const publicClient = await this.getPublicClient();
      const balance = await publicClient.readContract({
        address: USDC_TOKEN_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [walletClient.account.address],
      });

      return parseFloat(formatUnits(balance, USDC_DECIMALS));
    } catch (error) {
      console.error('Failed to check USDC balance:', error);
      return 0;
    }
  }

  /**
   * Check USDC allowance for a spender
   */
  async checkUSDCAllowance(
    walletClient: WalletClient,
    spenderAddress: string
  ): Promise<number> {
    try {
      if (!walletClient.account) {
        throw new Error('Wallet not connected');
      }

      const publicClient = await this.getPublicClient();
      const allowance = await publicClient.readContract({
        address: USDC_TOKEN_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [walletClient.account.address, spenderAddress as `0x${string}`],
      });

      return parseFloat(formatUnits(allowance, USDC_DECIMALS));
    } catch (error) {
      console.error('Failed to check USDC allowance:', error);
      return 0;
    }
  }

  /**
   * Approve USDC spending for x402 payments
   */
  async approveUSDC(
    walletClient: WalletClient,
    spenderAddress: string,
    amount: number
  ): Promise<PaymentResult> {
    try {
      if (!walletClient.account) {
        throw new Error('Wallet not connected');
      }

      const amountInWei = parseUnits(amount.toString(), USDC_DECIMALS);

      const hash = await walletClient.writeContract({
        address: USDC_TOKEN_ADDRESS as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, amountInWei],
        chain: base,
        account: walletClient.account,
      });

      const publicClient = await this.getPublicClient();
      const confirmations = await this.waitForConfirmation(publicClient, hash);

      return {
        success: true,
        transactionHash: hash,
        confirmations,
      };

    } catch (error) {
      console.error('USDC approval failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Approval failed',
      };
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(
    publicClient: PublicClient,
    transactionHash: string
  ): Promise<number> {
    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash as `0x${string}`,
        confirmations: CONFIRMATION_BLOCKS,
        timeout: PAYMENT_TIMEOUT,
      });

      return receipt.blockNumber ? 1 : 0;
    } catch (error) {
      console.error('Failed to wait for confirmation:', error);
      return 0;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(
    transactionHash: string
  ): Promise<{
    status: 'pending' | 'confirmed' | 'failed';
    confirmations: number;
  }> {
    try {
      const publicClient = await this.getPublicClient();
      const receipt = await publicClient.getTransactionReceipt({
        hash: transactionHash as `0x${string}`,
      });

      if (receipt.status === 'success') {
        return {
          status: 'confirmed',
          confirmations: receipt.blockNumber ? 1 : 0,
        };
      } else {
        return {
          status: 'failed',
          confirmations: 0,
        };
      }
    } catch (error) {
      // Transaction might still be pending
      return {
        status: 'pending',
        confirmations: 0,
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();