import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Search, Building2 } from 'lucide-react';
import { CORPORATE_FAQ_ITEMS } from '@/lib/corporate-onboarding-constants';

export const CorporateFAQSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFAQs = CORPORATE_FAQ_ITEMS.filter(
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
          <Building2 className="w-8 h-8 text-mansablue" />
          <h2 className="text-2xl font-bold text-gray-900">
            Corporate Partnership FAQ
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about corporate sponsorship, partnership benefits, and community impact measurement.
        </p>
      </div>

      {/* Search and controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search corporate partnership FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-3">
              <Badge variant="secondary">
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No FAQ items match your search. Try different keywords or browse all questions.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors p-4"
                onClick={() => toggleExpanded(index)}
              >
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="text-gray-900 pr-4">{item.question}</span>
                  {expandedItems.has(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </CardTitle>
              </CardHeader>
              
              {expandedItems.has(index) && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="border-t pt-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Corporate partnership support */}
      <Card className="bg-gradient-to-r from-mansablue/5 to-mansagold/5 border-mansablue/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">
            Need a custom partnership solution?
          </h3>
          <p className="text-gray-600 mb-4">
            Our corporate partnerships team can create tailored sponsorship packages that align perfectly with your company's goals and values.
          </p>
          <Button 
            className="bg-gradient-to-r from-mansablue to-mansagold hover:from-mansablue-dark hover:to-mansagold-dark text-white"
            onClick={() => window.location.href = 'mailto:partnerships@mansamusamarketplace.com'}
          >
            Schedule Partnership Consultation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};