
import React, { useEffect, useRef } from 'react';
import { useCrmStore } from '@/store/crmStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { gsap } from 'gsap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { usePageTransition } from '@/hooks/usePageTransition';

const COLORS = ['#4F46E5', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

const Reports = () => {
  const { deals, contacts, activities } = useCrmStore();
  const { ref } = usePageTransition();
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Prepare data for charts
  const dealsByStage = [
    { name: 'Initial', value: deals.filter(d => d.stage === 'initial').length },
    { name: 'Qualified', value: deals.filter(d => d.stage === 'qualified').length },
    { name: 'Proposal', value: deals.filter(d => d.stage === 'proposal').length },
    { name: 'Negotiation', value: deals.filter(d => d.stage === 'negotiation').length },
    { name: 'Closed Won', value: deals.filter(d => d.stage === 'closed-won').length },
    { name: 'Closed Lost', value: deals.filter(d => d.stage === 'closed-lost').length },
  ];
  
  const dealValueByStage = [
    { 
      name: 'Initial', 
      value: deals.filter(d => d.stage === 'initial')
        .reduce((sum, deal) => sum + deal.value, 0) 
    },
    { 
      name: 'Qualified', 
      value: deals.filter(d => d.stage === 'qualified')
        .reduce((sum, deal) => sum + deal.value, 0) 
    },
    { 
      name: 'Proposal', 
      value: deals.filter(d => d.stage === 'proposal')
        .reduce((sum, deal) => sum + deal.value, 0) 
    },
    { 
      name: 'Negotiation', 
      value: deals.filter(d => d.stage === 'negotiation')
        .reduce((sum, deal) => sum + deal.value, 0) 
    },
    { 
      name: 'Closed Won', 
      value: deals.filter(d => d.stage === 'closed-won')
        .reduce((sum, deal) => sum + deal.value, 0) 
    },
    { 
      name: 'Closed Lost', 
      value: deals.filter(d => d.stage === 'closed-lost')
        .reduce((sum, deal) => sum + deal.value, 0) 
    },
  ];
  
  const contactsByStatus = [
    { name: 'Lead', value: contacts.filter(c => c.status === 'lead').length },
    { name: 'Prospect', value: contacts.filter(c => c.status === 'prospect').length },
    { name: 'Customer', value: contacts.filter(c => c.status === 'customer').length },
  ];
  
  const activitiesByType = [
    { name: 'Call', value: activities.filter(a => a.type === 'call').length },
    { name: 'Meeting', value: activities.filter(a => a.type === 'meeting').length },
    { name: 'Email', value: activities.filter(a => a.type === 'email').length },
    { name: 'Task', value: activities.filter(a => a.type === 'task').length },
  ];
  
  const activitiesByCompletion = [
    { name: 'Completed', value: activities.filter(a => a.completed).length },
    { name: 'Pending', value: activities.filter(a => !a.completed).length },
  ];

  useEffect(() => {
    // Animate charts
    chartRefs.current.forEach((chart, index) => {
      if (chart) {
        gsap.fromTo(
          chart,
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            delay: 0.2 + (index * 0.1),
            ease: "power2.out" 
          }
        );
      }
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div ref={ref} className="space-y-6">
      <AnimatedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your CRM data and performance</p>
        </div>
      </AnimatedWrapper>
      
      <Tabs defaultValue="deals" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card ref={el => (chartRefs.current[0] = el)}>
              <CardHeader>
                <CardTitle>Deals by Stage</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dealsByStage}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4F46E5" name="Number of Deals" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card ref={el => (chartRefs.current[1] = el)}>
              <CardHeader>
                <CardTitle>Deal Value by Stage</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dealValueByStage}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="value" fill="#8B5CF6" name="Deal Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card ref={el => (chartRefs.current[2] = el)}>
            <CardHeader>
              <CardTitle>Deal Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dealsByStage.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dealsByStage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Number of Deals']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card ref={el => (chartRefs.current[3] = el)}>
              <CardHeader>
                <CardTitle>Contacts by Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={contactsByStatus}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#10B981" name="Number of Contacts" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card ref={el => (chartRefs.current[4] = el)}>
              <CardHeader>
                <CardTitle>Contact Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contactsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {contactsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Number of Contacts']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card ref={el => (chartRefs.current[5] = el)}>
              <CardHeader>
                <CardTitle>Activities by Type</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activitiesByType}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#F59E0B" name="Number of Activities" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card ref={el => (chartRefs.current[6] = el)}>
              <CardHeader>
                <CardTitle>Activity Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activitiesByCompletion}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Activities']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
