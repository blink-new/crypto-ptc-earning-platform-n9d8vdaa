import React, { useState } from 'react';
import { Zap, Clock, Star, DollarSign, ExternalLink, CheckCircle, Play, Trophy } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TASKS = [
  {
    id: 't1',
    title: 'Visit Crypto News Site',
    description: 'Stay updated with the latest crypto news and trends',
    points: 250_000,
    timeRequired: '10 seconds',
    difficulty: 'Easy',
    category: 'News',
    icon: '📰',
    bonus: false,
  },
  {
    id: 't2',
    title: 'Watch Sponsored Video',
    description: 'Learn about exciting new blockchain projects',
    points: 300_000,
    timeRequired: '30 seconds',
    difficulty: 'Easy',
    category: 'Video',
    icon: '🎥',
    bonus: true,
  },
  {
    id: 't3',
    title: 'Join Telegram Group',
    description: 'Connect with our community and get exclusive updates',
    points: 200_000,
    timeRequired: '15 seconds',
    difficulty: 'Easy',
    category: 'Social',
    icon: '💬',
    bonus: false,
  },
  {
    id: 't4',
    title: 'Complete Survey',
    description: 'Share your thoughts about crypto trends',
    points: 500_000,
    timeRequired: '3 minutes',
    difficulty: 'Medium',
    category: 'Survey',
    icon: '📋',
    bonus: true,
  },
  {
    id: 't5',
    title: 'Follow Twitter Account',
    description: 'Stay connected with the latest project updates',
    points: 150_000,
    timeRequired: '5 seconds',
    difficulty: 'Easy',
    category: 'Social',
    icon: '🐦',
    bonus: false,
  },
];

const Tasks: React.FC = () => {
  const { user, completeTask } = useUser();
  const [completed, setCompleted] = useState<string[]>([]);

  const handleComplete = (taskId: string, points: number) => {
    if (!completed.includes(taskId)) {
      completeTask(taskId, points);
      setCompleted([...completed, taskId]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-emerald-600';
      case 'Medium': return 'from-yellow-500 to-orange-600';
      case 'Hard': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'News': return 'bg-blue-500/20 text-blue-400';
      case 'Video': return 'bg-purple-500/20 text-purple-400';
      case 'Social': return 'bg-pink-500/20 text-pink-400';
      case 'Survey': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const totalEarnable = TASKS.reduce((sum, task) => sum + task.points, 0);
  const completedTasks = completed.length;
  const completionPercentage = (completedTasks / TASKS.length) * 100;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center animate-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text-crypto">
              Earn Crypto Tasks
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete tasks and earn real cryptocurrency
            </p>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-strong border-white/10 p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white">{completedTasks}/{TASKS.length}</div>
          <div className="text-sm text-muted-foreground">Tasks Completed</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </Card>

        <Card className="glass-strong border-white/10 p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mx-auto">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white">${(totalEarnable / 10000).toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Total Earnable</div>
        </Card>

        <Card className="glass-strong border-white/10 p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white">{TASKS.filter(t => t.bonus).length}</div>
          <div className="text-sm text-muted-foreground">Bonus Tasks</div>
        </Card>
      </div>

      {/* Task List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-white flex items-center">
          <Zap className="w-6 h-6 mr-3 text-crypto-orange" />
          Available Tasks
        </h2>
        
        <div className="grid gap-6">
          {TASKS.map((task, index) => {
            const isCompleted = completed.includes(task.id) || (user && user.completedTasks > 0);
            
            return (
              <Card 
                key={task.id} 
                className={`interactive-card glass-strong border-white/10 p-6 relative overflow-hidden animate-slide-up ${isCompleted ? 'opacity-75' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Bonus badge */}
                {task.bonus && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BONUS
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  {/* Task Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl glass-strong border border-white/20 flex items-center justify-center text-2xl">
                      {task.icon}
                    </div>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{task.title}</h3>
                        <p className="text-muted-foreground text-sm">{task.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text-crypto">
                          +{(task.points / 10000).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">USD</div>
                      </div>
                    </div>

                    {/* Task Meta */}
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(task.difficulty)} text-white`}>
                        {task.difficulty}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{task.timeRequired}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {isCompleted ? (
                        <Button 
                          disabled 
                          className="w-full bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleComplete(task.id, task.points)}
                          className="interactive-button w-full bg-gradient-to-r from-crypto-orange to-crypto-red text-white border-0 hover:scale-105"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Task
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-crypto-orange/5 animate-float opacity-50" />
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-crypto-red/5 animate-float opacity-30" style={{ animationDelay: '1s' }} />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completion Reward */}
      {completionPercentage === 100 && (
        <Card className="glass-strong border-white/10 p-6 text-center space-y-4 animate-glow">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold gradient-text-crypto">Congratulations!</h3>
          <p className="text-muted-foreground">You've completed all available tasks. Check back soon for more earning opportunities!</p>
          <Button className="interactive-button bg-gradient-to-r from-crypto-orange to-crypto-red text-white">
            <DollarSign className="w-4 h-4 mr-2" />
            Withdraw Earnings
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Tasks;