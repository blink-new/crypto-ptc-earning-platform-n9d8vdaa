import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Transaction {
  id: string;
  currency: string;
  amount: number;
  points_deducted: number;
  crypto_address: string;
  status: string;
  transaction_hash: string | null;
  created_at: string;
  usd_value: number;
}

const TransactionHistory: React.FC = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'processing':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getExplorerUrl = (currency: string, txHash: string) => {
    const explorers: Record<string, string> = {
      BTC: `https://blockchain.info/tx/${txHash}`,
      ETH: `https://etherscan.io/tx/${txHash}`,
      USDT: `https://tronscan.org/#/transaction/${txHash}`,
      TRX: `https://tronscan.org/#/transaction/${txHash}`
    };
    return explorers[currency] || '';
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
        
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(tx.status)}
                      <span className={`font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold">
                          {tx.amount} {tx.currency}
                        </span>
                        <span className="text-gray-400">
                          ≈ ${tx.usd_value?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        {tx.points_deducted.toLocaleString()} points
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  {tx.transaction_hash && tx.status === 'completed' && (
                    <button
                      onClick={() => window.open(getExplorerUrl(tx.currency, tx.transaction_hash!), '_blank')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TransactionHistory;