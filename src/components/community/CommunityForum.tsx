
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Heart, Users, TrendingUp, Plus, Eye, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const topicSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category_id: z.string().min(1, 'Please select a category')
});

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  views_count: number;
  replies_count: number;
  likes_count: number;
  created_at: string;
  category_id: string;
  user_id: string;
  is_featured: boolean;
  is_pinned: boolean;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  } | null;
  forum_categories: {
    name: string;
    color: string;
  };
}

const CommunityForum: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: '',
      content: '',
      category_id: ''
    }
  });

  useEffect(() => {
    fetchCategories();
    fetchTopics();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }
    
    setCategories(data || []);
  };

  const fetchTopics = async () => {
    setLoading(true);
    let query = supabase
      .from('forum_topics')
      .select(`
        *,
        profiles!forum_topics_user_id_fkey(full_name, avatar_url),
        forum_categories(name, color)
      `)
      .order('is_pinned', { ascending: false })
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load forum topics');
      setLoading(false);
      return;
    }
    
    // Transform the data to match our interface
    const transformedTopics: ForumTopic[] = (data || []).map(topic => ({
      ...topic,
      profiles: topic.profiles || null
    }));

    setTopics(transformedTopics);
    setLoading(false);
  };

  const createTopic = async (values: z.infer<typeof topicSchema>) => {
    if (!user) {
      toast.error('Please log in to create a topic');
      return;
    }

    const { error } = await supabase
      .from('forum_topics')
      .insert({
        title: values.title,
        content: values.content,
        category_id: values.category_id,
        user_id: user.id
      });

    if (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic');
      return;
    }

    toast.success('Topic created successfully!');
    form.reset();
    setIsCreateDialogOpen(false);
    fetchTopics();
  };

  const handleTopicClick = async (topicId: string) => {
    // Increment view count using a database function or RPC
    const { error } = await supabase.rpc('increment_topic_views', {
      topic_id: topicId
    });
    
    if (error) {
      console.error('Error incrementing views:', error);
    }
    
    // Navigate to topic detail (you can implement this)
    console.log('Navigate to topic:', topicId);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
          <p className="text-gray-600 mt-2">Connect, share, and grow together as a community</p>
        </div>
        
        {user && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-mansablue hover:bg-mansablue-dark">
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(createTopic)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="What's your topic about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your thoughts, questions, or insights..."
                            className="min-h-[120px]"
                            {...field}
                          />
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
                    <Button type="submit">Create Topic</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            size="sm"
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Topics List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {topics.map((topic) => (
            <Card 
              key={topic.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                topic.is_pinned ? 'border-l-4 border-l-mansagold' : ''
              } ${topic.is_featured ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''}`}
              onClick={() => handleTopicClick(topic.id)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {topic.is_pinned && (
                        <Badge variant="secondary" className="text-xs">
                          Pinned
                        </Badge>
                      )}
                      {topic.is_featured && (
                        <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                          Featured
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: topic.forum_categories.color, color: topic.forum_categories.color }}
                      >
                        {topic.forum_categories.name}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-mansablue transition-colors">
                      {topic.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {topic.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {topic.profiles?.full_name || 'Anonymous'}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {formatNumber(topic.views_count)}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {formatNumber(topic.replies_count)}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {formatNumber(topic.likes_count)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {topics.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No topics yet</h3>
                <p className="text-gray-600 mb-4">
                  Be the first to start a conversation in this category!
                </p>
                {user && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Create First Topic
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
