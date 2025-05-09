
import React, { useState, useRef, useEffect } from 'react';
import { useCrmStore, Deal, Contact } from '@/store/crmStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { format, parseISO } from 'date-fns';
import { gsap } from 'gsap';
import { Plus, DollarSign } from 'lucide-react';
import { usePageTransition } from '@/hooks/usePageTransition';

const stageLabels: Record<Deal['stage'], string> = {
  'initial': 'Initial Contact',
  'qualified': 'Qualified',
  'proposal': 'Proposal',
  'negotiation': 'Negotiation',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost',
};

const stageColors: Record<Deal['stage'], string> = {
  'initial': 'bg-blue-50 border-blue-200 text-blue-700',
  'qualified': 'bg-purple-50 border-purple-200 text-purple-700',
  'proposal': 'bg-pink-50 border-pink-200 text-pink-700',
  'negotiation': 'bg-amber-50 border-amber-200 text-amber-700',
  'closed-won': 'bg-green-50 border-green-200 text-green-700',
  'closed-lost': 'bg-red-50 border-red-200 text-red-700',
};

const Deals = () => {
  const { deals, contacts } = useCrmStore();
  const addDeal = useCrmStore(state => state.addDeal);
  const updateDeal = useCrmStore(state => state.updateDeal);
  const deleteDeal = useCrmStore(state => state.deleteDeal);
  const { toast } = useToast();
  const { ref } = usePageTransition();
  
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dealCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [newDeal, setNewDeal] = useState<Omit<Deal, 'id'>>({
    title: '',
    value: 0,
    contactId: contacts.length > 0 ? contacts[0].id : 0,
    stage: 'initial',
    createdAt: new Date().toISOString(),
  });

  // Group deals by stage
  const dealsByStage = deals.reduce((acc, deal) => {
    if (!acc[deal.stage]) {
      acc[deal.stage] = [];
    }
    acc[deal.stage].push(deal);
    return acc;
  }, {} as Record<Deal['stage'], Deal[]>);

  useEffect(() => {
    // Animate the stage columns
    Object.keys(stageRefs.current).forEach((stage, index) => {
      const stageEl = stageRefs.current[stage];
      if (stageEl) {
        gsap.fromTo(
          stageEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: index * 0.1, ease: "power2.out" }
        );
      }
    });
  }, [deals]);

  const handleAddDeal = () => {
    if (!newDeal.title || newDeal.value <= 0) {
      toast({
        title: "Missing information",
        description: "Please provide a title and value.",
        variant: "destructive"
      });
      return;
    }

    addDeal(newDeal);
    setNewDeal({
      title: '',
      value: 0,
      contactId: contacts.length > 0 ? contacts[0].id : 0,
      stage: 'initial',
      createdAt: new Date().toISOString(),
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Deal added",
      description: "New deal has been created successfully."
    });
  };

  const handleUpdateDeal = () => {
    if (!selectedDeal) return;
    
    updateDeal(selectedDeal.id, selectedDeal);
    setSelectedDeal(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Deal updated",
      description: "Deal information has been updated."
    });
  };

  const handleDeleteDeal = (id: number) => {
    deleteDeal(id);
    
    toast({
      title: "Deal deleted",
      description: "The deal has been removed."
    });
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal({ ...deal });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDeal(null);
    setNewDeal({
      title: '',
      value: 0,
      contactId: contacts.length > 0 ? contacts[0].id : 0,
      stage: 'initial',
      createdAt: new Date().toISOString(),
    });
    setIsDialogOpen(true);
  };

  const getContactName = (contactId: number) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown';
  };

  // Animate deal cards when they're added to the DOM
  const animateDealCard = (dealId: string) => {
    const cardRef = dealCardRefs.current[dealId];
    if (cardRef) {
      gsap.fromTo(
        cardRef,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.4)" }
      );
    }
  };

  return (
    <div ref={ref} className="space-y-6">
      <AnimatedWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
            <p className="text-gray-600">Manage your sales pipeline</p>
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus size={16} />
            Add Deal
          </Button>
        </div>
      </AnimatedWrapper>
      
      <div className="overflow-x-auto pb-6">
        <div className="grid grid-cols-6 min-w-[1000px] gap-4">
          {Object.entries(stageLabels).map(([stage, label], index) => (
            <div 
              key={stage}
              ref={el => (stageRefs.current[stage] = el)}
              className="space-y-4"
            >
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${stageColors[stage as Deal['stage']]}`}>
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  <span className="bg-white bg-opacity-50 text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {dealsByStage[stage as Deal['stage']]?.length || 0}
                  </span>
                </div>
              </div>
              
              {dealsByStage[stage as Deal['stage']]?.map((deal) => (
                <div
                  key={deal.id}
                  ref={el => {
                    dealCardRefs.current[`${deal.id}`] = el;
                    if (el) animateDealCard(`${deal.id}`);
                  }}
                  onClick={() => handleDealClick(deal)}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{deal.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    {deal.value.toLocaleString('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      minimumFractionDigits: 0
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>{getContactName(deal.contactId)}</p>
                    {deal.createdAt && (
                      <p>Created: {format(parseISO(deal.createdAt), 'MMM d, yyyy')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDeal ? 'Edit Deal' : 'Add New Deal'}
            </DialogTitle>
            <DialogDescription>
              {selectedDeal 
                ? 'Update the deal information below.' 
                : 'Fill out the form below to add a new deal.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                value={selectedDeal ? selectedDeal.title : newDeal.title}
                onChange={(e) => selectedDeal 
                  ? setSelectedDeal({...selectedDeal, title: e.target.value})
                  : setNewDeal({...newDeal, title: e.target.value})
                }
                placeholder="Enter deal title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="value" className="text-sm font-medium">Value ($)</label>
              <Input 
                id="value" 
                type="number"
                value={selectedDeal ? selectedDeal.value : newDeal.value}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  selectedDeal 
                    ? setSelectedDeal({...selectedDeal, value})
                    : setNewDeal({...newDeal, value});
                }}
                placeholder="Enter deal value"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactId" className="text-sm font-medium">Contact</label>
              <Select
                value={String(selectedDeal ? selectedDeal.contactId : newDeal.contactId)}
                onValueChange={(value) => {
                  const contactId = parseInt(value);
                  selectedDeal 
                    ? setSelectedDeal({...selectedDeal, contactId})
                    : setNewDeal({...newDeal, contactId});
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={String(contact.id)}>
                      {contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="stage" className="text-sm font-medium">Stage</label>
              <Select
                value={selectedDeal ? selectedDeal.stage : newDeal.stage}
                onValueChange={(value: Deal['stage']) => {
                  selectedDeal 
                    ? setSelectedDeal({...selectedDeal, stage: value})
                    : setNewDeal({...newDeal, stage: value});
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stageLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedDeal && selectedDeal.closingDate && (
              <div className="space-y-2">
                <label htmlFor="closingDate" className="text-sm font-medium">Closing Date</label>
                <Input 
                  id="closingDate"
                  type="date"
                  value={format(parseISO(selectedDeal.closingDate), 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDeal({
                    ...selectedDeal, 
                    closingDate: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
            )}
          </div>
          
          <DialogFooter className="flex space-x-2 justify-between sm:justify-between">
            {selectedDeal && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => {
                  handleDeleteDeal(selectedDeal.id);
                  setIsDialogOpen(false);
                }}
              >
                Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={selectedDeal ? handleUpdateDeal : handleAddDeal}
              >
                {selectedDeal ? 'Update' : 'Add'} Deal
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deals;
