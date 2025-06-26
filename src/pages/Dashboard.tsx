import React from 'react';
import { Coins, CheckCircle, Users, TrendingUp, Zap, DollarSign, Trophy, Star } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SignUpBonusCard from '../components/SignUpBonusCard';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, claimSignUpBonus, signInAnonymously } = useUser();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Points Balance',
      value: user ? user.points.toLocaleString() : '0',
      subValue: `$${user ? (user.points / 10000).toFixed(2) : '0.00'} USD`,
      icon: Coins,
      gradient: 'from-amber-500 to-orange-600',
      trend: '+12.5%',
      bgGradient: 'from-amber-500/10 to-orange-600/10',
    },
    {
      title: 'Tasks Completed',
      value: user ? user.completedTasks.toString() : '0',
      subValue: 'This month',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      trend: '+8 today',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
    },
    {
      title: 'Referral Earnings',
      value: user ? `$${(user.totalEarnings / 10000).toFixed(2)}` : '$0.00',
      subValue: 'Total earned',
      icon: Users,
      gradient: 'from-purple-500 to-pink-600',
      trend: '+$2.50',
      bgGradient: 'from-purple-500/10 to-pink-600/10',
    },
    {
      title: 'Rank',
      value: 'Gold',
      subValue: 'Top 15%',
      icon: Trophy,
      gradient: 'from-yellow-400 to-yellow-600',
      trend: '↗ Rising',
      bgGradient: 'from-yellow-400/10 to-yellow-600/10',
    }
  ];

  const quickActions = [
    {
      title: 'Start Earning',
      description: 'Complete new tasks',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-600',
      action: () => navigate('/tasks')
    },
    {
      title: 'Withdraw',
      description: 'Cash out your earnings',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600',
      action: () => navigate('/wallet')
    },
    {
      title: 'Invite Friends',
      description: 'Earn 25% commission',
      icon: Users,
      gradient: 'from-purple-500 to-pink-600',
      action: () => navigate('/referrals')
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-crypto-orange to-crypto-red flex items-center justify-center animate-glow">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text-crypto">
              Welcome Back!
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to earn some crypto today?
            </p>
          </div>
        </div>
        {!user && (
          <Button
            onClick={signInAnonymously}
            className="interactive-button bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started - One Click Sign In!
          </Button>
        )}
      </div>

      {/* Sign-up Bonus Card */}
      {!user?.signUpBonusClaimed && (
        <div className="animate-scale-in">
          <SignUpBonusCard onClaim={claimSignUpBonus} />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} className={`interactive-card glass-strong border-white/10 p-6 relative overflow-hidden group animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-75 transition-opacity`} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-400 font-medium">{stat.trend}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.subValue}</div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5 animate-float opacity-20" />
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-crypto-orange" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={action.title} className="interactive-card glass-strong border-white/10 p-6 cursor-pointer group animate-scale-in" style={{ animationDelay: `${(index + 4) * 0.1}s` }} onClick={action.action}>
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white flex items-center">
          <CheckCircle className="w-6 h-6 mr-3 text-crypto-green" />
          Recent Activity
        </h2>
        
        <Card className="glass-strong border-white/10 p-6">
          <div className="space-y-4">
            {[
              { action: 'Completed task', points: '+250,000', time: '2 minutes ago', type: 'task' },
              { action: 'Referral bonus earned', points: '+125,000', time: '1 hour ago', type: 'referral' },
              { action: 'Sign-up bonus claimed', points: '+1,000,000', time: '2 hours ago', type: 'bonus' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl glass hover:glass-strong transition-all">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'task' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'referral' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {activity.type === 'task' ? <Zap className="w-5 h-5" /> :
                     activity.type === 'referral' ? <Users className="w-5 h-5" /> :
                     <Star className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
                <div className="text-green-400 font-semibold">{activity.points}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;