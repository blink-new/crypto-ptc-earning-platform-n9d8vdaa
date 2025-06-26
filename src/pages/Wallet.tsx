import React, { useState } from 'react';
import { Wallet as WalletIcon, Send, CreditCard, DollarSign, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import TransactionTracker from '../components/TransactionTracker';
import TransactionHistory from '../components/TransactionHistory';

interface CryptoCurrency {
  symbol: string;
  name: string;
  icon: string;
  conversionRate: number; // points per unit
  minWithdraw: number;
  networkFee: number;
  estimatedTime: string;
}

interface TransactionInfo {
  withdrawal_id: string;
  transaction_hash: string;
  currency: string;
  explorer_url: string;
}

const Wallet = () => {
  const { user, updateWalletAddress, withdrawCrypto } = useUser();
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<TransactionInfo | null>(null);

  const cryptocurrencies: CryptoCurrency[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '₿',
      conversionRate: 1000000,
      minWithdraw: 0.005,
      networkFee: 0.0001,
      estimatedTime: '15-30 seconds'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'Ξ',
      conversionRate: 30000,
      minWithdraw: 0.005,
      networkFee: 0.002,
      estimatedTime: '10-20 seconds'
    },
    {
      symbol: 'LTC',
      name: 'Litecoin',
      icon: 'Ł',
      conversionRate: 120000,
      minWithdraw: 0.005,
      networkFee: 0.001,
      estimatedTime: '5-15 seconds'
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      icon: 'Ð',
      conversionRate: 25000,
      minWithdraw: 0.005,
      networkFee: 1,
      estimatedTime: '5-10 seconds'
    }
  ];

  const handleWithdraw = async () => {
    if (!selectedCrypto || !withdrawAmount || !walletAddress) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const pointsRequired = amount * selectedCrypto.conversionRate;

    if (amount < selectedCrypto.minWithdraw) {
      toast.error(`Minimum withdrawal: ${selectedCrypto.minWithdraw} ${selectedCrypto.symbol}`);
      return;
    }

    if (!user || user.points < pointsRequired) {
      toast.error('Insufficient points');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Save wallet address
      updateWalletAddress(selectedCrypto.symbol.toLowerCase(), walletAddress);
      
      const success = await withdrawCrypto(selectedCrypto.symbol, amount, walletAddress);
      
      if (success) {
        toast.success(`Processing ${amount} ${selectedCrypto.symbol} withdrawal...`);
        
        // Get transaction info from localStorage
        const txInfo = localStorage.getItem('lastTransaction');
        if (txInfo) {
          const transaction: TransactionInfo = JSON.parse(txInfo);
          setActiveTransaction(transaction);
        }
        
        setWithdrawAmount('');
        setWalletAddress('');
        setSelectedCrypto(null);
      } else {
        toast.error('Withdrawal failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCryptoValue = (points: number) => {
    if (!selectedCrypto) return 0;
    return points / selectedCrypto.conversionRate;
  };

  const getUSDValue = (cryptoAmount: number, crypto: CryptoCurrency) => {
    // Mock USD values for demonstration
    const usdRates: { [key: string]: number } = {
      BTC: 45000,
      ETH: 2500,
      LTC: 80,
      DOGE: 0.08
    };
    return cryptoAmount * (usdRates[crypto.symbol] || 0);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Crypto Wallet
          </h1>
          <p className="text-xl text-gray-300">
            Instant cryptocurrency withdrawals - Get paid in under 30 seconds!
          </p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/30 backdrop-blur-sm">
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Available Balance</h3>
              <div className="text-4xl font-bold text-green-400">
                {user?.points.toLocaleString() || '0'} PTC
              </div>
              <div className="text-green-200">
                ≈ ${((user?.points || 0) * 0.001).toFixed(2)} USD
              </div>
            </div>
          </div>
        </Card>

        {/* Cryptocurrency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cryptocurrencies.map((crypto) => {
            const maxAmount = getCryptoValue(user?.points || 0);
            const usdValue = getUSDValue(maxAmount, crypto);
            const isSelected = selectedCrypto?.symbol === crypto.symbol;
            
            return (
              <Card 
                key={crypto.symbol}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-500/50' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30'
                } backdrop-blur-sm`}
                onClick={() => setSelectedCrypto(crypto)}
              >
                <div className="p-4 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                    {crypto.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{crypto.name}</h3>
                    <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-white font-medium">
                      {maxAmount.toFixed(8)}
                    </div>
                    <div className="text-green-400 text-sm">
                      ≈ ${usdValue.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Min: {crypto.minWithdraw} {crypto.symbol}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Withdrawal Form */}
        {selectedCrypto && (
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Withdraw {selectedCrypto.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount ({selectedCrypto.symbol})
                    </label>
                    <Input
                      type="number"
                      step="0.00000001"
                      placeholder={`Min: ${selectedCrypto.minWithdraw}`}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                    {withdrawAmount && (
                      <div className="mt-2 space-y-1">
                        <div className="text-sm text-gray-400">
                          Points required: {(parseFloat(withdrawAmount) * selectedCrypto.conversionRate).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-400">
                          USD value: ${getUSDValue(parseFloat(withdrawAmount), selectedCrypto).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {selectedCrypto.name} Wallet Address
                    </label>
                    <Input
                      type="text"
                      placeholder={`Enter your ${selectedCrypto.symbol} wallet address`}
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                    <h4 className="text-white font-medium flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span>Transaction Details</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network Fee:</span>
                        <span className="text-white">{selectedCrypto.networkFee} {selectedCrypto.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Time:</span>
                        <span className="text-green-400">{selectedCrypto.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-green-400 flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>Instant</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || !walletAddress || isProcessing}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Withdraw Now</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-900/20 border-blue-500/30 backdrop-blur-sm">
            <div className="p-4 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold">Real Blockchain</h3>
              <p className="text-blue-200 text-sm">
                Actual cryptocurrency transactions on real blockchains
              </p>
            </div>
          </Card>

          <Card className="bg-green-900/20 border-green-500/30 backdrop-blur-sm">
            <div className="p-4 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold">Live Tracking</h3>
              <p className="text-green-200 text-sm">
                Track your transactions with real-time confirmations
              </p>
            </div>
          </Card>

          <Card className="bg-purple-900/20 border-purple-500/30 backdrop-blur-sm">
            <div className="p-4 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold">Instant Payouts</h3>
              <p className="text-purple-200 text-sm">
                Withdrawals processed in seconds, not days
              </p>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <TransactionHistory />

        {/* Transaction Tracker Modal */}
        {activeTransaction && (
          <TransactionTracker
            transactionHash={activeTransaction.transaction_hash}
            currency={activeTransaction.currency}
            explorerUrl={activeTransaction.explorer_url}
            onClose={() => setActiveTransaction(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Wallet;