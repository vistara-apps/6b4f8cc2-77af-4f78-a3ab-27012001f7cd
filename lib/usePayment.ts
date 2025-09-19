import { useState, useCallback } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { paymentService, PaymentRequest, PaymentResult } from './paymentService';

export interface PaymentState {
  isProcessing: boolean;
  isApproving: boolean;
  error: string | null;
  transactionHash: string | null;
  confirmations: number;
}

export interface PaymentHook {
  paymentState: PaymentState;
  balance: number | null;
  isConnected: boolean;
  processPayment: (request: PaymentRequest) => Promise<PaymentResult>;
  checkBalance: () => Promise<number>;
  resetPaymentState: () => void;
}

export function usePayment(): PaymentHook {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();

  const [paymentState, setPaymentState] = useState<PaymentState>({
    isProcessing: false,
    isApproving: false,
    error: null,
    transactionHash: null,
    confirmations: 0,
  });

  const [balance, setBalance] = useState<number | null>(null);

  const resetPaymentState = useCallback(() => {
    setPaymentState({
      isProcessing: false,
      isApproving: false,
      error: null,
      transactionHash: null,
      confirmations: 0,
    });
  }, []);

  const checkBalance = useCallback(async (): Promise<number> => {
    if (!walletClient || !isConnected) {
      setBalance(0);
      return 0;
    }

    try {
      const currentBalance = await paymentService.checkUSDCBalance(walletClient);
      setBalance(currentBalance);
      return currentBalance;
    } catch (error) {
      console.error('Failed to check balance:', error);
      setBalance(0);
      return 0;
    }
  }, [walletClient, isConnected]);

  const processPayment = useCallback(async (request: PaymentRequest): Promise<PaymentResult> => {
    if (!walletClient || !isConnected) {
      const error = 'Wallet not connected';
      setPaymentState(prev => ({ ...prev, error }));
      return { success: false, error };
    }

    setPaymentState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      transactionHash: null,
      confirmations: 0,
    }));

    try {
      // Process the payment
      const result = await paymentService.processTicketPayment(walletClient, request);

      if (result.success) {
        setPaymentState(prev => ({
          ...prev,
          isProcessing: false,
          transactionHash: result.transactionHash || null,
          confirmations: result.confirmations || 0,
        }));

        // Update balance after successful payment
        await checkBalance();
      } else {
        setPaymentState(prev => ({
          ...prev,
          isProcessing: false,
          error: result.error || 'Payment failed',
        }));
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      
      setPaymentState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
      }));

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [walletClient, isConnected, checkBalance]);

  return {
    paymentState,
    balance,
    isConnected,
    processPayment,
    checkBalance,
    resetPaymentState,
  };
}

export default usePayment;