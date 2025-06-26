import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  username: string;
  avatar: string;
  points: number;
  referralCode: string;
  referredBy?: string;
  totalEarnings: number;
  completedTasks: number;
  walletAddresses: {
    bitcoin?: string;
    ethereum?: string;
    litecoin?: string;
    dogecoin?: string;
  };
  signUpBonusClaimed?: boolean;
}

interface UserContextType {
  user: User | null;
  updatePoints: (amount: number) => void;
  completeTask: (taskId: string, points: number) => void;
  addReferral: (referralCode: string) => void;
  updateWalletAddress: (currency: string, address: string) => void;
  withdrawCrypto: (currency: string, amount: number, crypto_address: string) => Promise<boolean>;
  claimSignUpBonus: () => void;
  signInAnonymously: () => Promise<void>;
  updateProfile: (newUsername: string, newAvatar: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const generateReferralCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const signInAnonymously = async () => {
    const savedUser = localStorage.getItem('cryptoPtcUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const newUser: User = {
        id: `user_${Date.now()}`,
        username: 'CryptoEarner',
        avatar: '🚀',
        points: 0,
        referralCode: generateReferralCode(),
        totalEarnings: 0,
        completedTasks: 0,
        walletAddresses: {},
        signUpBonusClaimed: false
      };
      setUser(newUser);
      localStorage.setItem('cryptoPtcUser', JSON.stringify(newUser));
    }
  };

  useEffect(() => {
    signInAnonymously();
  }, []);

  const updatePoints = (amount: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      points: user.points + amount,
      totalEarnings: user.totalEarnings + amount
    };
    setUser(updatedUser);
    localStorage.setItem('cryptoPtcUser', JSON.stringify(updatedUser));
  };

  const completeTask = (taskId: string, points: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      points: user.points + points,
      completedTasks: user.completedTasks + 1,
      totalEarnings: user.totalEarnings + points
    };
    setUser(updatedUser);
    localStorage.setItem('cryptoPtcUser', JSON.stringify(updatedUser));
  };

  const addReferral = async (referralCode: string) => {
    if (!user || user.referredBy) return;

    try {
      const { error } = await supabase.functions.invoke('apply-referral', {
        body: {
          referral_code: referralCode,
          new_user_id: user.id,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error('Invalid referral code.');
      } else {
        const updatedUser = {
          ...user,
          referredBy: referralCode,
        };
        setUser(updatedUser);
        localStorage.setItem('cryptoPtcUser', JSON.stringify(updatedUser));
        toast.success('Referral bonus applied!');
      }
    } catch (err) {
      console.error('Error invoking apply-referral function:', err);
      toast.error('Failed to apply referral code.');
    }
  };

  const updateWalletAddress = (currency: string, address: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      walletAddresses: {
        ...user.walletAddresses,
        [currency]: address
      }
    };
    setUser(updatedUser);
    localStorage.setItem('cryptoPtcUser', JSON.stringify(updatedUser));
  };

  const withdrawCrypto = async (currency: string, amount: number, crypto_address: string): Promise<boolean> => {
    if (!user || user.points < amount) return false;

    try {
      const { data, error } = await supabase.functions.invoke('process-withdrawal', {
        body: {
          user_id: user.id,
          currency,
          amount: amount / 1000000, // Convert points to crypto amount
          points_deducted: amount,
          crypto_address,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        return false;
      }

      if (data.success) {
        const updatedUser = {
          ...user,
          points: user.points - amount,
        };
        setUser(updatedUser);
        localStorage.setItem('cryptoPtcUser', JSON.stringify(updatedUser));
        
        // Store transaction details for tracking
        localStorage.setItem('lastTransaction', JSON.stringify({
          withdrawal_id: data.withdrawal_id,
          transaction_hash: data.transaction_hash,
          currency,
          explorer_url: data.explorer_url
        }));
        
        return true;
      } else {
        console.error('Withdrawal failed:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Error invoking process-withdrawal function:', err);
      return false;
    }
  };

  const claimSignUpBonus = () => {
    if (!user || user.signUpBonusClaimed) return;
    const bonus = 1_000_000;
    const updatedUser = {
      ...user,
      points: user.points + bonus,
      totalEarnings: user.totalEarnings + bonus,
      signUpBonusClaimed: true
    };
    setUser(updatedUser);
    localStorage.setItem('cryptoPtcUser', JSON.stringify(updatedUser));
  };

  const updateProfile = async (newUsername: string, newAvatar: string) => {
    if (!user) return;

    const { data, error } = await supabase.auth.updateUser({
      data: { 
        username: newUsername,
        avatar: newAvatar,
      }
    })

    if (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
      return;
    }

    if (data.user) {
      const updatedUser: User = {
        ...user,
        username: newUsername,
        avatar: newAvatar,
      };
      setUser(updatedUser);
      localStorage.setItem('cryptoPtcUser', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
    }
  };

  const value: UserContextType = {
    user,
    updatePoints,
    completeTask,
    addReferral,
    updateWalletAddress,
    withdrawCrypto,
    claimSignUpBonus,
    signInAnonymously,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};