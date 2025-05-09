
import React, { useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import ProgressChart from '@/components/ProgressChart';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import TaskCard from '@/components/TaskCard';
import { useCrmStore } from '@/store/crmStore';
import { BarChart2, Users, DollarSign, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { contacts, deals, activities, stats } = useCrmStore(state => ({
    contacts: state.contacts,
    deals: state.deals,
    activities: state.activities,
    stats: state.stats,
  }));
  
  const completeActivity = useCrmStore(state => state.completeActivity);
  const deleteActivity = useCrmStore(state => state.deleteActivity);
  const { toast } = useToast();
  
  const handleCompleteTask = (id: number) => {
    completeActivity(id);
    toast({
      title: "Task completed",
      description: "The task has been marked as complete.",
    });
  };
  
  const handleDeleteTask = (id: number) => {
    deleteActivity(id);
    toast({
      title: "Task deleted",
      description: "The task has been deleted.",
    });
  };
  
  const upcomingActivities = activities
    .filter(activity => !activity.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  const dealsByStage = {
    initial: deals.filter(d => d.stage === 'initial').length,
    qualified: deals.filter(d => d.stage === 'qualified').length,
    proposal: deals.filter(d => d.stage === 'proposal').length,
    negotiation: deals.filter(d => d.stage === 'negotiation').length,
    'closed-won': deals.filter(d => d.stage === 'closed-won').length,
    'closed-lost': deals.filter(d => d.stage === 'closed-lost').length,
  };
  
  const totalDealCount = Object.values(dealsByStage).reduce((a, b) => a + b, 0);
  
  const contactsByStatus = {
    lead: contacts.filter(c => c.status === 'lead').length,
    prospect: contacts.filter(c => c.status === 'prospect').length,
    customer: contacts.filter(c => c.status === 'customer').length,
  };

  return (
    <div className="space-y-6">
      <AnimatedWrapper>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DashboardCard 
            title="Total Contacts" 
            value={stats.totalContacts} 
            variant="primary" 
            icon={<Users size={20} className="text-crm-blue" />}
            delay={0.1}
          />
          <DashboardCard 
            title="Active Deals" 
            value={stats.totalDeals} 
            variant="success"
            icon={<BarChart2 size={20} className="text-crm-green" />}
            delay={0.2}
          />
          <DashboardCard 
            title="Deal Value" 
            value={`$${stats.dealValue.toLocaleString()}`}
            variant="warning"
            icon={<DollarSign size={20} className="text-crm-orange" />}
            delay={0.3}
          />
          <DashboardCard 
            title="Tasks Completed" 
            value={stats.activitiesCompleted} 
            variant="danger"
            icon={<CheckCircle size={20} className="text-crm-red" />}
            delay={0.4}
          />
        </div>
      </AnimatedWrapper>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedWrapper animation="slideIn" delay={0.3} className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Sales Pipeline</h2>
            <div className="space-y-4">
              <ProgressChart 
                title="Initial Contact" 
                value={dealsByStage.initial} 
                maxValue={totalDealCount || 1}
                color="#4F46E5"
                delay={0.1}
              />
              <ProgressChart 
                title="Qualified Lead" 
                value={dealsByStage.qualified} 
                maxValue={totalDealCount || 1}
                color="#8B5CF6"
                delay={0.2}
              />
              <ProgressChart 
                title="Proposal" 
                value={dealsByStage.proposal} 
                maxValue={totalDealCount || 1}
                color="#EC4899"
                delay={0.3}
              />
              <ProgressChart 
                title="Negotiation" 
                value={dealsByStage.negotiation} 
                maxValue={totalDealCount || 1}
                color="#F59E0B"
                delay={0.4}
              />
              <ProgressChart 
                title="Closed Won" 
                value={dealsByStage["closed-won"]} 
                maxValue={totalDealCount || 1}
                color="#10B981"
                delay={0.5}
              />
            </div>
          </div>
        </AnimatedWrapper>
        
        <AnimatedWrapper animation="fadeIn" delay={0.4}>
          <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h2 className="text-lg font-medium mb-4">Upcoming Tasks</h2>
            <div className="space-y-2">
              {upcomingActivities.length > 0 ? (
                upcomingActivities.map((activity, index) => (
                  <TaskCard 
                    key={activity.id}
                    activity={activity}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    index={index}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm py-4">No upcoming tasks</p>
              )}
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default Dashboard;
