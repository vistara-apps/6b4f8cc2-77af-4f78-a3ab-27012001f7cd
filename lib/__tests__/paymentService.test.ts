import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentService } from '../paymentService';
import { USDC_TOKEN_ADDRESS, USDC_DECIMALS } from '../constants';

// Mock viem
vi.mock('viem', () => ({
  parseUnits: vi.fn((amount: string, decimals: number) => BigInt(parseFloat(amount) * Math.pow(10, decimals))),
  formatUnits: vi.fn((amount: bigint, decimals: number) => (Number(amount) / Math.pow(10, decimals)).toString()),
  erc20Abi: [
    {
      type: 'function',
      name: 'balanceOf',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
    },
    {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
    },
  ],
  createPublicClient: vi.fn(() => ({
    readContract: vi.fn(),
    waitForTransactionReceipt: vi.fn(),
    getTransactionReceipt: vi.fn(),
  })),
  http: vi.fn(),
}));

// Mock wagmi/chains
vi.mock('wagmi/chains', () => ({
  base: {
    id: 8453,
    name: 'Base',
    network: 'base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://mainnet.base.org'] },
      public: { http: ['https://mainnet.base.org'] },
    },
  },
}));

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockWalletClient: any;
  let mockPublicClient: any;

  beforeEach(() => {
    paymentService = new PaymentService();
    
    mockPublicClient = {
      readContract: vi.fn(),
      waitForTransactionReceipt: vi.fn(),
      getTransactionReceipt: vi.fn(),
    };

    mockWalletClient = {
      account: {
        address: '0x1234567890123456789012345678901234567890',
      },
      writeContract: vi.fn(),
    };
  });

  describe('checkUSDCBalance', () => {
    it('should return USDC balance for connected wallet', async () => {
      const mockBalance = BigInt(1000 * Math.pow(10, USDC_DECIMALS)); // 1000 USDC
      mockPublicClient.readContract.mockResolvedValue(mockBalance);
      
      // Mock the getPublicClient method
      vi.spyOn(paymentService as any, 'getPublicClient').mockResolvedValue(mockPublicClient);

      const balance = await paymentService.checkUSDCBalance(mockWalletClient);
      
      expect(balance).toBe(1000);
      expect(mockPublicClient.readContract).toHaveBeenCalledWith({
        address: USDC_TOKEN_ADDRESS,
        abi: expect.any(Array),
        functionName: 'balanceOf',
        args: [mockWalletClient.account.address],
      });
    });

    it('should return 0 if wallet is not connected', async () => {
      const walletClientWithoutAccount = { account: null };
      
      const balance = await paymentService.checkUSDCBalance(walletClientWithoutAccount as any);
      
      expect(balance).toBe(0);
    });

    it('should return 0 if balance check fails', async () => {
      mockPublicClient.readContract.mockRejectedValue(new Error('Network error'));
      vi.spyOn(paymentService as any, 'getPublicClient').mockResolvedValue(mockPublicClient);

      const balance = await paymentService.checkUSDCBalance(mockWalletClient);
      
      expect(balance).toBe(0);
    });
  });

  describe('processTicketPayment', () => {
    it('should successfully process a payment', async () => {
      const paymentRequest = {
        drawId: '1',
        ticketCount: 2,
        ticketPrice: 1, // 1 USDC per ticket
        recipientAddress: '0x742d35Cc6635C0532925a3b8D4A4e6b75C5b8888',
      };

      // Mock sufficient balance
      const mockBalance = BigInt(10 * Math.pow(10, USDC_DECIMALS)); // 10 USDC
      mockPublicClient.readContract.mockResolvedValue(mockBalance);
      
      // Mock successful transaction
      const mockTxHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
      mockWalletClient.writeContract.mockResolvedValue(mockTxHash);
      
      // Mock transaction receipt
      mockPublicClient.waitForTransactionReceipt.mockResolvedValue({
        blockNumber: 12345n,
        status: 'success',
      });

      vi.spyOn(paymentService as any, 'getPublicClient').mockResolvedValue(mockPublicClient);

      const result = await paymentService.processTicketPayment(mockWalletClient, paymentRequest);

      expect(result.success).toBe(true);
      expect(result.transactionHash).toBe(mockTxHash);
      expect(result.confirmations).toBe(1);
    });

    it('should fail if insufficient balance', async () => {
      const paymentRequest = {
        drawId: '1',
        ticketCount: 10,
        ticketPrice: 1,
        recipientAddress: '0x742d35Cc6635C0532925a3b8D4A4e6b75C5b8888',
      };

      // Mock insufficient balance (1 USDC, but need 10)
      const mockBalance = BigInt(1 * Math.pow(10, USDC_DECIMALS));
      mockPublicClient.readContract.mockResolvedValue(mockBalance);
      vi.spyOn(paymentService as any, 'getPublicClient').mockResolvedValue(mockPublicClient);

      const result = await paymentService.processTicketPayment(mockWalletClient, paymentRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient USDC balance');
    });

    it('should fail if wallet is not connected', async () => {
      const paymentRequest = {
        drawId: '1',
        ticketCount: 1,
        ticketPrice: 1,
        recipientAddress: '0x742d35Cc6635C0532925a3b8D4A4e6b75C5b8888',
      };

      const walletClientWithoutAccount = { account: null };

      const result = await paymentService.processTicketPayment(walletClientWithoutAccount as any, paymentRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Wallet not connected');
    });
  });

  describe('getTransactionStatus', () => {
    it('should return confirmed status for successful transaction', async () => {
      const txHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
      
      mockPublicClient.getTransactionReceipt.mockResolvedValue({
        status: 'success',
        blockNumber: 12345n,
      });

      vi.spyOn(paymentService as any, 'getPublicClient').mockResolvedValue(mockPublicClient);

      const status = await paymentService.getTransactionStatus(txHash);

      expect(status.status).toBe('confirmed');
      expect(status.confirmations).toBe(1);
    });

    it('should return pending status for non-existent transaction', async () => {
      const txHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
      
      mockPublicClient.getTransactionReceipt.mockRejectedValue(new Error('Transaction not found'));
      vi.spyOn(paymentService as any, 'getPublicClient').mockResolvedValue(mockPublicClient);

      const status = await paymentService.getTransactionStatus(txHash);

      expect(status.status).toBe('pending');
      expect(status.confirmations).toBe(0);
    });
  });
});

// Integration test constants
export const TEST_CONSTANTS = {
  USDC_TOKEN_ADDRESS,
  USDC_DECIMALS,
  TEST_WALLET_ADDRESS: '0x1234567890123456789012345678901234567890',
  TEST_RECIPIENT_ADDRESS: '0x742d35Cc6635C0532925a3b8D4A4e6b75C5b8888',
  MOCK_TX_HASH: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
};