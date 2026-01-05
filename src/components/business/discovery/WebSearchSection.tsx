import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Search, 
  Sparkles, 
  Loader2, 
  MapPin, 
  ExternalLink,
  Building2,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useB2B } from '@/hooks/use-b2b';
import { DiscoveredBusiness } from '@/types/b2b-external';
import { useAuth } from '@/contexts/AuthContext';

interface WebSearchSectionProps {
  initialQuery?: string;
}

export function WebSearchSection({ initialQuery = '' }: WebSearchSectionProps) {
  const { user } = useAuth();
  const {
    webSearchResults,
    webSearchCitations,
    webSearchLoading,
    searchWebSuppliers,
    saveExternalLead,
    saveAllSearchResults,
    clearWebSearch,
  } = useB2B();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [savedBusinesses, setSavedBusinesses] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) return;
    setIsExpanded(true);
    await searchWebSuppliers(searchQuery, undefined, location || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    const result = await saveAllSearchResults(searchQuery);
    if (result.saved > 0) {
      // Mark all as saved
      const newSaved = new Set(savedBusinesses);
      webSearchResults.forEach(b => newSaved.add(b.name));
      setSavedBusinesses(newSaved);
    }
    setSavingAll(false);
  };

  const handleSaveOne = async (business: DiscoveredBusiness) => {
    const result = await saveExternalLead(business, searchQuery, true);
    if (result) {
      setSavedBusinesses(prev => new Set(prev).add(business.name));
    }
  };

  return (
    <div className="relative">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 rounded-3xl blur-xl" />
      
      <Card className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-purple-500/30 backdrop-blur-xl overflow-hidden">
        {/* Animated border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-pulse" />
        
        <CardContent className="relative p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">AI-Powered Discovery</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Search the web for Black-owned businesses that aren't on our platform yet. 
              Powered by AI to help you discover amazing businesses everywhere.
            </p>
          </div>

          {/* Search Form */}
          <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto mb-6">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
              <Input
                placeholder="What type of business are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 h-14 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-slate-400 focus:border-purple-400 text-lg rounded-xl"
              />
            </div>
            <div className="relative md:w-48">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
              <Input
                placeholder="City or State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 h-14 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-slate-400 focus:border-pink-400 text-lg rounded-xl"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={webSearchLoading || searchQuery.trim().length < 3}
              className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/25 font-semibold text-lg"
            >
              {webSearchLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search Web
                </>
              )}
            </Button>
          </div>

          {/* Loading State */}
          {webSearchLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-purple-500/20 border border-purple-500/30">
                <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                <span className="text-purple-300">Searching the web for Black-owned businesses...</span>
              </div>
            </div>
          )}

          {/* Results */}
          {isExpanded && !webSearchLoading && webSearchResults.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-400" />
                  Discovered {webSearchResults.length} Businesses
                </h4>
                <div className="flex items-center gap-2">
                  {user && (
                    <Button
                      size="sm"
                      onClick={handleSaveAll}
                      disabled={savingAll}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      {savingAll ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Add All to Directory
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearWebSearch();
                      setIsExpanded(false);
                      setSavedBusinesses(new Set());
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    Clear Results
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {webSearchResults.map((business: DiscoveredBusiness, index: number) => (
                  <Card 
                    key={`${business.name}-${index}`}
                    className="bg-slate-700/50 border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-white line-clamp-1">{business.name}</h5>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            business.confidence >= 0.8 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                              : business.confidence >= 0.6 
                                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                          }`}
                        >
                          {Math.round(business.confidence * 100)}% match
                        </Badge>
                      </div>
                      
                      {business.category && (
                        <Badge variant="secondary" className="mb-2 text-xs bg-purple-500/20 text-purple-300 border-0">
                          {business.category}
                        </Badge>
                      )}
                      
                      <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                        {business.description || 'No description available'}
                      </p>
                      
                      {business.location && (
                        <div className="flex items-center text-xs text-slate-500 mb-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          {business.location}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3">
                        {business.website && (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center text-sm text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-lg border border-purple-500/30 hover:bg-purple-500/10"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Website
                          </a>
                        )}
                        
                        {user && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveOne(business)}
                            disabled={savedBusinesses.has(business.name)}
                            className={`flex-1 ${
                              savedBusinesses.has(business.name)
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                            }`}
                          >
                            {savedBusinesses.has(business.name) ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Citations */}
              {webSearchCitations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500 mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {webSearchCitations.slice(0, 3).map((citation, index) => (
                      <a
                        key={index}
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 truncate max-w-[200px]"
                      >
                        {new URL(citation).hostname}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Results State */}
          {isExpanded && !webSearchLoading && webSearchResults.length === 0 && searchQuery && (
            <div className="text-center py-6">
              <p className="text-slate-400">
                No businesses found. Try a different search term or location.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
