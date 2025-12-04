import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Tag, Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  getCustomer,
  getCustomerInteractions,
  getCustomerPurchaseHistory,
  deleteCustomer,
  Customer,
  CustomerInteraction
} from '@/lib/api/customer-api';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerInteractionDialog } from '@/components/crm/CustomerInteractionDialog';
import { EditCustomerDialog } from '@/components/crm/EditCustomerDialog';
import { CustomerTagsManager } from '@/components/crm/CustomerTagsManager';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<CustomerInteraction[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInteractionDialog, setShowInteractionDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    if (customerId) {
      loadCustomerData();
    }
  }, [customerId]);

  const loadCustomerData = async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      const [customerData, interactionsData, purchasesData] = await Promise.all([
        getCustomer(customerId),
        getCustomerInteractions(customerId),
        getCustomerPurchaseHistory(customerId)
      ]);

      setCustomer(customerData);
      setInteractions(interactionsData);
      setPurchaseHistory(purchasesData);
    } catch (error) {
      console.error('Error loading customer data:', error);
      toast.error('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerId) return;

    try {
      await deleteCustomer(customerId);
      toast.success('Customer deleted successfully');
      navigate('/customers');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      lead: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      inactive: 'bg-white/10 text-white/60 border-white/20',
      vip: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return variants[status] || variants.active;
  };

  const getInteractionIcon = (type: string) => {
    const icons: Record<string, any> = {
      call: Phone,
      email: Mail,
      meeting: Calendar,
      note: MessageSquare,
      purchase: DollarSign,
      support: MessageSquare,
      other: MessageSquare
    };
    const Icon = icons[type] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="container mx-auto p-6 space-y-6 relative z-10">
          <Skeleton className="h-12 w-64 bg-white/10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-1 bg-white/10" />
            <Skeleton className="h-96 lg:col-span-2 bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="container mx-auto p-6 relative z-10">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-center text-blue-200">Customer not found</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/customers')} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900">
                Back to Customers
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initials = `${customer.first_name[0]}${customer.last_name[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/customers')} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {customer.first_name} {customer.last_name}
              </h1>
              <p className="text-blue-200">{customer.company || 'Individual Customer'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(true)} className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-800 border-white/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-blue-200">
                    This will permanently delete this customer and all associated data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/5 border-white/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-500 text-white hover:bg-red-600">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Customer Info */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Customer Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4 bg-yellow-500/20 border-2 border-yellow-500/30">
                    <AvatarFallback className="text-2xl text-yellow-400 bg-transparent">{initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-center text-white">
                    {customer.first_name} {customer.last_name}
                  </h3>
                  {customer.job_title && (
                    <p className="text-sm text-blue-200">{customer.job_title}</p>
                  )}
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-200">Status</span>
                    <Badge className={getStatusBadge(customer.customer_status)}>
                      {customer.customer_status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-200">Stage</span>
                    <Badge className="bg-white/10 text-white/80 border-white/20 capitalize">
                      {customer.lifecycle_stage}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <a href={`mailto:${customer.email}`} className="text-yellow-400 hover:text-yellow-300">
                        {customer.email}
                      </a>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-blue-400" />
                      <a href={`tel:${customer.phone}`} className="text-yellow-400 hover:text-yellow-300">
                        {customer.phone}
                      </a>
                    </div>
                  )}
                  {customer.address && (
                    <div className="text-sm">
                      <p className="font-medium mb-1 text-white">Address</p>
                      <p className="text-blue-200">
                        {customer.address}
                        {customer.city && `, ${customer.city}`}
                        {customer.state && `, ${customer.state}`}
                        {customer.zip_code && ` ${customer.zip_code}`}
                      </p>
                    </div>
                  )}
                </div>

                <Separator className="bg-white/10" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-200">Lifetime Value</p>
                    <p className="text-2xl font-bold text-white">${customer.lifetime_value.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Total Purchases</p>
                    <p className="text-2xl font-bold text-white">{customer.total_purchases}</p>
                  </div>
                </div>

                {customer.last_purchase_date && (
                  <div>
                    <p className="text-sm text-blue-200">Last Purchase</p>
                    <p className="text-sm font-medium text-white">
                      {format(new Date(customer.last_purchase_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}

                {customer.next_followup_date && (
                  <div>
                    <p className="text-sm text-blue-200">Next Follow-up</p>
                    <p className="text-sm font-medium text-white">
                      {format(new Date(customer.next_followup_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tag className="h-4 w-4 text-yellow-400" />
                  Tags
                </h2>
              </div>
              <div className="p-6">
                <CustomerTagsManager customer={customer} onUpdate={loadCustomerData} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowInteractionDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2 text-yellow-400" />
                  Log Interaction
                </Button>
                {customer.email && (
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                    onClick={() => window.location.href = `mailto:${customer.email}`}
                  >
                    <Mail className="h-4 w-4 mr-2 text-blue-400" />
                    Send Email
                  </Button>
                )}
                {customer.phone && (
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                    onClick={() => window.location.href = `tel:${customer.phone}`}
                  >
                    <Phone className="h-4 w-4 mr-2 text-green-400" />
                    Call Customer
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                  onClick={() => navigate(`/invoices/new?customerId=${customer.id}`)}
                >
                  <DollarSign className="h-4 w-4 mr-2 text-yellow-400" />
                  Create Invoice
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="interactions" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                <TabsTrigger value="interactions" className="data-[state=active]:bg-white/10 text-white">Interactions</TabsTrigger>
                <TabsTrigger value="purchases" className="data-[state=active]:bg-white/10 text-white">Purchase History</TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-white/10 text-white">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="interactions" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Interaction History</h3>
                  <Button onClick={() => setShowInteractionDialog(true)} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Interaction
                  </Button>
                </div>

                <div className="space-y-4">
                  {interactions.length === 0 ? (
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                      <p className="text-center text-blue-200">
                        No interactions recorded yet. Log your first interaction!
                      </p>
                    </div>
                  ) : (
                    interactions.map((interaction) => (
                      <div key={interaction.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30 text-yellow-400">
                            {getInteractionIcon(interaction.interaction_type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-white">{interaction.subject}</h4>
                                <p className="text-sm text-blue-200 capitalize">
                                  {interaction.interaction_type} •{' '}
                                  {format(new Date(interaction.interaction_date), 'MMM d, yyyy h:mm a')}
                                </p>
                              </div>
                              {interaction.followup_required && (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Follow-up Required</Badge>
                              )}
                            </div>
                            {interaction.description && (
                              <p className="text-sm mb-2 text-blue-100">{interaction.description}</p>
                            )}
                            {interaction.outcome && (
                              <p className="text-sm text-blue-200">
                                <span className="font-medium text-white">Outcome:</span> {interaction.outcome}
                              </p>
                            )}
                            {interaction.followup_date && (
                              <p className="text-sm text-blue-200 mt-2">
                                <span className="font-medium text-white">Follow-up:</span>{' '}
                                {format(new Date(interaction.followup_date), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="purchases" className="space-y-4 mt-4">
                <h3 className="text-lg font-semibold text-white">Purchase History</h3>
                
                <div className="space-y-4">
                  {purchaseHistory.length === 0 ? (
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                      <p className="text-center text-blue-200">
                        No purchase history available.
                      </p>
                    </div>
                  ) : (
                    purchaseHistory.map((invoice: any) => (
                      <div 
                        key={invoice.id}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">Invoice #{invoice.invoice_number}</p>
                            <p className="text-sm text-blue-200">
                              {format(new Date(invoice.invoice_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">${invoice.total_amount.toFixed(2)}</p>
                            <Badge className={
                              invoice.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              invoice.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-red-500/20 text-red-400 border-red-500/30'
                            }>
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <h3 className="text-lg font-semibold text-white">Customer Notes</h3>
                
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  {customer.notes ? (
                    <p className="text-sm whitespace-pre-wrap text-blue-100">{customer.notes}</p>
                  ) : (
                    <p className="text-sm text-blue-200 text-center">
                      No notes added yet. Click Edit to add notes.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Dialogs */}
        {showInteractionDialog && (
          <CustomerInteractionDialog
            customer={customer}
            onClose={() => setShowInteractionDialog(false)}
            onSuccess={() => {
              loadCustomerData();
              setShowInteractionDialog(false);
            }}
          />
        )}

        {showEditDialog && (
          <EditCustomerDialog
            customer={customer}
            onClose={() => setShowEditDialog(false)}
            onSuccess={() => {
              loadCustomerData();
              setShowEditDialog(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
