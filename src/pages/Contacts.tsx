
import React, { useState } from 'react';
import { useCrmStore, Contact } from '@/store/crmStore';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { gsap } from 'gsap';
import { Users, Plus, Search, X } from 'lucide-react';
import { usePageTransition } from '@/hooks/usePageTransition';

const Contacts = () => {
  const { contacts } = useCrmStore();
  const addContact = useCrmStore(state => state.addContact);
  const updateContact = useCrmStore(state => state.updateContact);
  const deleteContact = useCrmStore(state => state.deleteContact);
  const { toast } = useToast();
  const { ref } = usePageTransition();
  
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
  });

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(search.toLowerCase()) || 
    contact.email.toLowerCase().includes(search.toLowerCase()) ||
    contact.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and email.",
        variant: "destructive"
      });
      return;
    }

    addContact(newContact as Omit<Contact, 'id'>);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Contact added",
      description: "New contact has been created successfully."
    });
  };

  const handleUpdateContact = () => {
    if (!selectedContact) return;
    
    updateContact(selectedContact.id, selectedContact);
    setSelectedContact(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Contact updated",
      description: "Contact information has been updated."
    });
  };

  const handleDeleteContact = (id: number) => {
    deleteContact(id);
    
    toast({
      title: "Contact deleted",
      description: "The contact has been removed from your list."
    });
  };

  const handleRowClick = (contact: Contact) => {
    setSelectedContact({ ...contact });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: Contact['status']) => {
    switch (status) {
      case 'lead':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Lead</Badge>;
      case 'prospect':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Prospect</Badge>;
      case 'customer':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Customer</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAddNew = () => {
    setSelectedContact(null);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
    });
    setIsDialogOpen(true);
  };

  // Animation for table rows
  const animateTableRows = (rows: HTMLElement[]) => {
    gsap.fromTo(
      rows,
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.05,
        duration: 0.3,
        ease: "power2.out"
      }
    );
  };

  return (
    <div ref={ref} className="space-y-6">
      <AnimatedWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600">Manage your contacts and leads</p>
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus size={16} />
            Add Contact
          </Button>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search contacts..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              {search && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearch('')}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          
          {filteredContacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow 
                    key={contact.id}
                    onClick={() => handleRowClick(contact)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {contact.avatar ? (
                          <img 
                            src={contact.avatar} 
                            alt={contact.name} 
                            className="w-8 h-8 rounded-full mr-3" 
                          />
                        ) : (
                          <div className="w-8 h-8 bg-crm-blue text-white rounded-full flex items-center justify-center mr-3">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Users className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No contacts found</h3>
              <p className="text-gray-500 mb-4">
                {search 
                  ? "No contacts match your search criteria." 
                  : "Get started by adding your first contact."
                }
              </p>
              {!search && (
                <Button onClick={handleAddNew}>
                  <Plus size={16} className="mr-2" />
                  Add Contact
                </Button>
              )}
            </div>
          )}
        </div>
      </AnimatedWrapper>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedContact ? 'Edit Contact' : 'Add New Contact'}
            </DialogTitle>
            <DialogDescription>
              {selectedContact 
                ? 'Update the contact information below.' 
                : 'Fill out the form below to add a new contact.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input 
                  id="name" 
                  value={selectedContact ? selectedContact.name : newContact.name}
                  onChange={(e) => selectedContact 
                    ? setSelectedContact({...selectedContact, name: e.target.value})
                    : setNewContact({...newContact, name: e.target.value})
                  }
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email"
                  value={selectedContact ? selectedContact.email : newContact.email}
                  onChange={(e) => selectedContact 
                    ? setSelectedContact({...selectedContact, email: e.target.value})
                    : setNewContact({...newContact, email: e.target.value})
                  }
                  placeholder="Enter email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">Company</label>
                <Input 
                  id="company" 
                  value={selectedContact ? selectedContact.company : newContact.company}
                  onChange={(e) => selectedContact 
                    ? setSelectedContact({...selectedContact, company: e.target.value})
                    : setNewContact({...newContact, company: e.target.value})
                  }
                  placeholder="Enter company"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input 
                  id="phone" 
                  value={selectedContact ? selectedContact.phone : newContact.phone}
                  onChange={(e) => selectedContact 
                    ? setSelectedContact({...selectedContact, phone: e.target.value})
                    : setNewContact({...newContact, phone: e.target.value})
                  }
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select
                value={selectedContact ? selectedContact.status : newContact.status}
                onValueChange={(value: 'lead' | 'customer' | 'prospect') => selectedContact 
                  ? setSelectedContact({...selectedContact, status: value})
                  : setNewContact({...newContact, status: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2 justify-between sm:justify-between">
            {selectedContact && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => {
                  handleDeleteContact(selectedContact.id);
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
                onClick={selectedContact ? handleUpdateContact : handleAddContact}
              >
                {selectedContact ? 'Update' : 'Add'} Contact
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
