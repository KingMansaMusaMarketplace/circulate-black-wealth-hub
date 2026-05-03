import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Book, FileText, ThumbsUp, ThumbsDown, 
  Eye, ChevronRight, ArrowLeft
} from 'lucide-react';
import { 
  getKnowledgeBaseArticles, searchKnowledgeBase, getKnowledgeBaseArticle,
  markArticleHelpful, KnowledgeBaseArticle, KB_CATEGORIES
} from '@/lib/api/helpdesk-api';
import { format } from 'date-fns';
import { sanitizeHtml } from '@/lib/security/content-sanitizer';

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['knowledge-base-articles'],
    queryFn: () => getKnowledgeBaseArticles(undefined, true)
  });

  const { data: searchResults } = useQuery({
    queryKey: ['knowledge-base-search', searchQuery],
    queryFn: () => searchKnowledgeBase(searchQuery),
    enabled: searchQuery.length >= 3
  });

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles?.filter(a => a.category === selectedCategory);

  const displayedArticles = searchQuery.length >= 3 ? searchResults : filteredArticles;

  const handleArticleClick = async (article: KnowledgeBaseArticle) => {
    const fullArticle = await getKnowledgeBaseArticle(article.id);
    setSelectedArticle(fullArticle);
  };

  const handleFeedback = async (helpful: boolean) => {
    if (selectedArticle) {
      await markArticleHelpful(selectedArticle.id, helpful);
    }
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto p-6 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedArticle(null)}
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-3">
                    {selectedArticle.category}
                  </Badge>
                  <CardTitle className="text-2xl text-white">{selectedArticle.title}</CardTitle>
                  <p className="text-sm text-blue-200/60 mt-2">
                    Last updated: {format(new Date(selectedArticle.updated_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-blue-200/60">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {selectedArticle.view_count}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* SECURITY: Sanitize HTML content to prevent XSS attacks */}
              <div 
                className="prose prose-invert max-w-none text-blue-100"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedArticle.content) }}
              />

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-blue-200/70 mb-4">Was this article helpful?</p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback(true)}
                    className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Yes ({selectedArticle.helpful_count})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFeedback(false)}
                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    No ({selectedArticle.not_helpful_count})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--mansagold) / 0.05), transparent 70%)',
        }}
      />

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-mansagold/10 border border-mansagold/30 rounded-full mb-4">
            <Book className="h-5 w-5 text-mansagold" />
            <span className="text-mansagold font-medium">Knowledge Base</span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-4">How can we help you?</h1>
          <p className="text-slate-400">Search our knowledge base or browse by category</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles..."
              className="pl-12 h-14 bg-slate-900/60 border-white/10 text-white text-lg placeholder:text-slate-500 focus-visible:border-mansagold/50 focus-visible:ring-mansagold/40"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' 
              ? 'bg-mansagold text-black hover:bg-mansagold/90 font-medium' 
              : 'bg-transparent border-white/15 text-slate-200 hover:bg-white/5 hover:text-white'
            }
          >
            All
          </Button>
          {KB_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? 'bg-mansagold text-black hover:bg-mansagold/90 font-medium capitalize' 
                : 'bg-transparent border-white/15 text-slate-200 hover:bg-white/5 hover:text-white capitalize'
              }
            >
              {category.replace('-', ' ')}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold" />
            </div>
          ) : displayedArticles?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No articles found</p>
            </div>
          ) : (
            displayedArticles?.map((article) => (
              <Card
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="bg-slate-900/40 border-white/10 hover:border-mansagold/40 transition-colors cursor-pointer group"
              >
                <CardContent className="p-5">
                  <Badge className="bg-mansablue/15 text-blue-300 border border-mansablue/40 mb-3 capitalize">
                    {article.category.replace('-', ' ')}
                  </Badge>
                  <h3 className="font-semibold text-white group-hover:text-mansagold transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {article.helpful_count}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-mansagold transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
