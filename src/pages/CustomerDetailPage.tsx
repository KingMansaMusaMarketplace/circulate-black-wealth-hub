import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, Tag, Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      lead: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      vip: 'bg-purple-100 text-purple-800'
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
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-1" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Customer not found</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/customers')}>Back to Customers</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = `${customer.first_name[0]}${customer.last_name[0]}`.toUpperCase();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-muted-foreground">{customer.company || 'Individual Customer'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this customer and all associated data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCustomer}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Customer Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-center">
                  {customer.first_name} {customer.last_name}
                </h3>
                {customer.job_title && (
                  <p className="text-sm text-muted-foreground">{customer.job_title}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getStatusBadge(customer.customer_status)}>
                    {customer.customer_status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stage</span>
                  <Badge variant="outline" className="capitalize">
                    {customer.lifecycle_stage}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                      {customer.email}
                    </a>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                )}
                {customer.address && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">Address</p>
                    <p className="text-muted-foreground">
                      {customer.address}
                      {customer.city && `, ${customer.city}`}
                      {customer.state && `, ${customer.state}`}
                      {customer.zip_code && ` ${customer.zip_code}`}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Lifetime Value</p>
                  <p className="text-2xl font-bold">${customer.lifetime_value.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Purchases</p>
                  <p className="text-2xl font-bold">{customer.total_purchases}</p>
                </div>
              </div>

              {customer.last_purchase_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Purchase</p>
                  <p className="text-sm font-medium">
                    {format(new Date(customer.last_purchase_date), 'MMM d, yyyy')}
                  </p>
                </div>
              )}

              {customer.next_followup_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Next Follow-up</p>
                  <p className="text-sm font-medium">
                    {format(new Date(customer.next_followup_date), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerTagsManager customer={customer} onUpdate={loadCustomerData} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowInteractionDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Interaction
              </Button>
              {customer.email && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = `mailto:${customer.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              )}
              {customer.phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = `tel:${customer.phone}`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/invoices/new?customerId=${customer.id}`)}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="interactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
              <TabsTrigger value="purchases">Purchase History</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="interactions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Interaction History</h3>
                <Button onClick={() => setShowInteractionDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Interaction
                </Button>
              </div>

              <div className="space-y-4">
                {interactions.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No interactions recorded yet. Log your first interaction!
                    </CardContent>
                  </Card>
                ) : (
                  interactions.map((interaction) => (
                    <Card key={interaction.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {getInteractionIcon(interaction.interaction_type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{interaction.subject}</h4>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {interaction.interaction_type} •{' '}
                                  {format(new Date(interaction.interaction_date), 'MMM d, yyyy h:mm a')}
                                </p>
                              </div>
                              {interaction.followup_required && (
                                <Badge variant="secondary">Follow-up Required</Badge>
                              )}
                            </div>
                            {interaction.description && (
                              <p className="text-sm mb-2">{interaction.description}</p>
                            )}
                            {interaction.outcome && (
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Outcome:</span> {interaction.outcome}
                              </p>
                            )}
                            {interaction.followup_date && (
                              <p className="text-sm text-muted-foreground mt-2">
                                <span className="font-medium">Follow-up:</span>{' '}
                                {format(new Date(interaction.followup_date), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-4">
              <h3 className="text-lg font-semibold">Purchase History</h3>
              
              <div className="space-y-4">
                {purchaseHistory.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No purchase history available.
                    </CardContent>
                  </Card>
                ) : (
                  purchaseHistory.map((invoice: any) => (
                    <Card 
                      key={invoice.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Invoice #{invoice.invoice_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(invoice.invoice_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">${invoice.total_amount.toFixed(2)}</p>
                            <Badge className={
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Notes</h3>
              
              <Card>
                <CardContent className="pt-6">
                  {customer.notes ? (
                    <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      No notes added yet. Click Edit to add notes.
                    </p>
                  )}
                </CardContent>
              </Card>
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
  );
}
