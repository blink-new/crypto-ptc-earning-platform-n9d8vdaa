import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TransactionTrackerProps {
  transactionHash: string;
  currency: string;
  explorerUrl: string;
  onClose: () => void;
}

const TransactionTracker: React.FC<TransactionTrackerProps> = ({
  transactionHash,
  currency,
  explorerUrl,
  onClose
}) => {
  const [confirmations, setConfirmations] = useState(0);
  const [requiredConfirmations, setRequiredConfirmations] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isTracking, setIsTracking] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const checkTransaction = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('track-transaction', {
        body: { transaction_hash: transactionHash, currency }
      });

      if (!error && data) {
        setConfirmations(data.confirmations);
        setRequiredConfirmations(data.required_confirmations);
        setIsConfirmed(data.is_confirmed);
        setLastUpdate(new Date());
        
        if (data.is_confirmed) {
          setIsTracking(false);
        }
      }
    } catch (err) {
      console.error('Error tracking transaction:', err);
    }
  };

  useEffect(() => {
    checkTransaction();
    
    if (isTracking) {
      const interval = setInterval(checkTransaction, 15000); // Check every 15 seconds
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const getStatusIcon = () => {
    if (isConfirmed) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (confirmations > 0) {
      return <RefreshCw className="w-6 h-6 text-yellow-500 animate-spin" />;
    } else {
      return <Clock className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStatusText = () => {
    if (isConfirmed) {
      return 'Transaction Confirmed';
    } else if (confirmations > 0) {
      return 'Confirming Transaction';
    } else {
      return 'Transaction Pending';
    }
  };

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-xl p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
            {getStatusIcon()}
          </div>
          
          <h3 className="text-2xl font-bold text-white">{getStatusText()}</h3>
          
          <div className="space-y-2">
            <p className="text-gray-400">Transaction Hash</p>
            <p className="text-white font-mono text-sm break-all">
              {transactionHash.substring(0, 20)}...{transactionHash.substring(transactionHash.length - 20)}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Confirmations</span>
              <span className="text-white font-bold">
                {confirmations} / {requiredConfirmations}
              </span>
            </div>
            
            <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((confirmations / requiredConfirmations) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.open(explorerUrl, '_blank')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Blockchain Explorer
            </Button>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <AlertCircle className="w-4 h-4" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionTracker;