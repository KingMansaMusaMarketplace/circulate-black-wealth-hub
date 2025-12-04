import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/onboarding-constants';

export const FAQSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFAQs = FAQ_ITEMS.filter(
    item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map((_, index) => index)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-blue-200 max-w-2xl mx-auto">
          Find quick answers to common questions about using Mansa Musa Marketplace.
        </p>
      </div>

      {/* Search and controls */}
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
              <Input
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300/60"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll} className="border-white/20 text-blue-200 hover:bg-white/10 hover:text-white">
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll} className="border-white/20 text-blue-200 hover:bg-white/10 hover:text-white">
                Collapse All
              </Button>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-3">
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-200">
                No FAQ items match your search. Try different keywords or browse all questions.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((item, index) => (
            <Card key={index} className="overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10">
              <CardHeader 
                className="cursor-pointer hover:bg-white/10 transition-colors p-4"
                onClick={() => toggleExpanded(index)}
              >
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="text-white pr-4">{item.question}</span>
                  {expandedItems.has(index) ? (
                    <ChevronUp className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-300 flex-shrink-0" />
                  )}
                </CardTitle>
              </CardHeader>
              
              {expandedItems.has(index) && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-blue-100 leading-relaxed">{item.answer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Contact support */}
      <Card className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-yellow-500/10 border border-white/10">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-white mb-2">
            Still need help?
          </h3>
          <p className="text-blue-200 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button 
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
