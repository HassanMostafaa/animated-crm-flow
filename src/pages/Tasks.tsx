
import React, { useState } from 'react';
import { useCrmStore, Activity, Deal, Contact } from '@/store/crmStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import TaskCard from '@/components/TaskCard';
import { gsap } from 'gsap';
import { Plus, ListFilter } from 'lucide-react';
import { usePageTransition } from '@/hooks/usePageTransition';

const Tasks = () => {
  const { activities, deals, contacts } = useCrmStore();
  const addActivity = useCrmStore(state => state.addActivity);
  const completeActivity = useCrmStore(state => state.completeActivity);
  const deleteActivity = useCrmStore(state => state.deleteActivity);
  const { toast } = useToast();
  const { ref } = usePageTransition();
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    type: 'task',
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0] + 'T12:00:00Z',
    completed: false,
  });

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !activity.completed;
    if (filter === 'completed') return activity.completed;
    return true;
  }).sort((a, b) => {
    // Sort by due date, with pending tasks first
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const handleAddActivity = () => {
    if (!newActivity.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for the task.",
        variant: "destructive"
      });
      return;
    }

    addActivity(newActivity);
    setNewActivity({
      type: 'task',
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0] + 'T12:00:00Z',
      completed: false,
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Task added",
      description: "New task has been created successfully."
    });
  };

  const handleCompleteActivity = (id: number) => {
    completeActivity(id);
    
    toast({
      title: "Task completed",
      description: "The task has been marked as complete."
    });
  };

  const handleDeleteActivity = (id: number) => {
    deleteActivity(id);
    
    toast({
      title: "Task deleted",
      description: "The task has been removed."
    });
  };

  const getContactName = (contactId?: number) => {
    if (!contactId) return '';
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : '';
  };

  const getDealName = (dealId?: number) => {
    if (!dealId) return '';
    const deal = deals.find(d => d.id === dealId);
    return deal ? deal.title : '';
  };

  return (
    <div ref={ref} className="space-y-6">
      <AnimatedWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600">Manage your activities and tasks</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Task
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-gray-500" />
            <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'completed') => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredActivities.filter(a => !a.completed).length} task(s) pending
          </div>
        </div>
      </AnimatedWrapper>
      
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <TaskCard 
              key={activity.id}
              activity={activity}
              onComplete={handleCompleteActivity}
              onDelete={handleDeleteActivity}
              index={index}
            />
          ))
        ) : (
          <AnimatedWrapper>
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ListFilter className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
              <p className="text-gray-500 mb-4">
                {filter !== 'all' 
                  ? `No ${filter} tasks found.` 
                  : "Get started by adding your first task."
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Add Task
              </Button>
            </div>
          </AnimatedWrapper>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task or activity to track.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                value={newActivity.title}
                onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Type</label>
              <Select
                value={newActivity.type}
                onValueChange={(value: Activity['type']) => {
                  setNewActivity({...newActivity, type: value});
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
              <Textarea 
                id="description" 
                value={newActivity.description || ''}
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                placeholder="Enter task details"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                <Input 
                  id="dueDate"
                  type="datetime-local"
                  value={newActivity.dueDate.substring(0, 16)}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setNewActivity({
                      ...newActivity, 
                      dueDate: date.toISOString()
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="contactId" className="text-sm font-medium">Related Contact (optional)</label>
                <Select
                  value={newActivity.contactId ? String(newActivity.contactId) : ""}
                  onValueChange={(value) => {
                    const contactId = value ? parseInt(value) : undefined;
                    setNewActivity({...newActivity, contactId});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {contacts.map(contact => (
                      <SelectItem key={contact.id} value={String(contact.id)}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dealId" className="text-sm font-medium">Related Deal (optional)</label>
                <Select
                  value={newActivity.dealId ? String(newActivity.dealId) : ""}
                  onValueChange={(value) => {
                    const dealId = value ? parseInt(value) : undefined;
                    setNewActivity({...newActivity, dealId});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a deal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {deals.map(deal => (
                      <SelectItem key={deal.id} value={String(deal.id)}>
                        {deal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleAddActivity}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
