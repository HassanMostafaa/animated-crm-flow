
import React, { useRef, useEffect } from 'react';
import { Check, Clock, Calendar, MoreVertical } from 'lucide-react';
import { Activity } from '../store/crmStore';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  activity: Activity;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ activity, onComplete, onDelete, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    gsap.fromTo(
      card, 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, delay: index * 0.1, ease: 'power2.out' }
    );
  }, [index]);
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-600" /></div>;
      case 'meeting':
        return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"><Calendar className="h-5 w-5 text-purple-600" /></div>;
      case 'email':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><Check className="h-5 w-5 text-green-600" /></div>;
      case 'task':
        return <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Check className="h-5 w-5 text-amber-600" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Check className="h-5 w-5 text-gray-600" /></div>;
    }
  };
  
  const dueDate = parseISO(activity.dueDate);
  const isOverdue = !activity.completed && new Date() > dueDate;
  
  return (
    <div 
      ref={cardRef}
      className={`p-4 mb-3 rounded-lg border shadow-sm bg-white ${
        activity.completed ? 'border-green-200 bg-green-50' : 
        isOverdue ? 'border-red-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center">
        <div className="mr-3">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${activity.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {activity.title}
          </h3>
          <div className="flex items-center mt-1 text-xs">
            <span className={`mr-2 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              Due {formatDistanceToNow(dueDate, { addSuffix: true })}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs capitalize bg-gray-100 text-gray-800">
              {activity.type}
            </span>
          </div>
          {activity.description && (
            <p className="mt-2 text-sm text-gray-600">{activity.description}</p>
          )}
        </div>
        <div className="ml-4 flex items-center">
          {!activity.completed && (
            <Button 
              variant="ghost" 
              size="sm"
              className="mr-2 text-green-600 hover:text-green-800 hover:bg-green-50"
              onClick={() => onComplete(activity.id)}
            >
              <Check className="h-5 w-5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(activity.id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
