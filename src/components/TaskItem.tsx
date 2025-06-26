import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface TaskItemProps {
  title: string;
  description: string;
  points: number;
  onComplete: () => void;
  completed: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, description, points, onComplete, completed }) => {
  const [anim, setAnim] = useState(false);

  const handleClick = () => {
    setAnim(true);
    setTimeout(() => {
      setAnim(false);
      onComplete();
    }, 500);
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-5 flex items-center gap-4 shadow-md transition-all ${anim ? 'ring-4 ring-green-400' : ''}`}>
      <div className="flex-1">
        <div className="text-lg font-semibold text-white mb-1">{title}</div>
        <div className="text-gray-400 text-sm mb-2">{description}</div>
        <div className="text-green-400 font-bold">+{points.toLocaleString()} pts</div>
      </div>
      {completed ? (
        <span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle className="w-5 h-5" /> Completed</span>
      ) : (
        <Button onClick={handleClick} className="bg-green-500 hover:bg-green-600 text-white font-bold">Complete</Button>
      )}
    </div>
  );
};

export default TaskItem;
