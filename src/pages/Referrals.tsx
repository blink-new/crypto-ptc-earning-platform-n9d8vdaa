import React, { useState, useEffect } from 'react';
import { Gift, Users, DollarSign, Copy, Check, Share2, Trophy, Star, TrendingUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const Referrals: React.FC = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);

  const referralLink = user ? `${window.location.origin}/?ref=${user.referralCode}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const text = `Join me on CryptoPTC and start earning real cryptocurrency! Use my referral link: ${referralLink}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`
    };
    window.open(urls[platform], '_blank');
  };

  // Mock data for referred users
  useEffect(() => {
    if (user) {
      setReferrals([
        { id: 1, name: 'CryptoKing', date: '2024-01-20', reward: '125,000', status: 'active', avatar: '👑' },
        { id: 2, name: 'SatoshiJr', date: '2024-01-18', reward: '125,000', status: 'active', avatar: '🚀' },
        { id: 3, name: 'EtherFan', date: '2024-01-15', reward: '125,000', status: 'active', avatar: '💎' },
        { id: 4, name: 'BlockchainBro', date: '2024-01-12', reward: '125,000', status: 'active', avatar: '⚡' },
      ]);
    }
  }, [user]);

  const stats = [
    {
      title: 'Friends Referred',
      value: referrals.length.toString(),
      subValue: 'Total invites',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-500/10 to-cyan-600/10',
    },
    {
      title: 'Total Earnings',
      value: '$37.50',
      subValue: 'From referrals',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
    },
    {
      title: 'Commission Rate',
      value: '25%',
      subValue: 'Forever',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-600/10',
    },
    {
      title: 'Rank',
      value: 'Silver',
      subValue: 'Referrer level',
      icon: Trophy,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-500/10 to-orange-600/10',
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-glow">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text-crypto">
              Refer & Earn
            </h1>
            <p className="text-lg text-muted-foreground">
              Invite friends and earn 25% of their task earnings, forever!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className={`interactive-card glass-strong border-white/10 p-6 relative overflow-hidden group animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-75 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.subValue}</div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5 animate-float opacity-20" />
          </Card>
        ))}
      </div>

      {/* Referral Link Card */}
      <Card className="glass-strong border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crypto-orange/5 to-crypto-red/5" />
        
        <div className="relative z-10 p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-display font-bold text-white">Your Referral Link</h3>
            <p className="text-muted-foreground">Share this link with your friends to earn rewards</p>
          </div>

          {/* Link Display */}
          <div className="relative">
            <div className="flex items-center space-x-3 p-4 rounded-2xl glass-strong border border-white/20">
              <div className="flex-1 font-mono text-sm text-white truncate">
                {referralLink}
              </div>
              <Button 
                onClick={copyToClipboard} 
                size="sm" 
                className="interactive-button bg-gradient-to-r from-crypto-orange to-crypto-red text-white flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white text-center">Share on Social Media</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Twitter', icon: '🐦', platform: 'twitter', color: 'from-blue-400 to-blue-600' },
                { name: 'Facebook', icon: '👥', platform: 'facebook', color: 'from-blue-600 to-indigo-600' },
                { name: 'Telegram', icon: '💬', platform: 'telegram', color: 'from-blue-500 to-cyan-500' },
                { name: 'WhatsApp', icon: '📱', platform: 'whatsapp', color: 'from-green-500 to-emerald-600' },
              ].map((social) => (
                <Button
                  key={social.platform}
                  onClick={() => shareOnSocial(social.platform)}
                  className={`interactive-button bg-gradient-to-r ${social.color} text-white p-4 h-auto flex flex-col space-y-2`}
                >
                  <div className="text-2xl">{social.icon}</div>
                  <div className="text-sm font-medium">{social.name}</div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <Card className="glass-strong border-white/10 p-8">
        <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center">
          <Star className="w-6 h-6 mr-3 text-crypto-orange" />
          How It Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Share Your Link',
              description: 'Send your unique referral link to friends and family',
              icon: Share2,
              color: 'from-blue-500 to-cyan-600'
            },
            {
              step: '2',
              title: 'They Sign Up',
              description: 'Your friends register and start completing tasks',
              icon: Users,
              color: 'from-purple-500 to-pink-600'
            },
            {
              step: '3',
              title: 'You Both Earn',
              description: 'Receive 25% of their earnings forever, plus they get a bonus',
              icon: DollarSign,
              color: 'from-green-500 to-emerald-600'
            }
          ].map((step) => (
            <div key={step.step} className="text-center space-y-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto shadow-lg`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Referred Users List */}
      <Card className="glass-strong border-white/10 p-6">
        <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center">
          <Users className="w-6 h-6 mr-3 text-crypto-green" />
          Your Referrals ({referrals.length})
        </h3>
        
        <div className="space-y-4">
          {referrals.map((referral, index) => (
            <div key={referral.id} className={`flex items-center justify-between p-4 rounded-2xl glass-strong border border-white/10 hover:border-white/20 transition-all animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl glass-strong border border-white/20 flex items-center justify-center text-xl">
                  {referral.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{referral.name}</div>
                  <div className="text-sm text-muted-foreground">Joined on {referral.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">+{referral.reward}</div>
                <div className="text-xs text-muted-foreground">Points earned</div>
              </div>
            </div>
          ))}
          
          {referrals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No referrals yet. Start sharing your link to earn rewards!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Referrals;