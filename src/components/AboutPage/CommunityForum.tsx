
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageCircle, Heart, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const discussionTopics = [
  {
    id: 1,
    category: "financial-literacy",
    title: "Building Credit in Underserved Communities",
    author: "Marcus Stevens",
    authorImage: "/placeholder.svg",
    date: "2 days ago",
    replies: 28,
    likes: 47,
    featured: true,
  },
  {
    id: 2,
    category: "business-strategy",
    title: "Marketing Strategies for Small Black-Owned Businesses",
    author: "Tasha Williams",
    authorImage: "/placeholder.svg",
    date: "1 week ago",
    replies: 34,
    likes: 52,
    featured: true,
  },
  {
    id: 3,
    category: "financial-literacy",
    title: "First-time Home Buying Tips for Millennials",
    author: "Devon Carter",
    authorImage: "/placeholder.svg",
    date: "3 days ago",
    replies: 19,
    likes: 31,
    featured: false,
  },
  {
    id: 4,
    category: "circulation",
    title: "How to Increase Dollar Circulation in Your Community",
    author: "Jasmine Taylor",
    authorImage: "/placeholder.svg",
    date: "5 days ago",
    replies: 42,
    likes: 73,
    featured: true,
  },
  {
    id: 5,
    category: "circulation",
    title: "Supporting Black-Owned Banks and Credit Unions",
    author: "Robert Johnson",
    authorImage: "/placeholder.svg",
    date: "2 weeks ago",
    replies: 16,
    likes: 29,
    featured: false,
  },
  {
    id: 6,
    category: "business-strategy",
    title: "E-commerce Strategies for Product-Based Businesses",
    author: "Nicole Brown",
    authorImage: "/placeholder.svg",
    date: "4 days ago",
    replies: 23,
    likes: 38,
    featured: false,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Financial Literacy Workshop",
    date: "June 15, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Virtual Event",
    attendees: 158,
  },
  {
    id: 2,
    title: "Small Business Funding Seminar",
    date: "June 28, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Atlanta Tech Village",
    attendees: 87,
  },
  {
    id: 3,
    title: "Community Banking Forum",
    date: "July 10, 2025",
    time: "5:30 PM - 7:30 PM",
    location: "Virtual Event",
    attendees: 112,
  }
];

const CommunityForum = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Community Forum</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-mansagold" />
            <p className="text-lg font-medium text-mansablue-dark">Join the Conversation</p>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with other community members to discuss economic empowerment strategies,
            share success stories, and learn from one another.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Popular Discussions</span>
                  <Button variant="outline" size="sm">New Post</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Topics</TabsTrigger>
                    <TabsTrigger value="financial-literacy">Financial Literacy</TabsTrigger>
                    <TabsTrigger value="circulation">Circulation</TabsTrigger>
                    <TabsTrigger value="business-strategy">Business Strategy</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {discussionTopics.map((topic) => (
                      <div 
                        key={topic.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-all ${topic.featured ? 'bg-mansablue/5 border-mansablue/20' : 'bg-white'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={topic.authorImage} />
                              <AvatarFallback>{topic.author.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium hover:text-mansablue cursor-pointer">
                                {topic.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span>{topic.author}</span>
                                <span>•</span>
                                <span>{topic.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{topic.replies}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{topic.likes}</span>
                            </div>
                          </div>
                        </div>
                        {topic.featured && (
                          <div className="mt-2 pl-12">
                            <span className="inline-block bg-mansablue/10 text-mansablue text-xs px-2 py-0.5 rounded-full">
                              Featured Discussion
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex justify-center mt-6">
                      <Button variant="outline">View All Discussions</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="financial-literacy" className="space-y-4">
                    {discussionTopics.filter(t => t.category === 'financial-literacy').map((topic) => (
                      <div 
                        key={topic.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-all ${topic.featured ? 'bg-mansablue/5 border-mansablue/20' : 'bg-white'}`}
                      >
                        {/* Same content structure as above */}
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={topic.authorImage} />
                              <AvatarFallback>{topic.author.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium hover:text-mansablue cursor-pointer">
                                {topic.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span>{topic.author}</span>
                                <span>•</span>
                                <span>{topic.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{topic.replies}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{topic.likes}</span>
                            </div>
                          </div>
                        </div>
                        {topic.featured && (
                          <div className="mt-2 pl-12">
                            <span className="inline-block bg-mansablue/10 text-mansablue text-xs px-2 py-0.5 rounded-full">
                              Featured Discussion
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="circulation" className="space-y-4">
                    {discussionTopics.filter(t => t.category === 'circulation').map((topic) => (
                      <div 
                        key={topic.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-all ${topic.featured ? 'bg-mansablue/5 border-mansablue/20' : 'bg-white'}`}
                      >
                        {/* Same content structure as above */}
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={topic.authorImage} />
                              <AvatarFallback>{topic.author.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium hover:text-mansablue cursor-pointer">
                                {topic.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span>{topic.author}</span>
                                <span>•</span>
                                <span>{topic.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{topic.replies}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{topic.likes}</span>
                            </div>
                          </div>
                        </div>
                        {topic.featured && (
                          <div className="mt-2 pl-12">
                            <span className="inline-block bg-mansablue/10 text-mansablue text-xs px-2 py-0.5 rounded-full">
                              Featured Discussion
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="business-strategy" className="space-y-4">
                    {discussionTopics.filter(t => t.category === 'business-strategy').map((topic) => (
                      <div 
                        key={topic.id}
                        className={`p-4 border rounded-lg hover:shadow-md transition-all ${topic.featured ? 'bg-mansablue/5 border-mansablue/20' : 'bg-white'}`}
                      >
                        {/* Same content structure as above */}
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={topic.authorImage} />
                              <AvatarFallback>{topic.author.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium hover:text-mansablue cursor-pointer">
                                {topic.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span>{topic.author}</span>
                                <span>•</span>
                                <span>{topic.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{topic.replies}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{topic.likes}</span>
                            </div>
                          </div>
                        </div>
                        {topic.featured && (
                          <div className="mt-2 pl-12">
                            <span className="inline-block bg-mansablue/10 text-mansablue text-xs px-2 py-0.5 rounded-full">
                              Featured Discussion
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-mansagold" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-medium text-mansablue">{event.title}</h4>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.date}, {event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{event.attendees} attending</span>
                        </div>
                        <div>{event.location}</div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        RSVP
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/events" className="text-mansablue font-medium inline-flex items-center hover:underline">
                    View All Events
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityForum;
