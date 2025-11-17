import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar, MapPin, Users, Clock, Plus, Video } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format, parseISO, isFuture, isPast } from 'date-fns';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  event_date: z.string().min(1, 'Event date is required'),
  location: z.string().min(1, 'Location is required'),
  is_virtual: z.boolean().default(false),
  max_attendees: z.number().min(1).optional()
});

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  is_virtual: boolean;
  max_attendees?: number;
  current_attendees: number;
  is_featured: boolean;
  organizer_id: string;
  business_id?: string;
  created_at: string;
  organizer_name?: string;
  business_name?: string;
  business_logo?: string;
}

const CommunityEvents: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CommunityEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<CommunityEvent[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      event_date: '',
      location: '',
      is_virtual: false,
      max_attendees: undefined
    }
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const upcoming = events.filter(event => isFuture(parseISO(event.event_date)));
    const past = events.filter(event => isPast(parseISO(event.event_date)));
    
    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, [events]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_events')
      .select(`
        *,
        businesses(business_name, logo_url)
      `)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setLoading(false);
      return;
    }

    // Transform the data to match our interface
    const transformedEvents: CommunityEvent[] = (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      is_virtual: event.is_virtual,
      max_attendees: event.max_attendees,
      current_attendees: event.current_attendees,
      is_featured: event.is_featured,
      organizer_id: event.organizer_id,
      business_id: event.business_id,
      created_at: event.created_at,
      organizer_name: 'Community Member', // We'll enhance this later
      business_name: event.businesses?.business_name,
      business_logo: event.businesses?.logo_url
    }));

    setEvents(transformedEvents);
    setLoading(false);
  };

  const createEvent = async (values: z.infer<typeof eventSchema>) => {
    if (!user) {
      toast.error('Please log in to create an event');
      return;
    }

    const { error } = await supabase
      .from('community_events')
      .insert({
        title: values.title,
        description: values.description,
        event_date: values.event_date,
        location: values.location,
        is_virtual: values.is_virtual,
        max_attendees: values.max_attendees,
        organizer_id: user.id
      });

    if (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      return;
    }

    toast.success('Event created successfully!');
    form.reset();
    setIsCreateDialogOpen(false);
    fetchEvents();
  };

  const joinEvent = async (eventId: string) => {
    if (!user) {
      toast.error('Please log in to join events');
      return;
    }

    const { error } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status: 'attending'
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('You are already registered for this event');
      } else {
        console.error('Error joining event:', error);
        toast.error('Failed to join event');
      }
      return;
    }

    // Update attendee count using our edge function
    try {
      await supabase.functions.invoke('increment-counters', {
        body: { action: 'increment_event_attendees', id: eventId }
      });
    } catch (updateError) {
      console.error('Error updating attendee count:', updateError);
    }

    toast.success('Successfully joined the event!');
    fetchEvents();
  };

  const renderEventCard = (event: CommunityEvent) => {
    const eventDate = parseISO(event.event_date);
    const isUpcoming = isFuture(eventDate);
    const isFull = event.max_attendees && event.current_attendees >= event.max_attendees;

    return (
      <Card key={event.id} className={`group hover:shadow-lg transition-shadow ${
        event.is_featured ? 'border-l-4 border-l-mansagold' : ''
      }`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              {event.is_featured && (
                <Badge className="mb-2 bg-gradient-to-r from-purple-500 to-pink-500">
                  Featured Event
                </Badge>
              )}
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-mansablue transition-colors">
                {event.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {event.description}
              </p>
            </div>
            
            {event.business_logo && (
              <img
                src={event.business_logo}
                alt="Business Logo"
                className="w-12 h-12 rounded object-cover"
              />
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-blue-200/70">
              <Calendar className="h-4 w-4 mr-2 text-mansagold" />
              <span>{format(eventDate, 'PPP')}</span>
              <Clock className="h-4 w-4 ml-4 mr-2 text-mansagold" />
              <span>{format(eventDate, 'p')}</span>
            </div>
            
            <div className="flex items-center text-sm text-blue-200/70">
              {event.is_virtual ? (
                <>
                  <Video className="h-4 w-4 mr-2 text-mansagold" />
                  <span>Virtual Event</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2 text-mansagold" />
                  <span>{event.location}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center text-sm text-blue-200/70">
              <Users className="h-4 w-4 mr-2 text-mansagold" />
              <span>
                {event.current_attendees} attending
                {event.max_attendees && ` / ${event.max_attendees} max`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-blue-200/50">
              <span>Organized by {event.organizer_name}</span>
              {event.business_name && (
                <span className="ml-2">• {event.business_name}</span>
              )}
            </div>
            
            {isUpcoming && user && (
              <Button
                size="sm"
                onClick={() => joinEvent(event.id)}
                disabled={isFull}
                className={isFull ? 'opacity-50 cursor-not-allowed bg-slate-700 text-blue-200/50' : 'bg-gradient-to-r from-mansagold to-amber-400 hover:from-amber-400 hover:to-mansagold text-white shadow-md shadow-mansagold/30'}
              >
                {isFull ? 'Event Full' : 'Join Event'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Community Events</h1>
          <p className="text-blue-100/90 mt-2">Connect, learn, and grow together at local events</p>
        </div>
        
        {user && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-mansablue to-blue-600 hover:from-blue-600 hover:to-mansablue text-white shadow-lg shadow-mansablue/30">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Create Community Event</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(createEvent)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="What's happening?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell people about your event..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="event_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date & Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="max_attendees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Attendees (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Unlimited"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Where is this happening?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Event</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events ({upcomingEvents.length})
        </Button>
        <Button
          variant={activeTab === 'past' ? 'default' : 'outline'}
          onClick={() => setActiveTab('past')}
        >
          Past Events ({pastEvents.length})
        </Button>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-slate-800/40 border-white/10">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-700/50 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {activeTab === 'upcoming' ? (
            upcomingEvents.length > 0 ? (
              upcomingEvents.map(renderEventCard)
            ) : (
              <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-mansagold mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No upcoming events</h3>
                  <p className="text-blue-200/70 mb-4">
                    Be the first to create a community event!
                  </p>
                  {user && (
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-mansagold to-amber-400 hover:from-amber-400 hover:to-mansagold text-white"
                    >
                      Create Event
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          ) : (
            pastEvents.length > 0 ? (
              pastEvents.map(renderEventCard)
            ) : (
              <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-mansagold mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No past events</h3>
                  <p className="text-blue-200/70">
                    Past events will appear here once they're completed.
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityEvents;
