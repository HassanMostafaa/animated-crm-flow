
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'customer' | 'prospect';
  lastActivity?: string;
  avatar?: string;
};

export type Deal = {
  id: number;
  title: string;
  value: number;
  contactId: number;
  stage: 'initial' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  createdAt: string;
  closingDate?: string;
};

export type Activity = {
  id: number;
  type: 'call' | 'meeting' | 'email' | 'task';
  title: string;
  description?: string;
  contactId?: number;
  dealId?: number;
  dueDate: string;
  completed: boolean;
};

type CrmState = {
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  stats: {
    totalDeals: number;
    totalContacts: number;
    dealValue: number;
    activitiesCompleted: number;
  };
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: number, contact: Partial<Contact>) => void;
  deleteContact: (id: number) => void;
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  updateDeal: (id: number, deal: Partial<Deal>) => void;
  deleteDeal: (id: number) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: number, activity: Partial<Activity>) => void;
  completeActivity: (id: number) => void;
  deleteActivity: (id: number) => void;
  fetchInitialData: () => Promise<void>;
};

// Sample data
const initialContacts: Contact[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Inc',
    status: 'customer',
    lastActivity: '2025-04-28T10:30:00Z',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    company: 'Tech Solutions',
    status: 'lead',
    lastActivity: '2025-05-01T14:15:00Z',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '(555) 234-5678',
    company: 'Johnson & Co',
    status: 'prospect',
    lastActivity: '2025-04-25T09:00:00Z',
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '(555) 876-5432',
    company: 'Davis Enterprises',
    status: 'customer',
    lastActivity: '2025-05-03T11:45:00Z',
    avatar: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael@example.com',
    phone: '(555) 345-6789',
    company: 'Wilson Group',
    status: 'lead',
    lastActivity: '2025-05-02T16:30:00Z',
    avatar: 'https://i.pravatar.cc/150?u=5',
  }
];

const initialDeals: Deal[] = [
  {
    id: 1,
    title: 'Annual Software License',
    value: 25000,
    contactId: 1,
    stage: 'closed-won',
    createdAt: '2025-03-15T08:00:00Z',
    closingDate: '2025-04-20T16:00:00Z',
  },
  {
    id: 2,
    title: 'Consulting Services',
    value: 15000,
    contactId: 2,
    stage: 'proposal',
    createdAt: '2025-04-10T09:30:00Z',
    closingDate: '2025-05-25T14:00:00Z',
  },
  {
    id: 3,
    title: 'Hardware Upgrade',
    value: 42000,
    contactId: 3,
    stage: 'negotiation',
    createdAt: '2025-04-05T10:15:00Z',
  },
  {
    id: 4,
    title: 'Support Contract',
    value: 8000,
    contactId: 4,
    stage: 'qualified',
    createdAt: '2025-04-22T13:45:00Z',
  },
  {
    id: 5,
    title: 'SaaS Implementation',
    value: 36000,
    contactId: 5,
    stage: 'initial',
    createdAt: '2025-05-01T11:00:00Z',
  }
];

const initialActivities: Activity[] = [
  {
    id: 1,
    type: 'call',
    title: 'Follow-up call',
    description: 'Discuss project requirements',
    contactId: 2,
    dealId: 2,
    dueDate: '2025-05-10T10:00:00Z',
    completed: false,
  },
  {
    id: 2,
    type: 'meeting',
    title: 'Proposal presentation',
    contactId: 3,
    dealId: 3,
    dueDate: '2025-05-12T14:30:00Z',
    completed: false,
  },
  {
    id: 3,
    type: 'email',
    title: 'Send contract draft',
    contactId: 4,
    dealId: 4,
    dueDate: '2025-05-08T15:00:00Z',
    completed: true,
  },
  {
    id: 4,
    type: 'task',
    title: 'Prepare demo environment',
    description: 'Set up sandbox for client demo',
    dealId: 5,
    dueDate: '2025-05-15T09:00:00Z',
    completed: false,
  },
  {
    id: 5,
    type: 'call',
    title: 'Quarterly review',
    contactId: 1,
    dueDate: '2025-05-20T11:30:00Z',
    completed: false,
  }
];

export const useCrmStore = create<CrmState>()(
  devtools(
    persist(
      (set, get) => ({
        contacts: [],
        deals: [],
        activities: [],
        stats: {
          totalDeals: 0,
          totalContacts: 0,
          dealValue: 0,
          activitiesCompleted: 0,
        },
        addContact: (contact) => {
          const newContact = { ...contact, id: Date.now() };
          set((state) => ({
            contacts: [...state.contacts, newContact],
            stats: {
              ...state.stats,
              totalContacts: state.stats.totalContacts + 1,
            },
          }));
        },
        updateContact: (id, contact) => {
          set((state) => ({
            contacts: state.contacts.map((c) =>
              c.id === id ? { ...c, ...contact } : c
            ),
          }));
        },
        deleteContact: (id) => {
          set((state) => ({
            contacts: state.contacts.filter((c) => c.id !== id),
            stats: {
              ...state.stats,
              totalContacts: state.stats.totalContacts - 1,
            },
          }));
        },
        addDeal: (deal) => {
          const newDeal = { ...deal, id: Date.now() };
          set((state) => {
            const updatedDeals = [...state.deals, newDeal];
            return {
              deals: updatedDeals,
              stats: {
                ...state.stats,
                totalDeals: state.stats.totalDeals + 1,
                dealValue: state.stats.dealValue + deal.value,
              },
            };
          });
        },
        updateDeal: (id, deal) => {
          set((state) => {
            const oldDeal = state.deals.find((d) => d.id === id);
            const valueDiff = oldDeal && deal.value !== undefined ? deal.value - oldDeal.value : 0;
            
            return {
              deals: state.deals.map((d) => (d.id === id ? { ...d, ...deal } : d)),
              stats: {
                ...state.stats,
                dealValue: state.stats.dealValue + valueDiff,
              },
            };
          });
        },
        deleteDeal: (id) => {
          set((state) => {
            const dealToDelete = state.deals.find((d) => d.id === id);
            const dealValue = dealToDelete?.value || 0;
            
            return {
              deals: state.deals.filter((d) => d.id !== id),
              stats: {
                ...state.stats,
                totalDeals: state.stats.totalDeals - 1,
                dealValue: state.stats.dealValue - dealValue,
              },
            };
          });
        },
        addActivity: (activity) => {
          const newActivity = { ...activity, id: Date.now() };
          set((state) => ({
            activities: [...state.activities, newActivity],
          }));
        },
        updateActivity: (id, activity) => {
          set((state) => ({
            activities: state.activities.map((a) =>
              a.id === id ? { ...a, ...activity } : a
            ),
          }));
        },
        completeActivity: (id) => {
          set((state) => {
            const wasCompletedBefore = state.activities.find((a) => a.id === id)?.completed;
            
            return {
              activities: state.activities.map((a) =>
                a.id === id ? { ...a, completed: true } : a
              ),
              stats: {
                ...state.stats,
                activitiesCompleted: wasCompletedBefore 
                  ? state.stats.activitiesCompleted 
                  : state.stats.activitiesCompleted + 1,
              },
            };
          });
        },
        deleteActivity: (id) => {
          set((state) => {
            const activityToDelete = state.activities.find((a) => a.id === id);
            const wasCompleted = activityToDelete?.completed || false;
            
            return {
              activities: state.activities.filter((a) => a.id !== id),
              stats: {
                ...state.stats,
                activitiesCompleted: wasCompleted 
                  ? state.stats.activitiesCompleted - 1 
                  : state.stats.activitiesCompleted,
              },
            };
          });
        },
        fetchInitialData: async () => {
          try {
            // In a real app, this would fetch from an API
            // For now, we'll use our static data and simulate a fetch
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set({
              contacts: initialContacts,
              deals: initialDeals,
              activities: initialActivities,
              stats: {
                totalContacts: initialContacts.length,
                totalDeals: initialDeals.length,
                dealValue: initialDeals.reduce((sum, deal) => sum + deal.value, 0),
                activitiesCompleted: initialActivities.filter(a => a.completed).length,
              },
            });
          } catch (error) {
            console.error("Failed to fetch initial data:", error);
          }
        },
      }),
      {
        name: 'crm-storage',
      }
    )
  )
);
