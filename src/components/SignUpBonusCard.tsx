import React from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onClaim: () => void;
}

const SignUpBonusCard: React.FC<Props> = ({ onClaim }) => (
  <div className="bg-gradient-to-r from-blue-700 to-green-500 rounded-xl p-6 flex items-center gap-4 shadow-lg mb-8 animate-fade-in">
    <Gift className="w-12 h-12 text-white drop-shadow" />
    <div className="flex-1">
      <div className="text-lg font-bold text-white">Sign Up Bonus!</div>
      <div className="text-white/90 mb-2">You’ve received a <span className="font-bold">1,000,000 points</span> sign-up bonus (worth big $$$) for joining! Claim now and withdraw instantly to your crypto wallet.</div>
      <Button onClick={onClaim} className="bg-white text-blue-700 font-bold hover:bg-blue-100">Claim Bonus</Button>
    </div>
  </div>
);

export default SignUpBonusCard;
