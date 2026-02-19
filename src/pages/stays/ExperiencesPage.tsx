import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sparkles,
  Star,
  Clock,
  Users,
  MapPin,
  Search,
  Plus,
  Compass,
  Music,
  Utensils,
  Bike,
  Camera,
  Palette,
  Leaf,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  state: string;
  price_per_person: number;
  max_guests: number;
  duration_hours: number;
  photos: string[];
  languages: string[];
  average_rating: number;
  total_reviews: number;
  is_active: boolean;
}

const CATEGORIES = [
  { value: 'all', label: 'All Experiences', icon: Compass },
  { value: 'food', label: 'Food & Drink', icon: Utensils },
  { value: 'arts', label: 'Arts & Culture', icon: Palette },
  { value: 'outdoor', label: 'Outdoors', icon: Leaf },
  { value: 'music', label: 'Music', icon: Music },
  { value: 'photography', label: 'Photography', icon: Camera },
  { value: 'sports', label: 'Sports & Fitness', icon: Bike },
  { value: 'other', label: 'Other', icon: Sparkles },
];

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  arts: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  outdoor: 'bg-green-500/20 text-green-300 border-green-500/30',
  music: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  photography: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  sports: 'bg-red-500/20 text-red-300 border-red-500/30',
  other: 'bg-mansagold/20 text-mansagold border-mansagold/30',
};

const ExperiencesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stays_experiences')
        .select('*')
        .eq('is_active', true)
        .order('average_rating', { ascending: false });

      if (error) throw error;
      setExperiences((data || []) as Experience[]);
    } catch (err) {
      console.error('Error loading experiences:', err);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const filtered = experiences.filter(exp => {
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <Helmet>
        <title>Experiences | Mansa Stays</title>
        <meta name="description" content="Book unique local experiences hosted by Black creators — cooking classes, art workshops, outdoor adventures and more on Mansa Stays." />
        <meta property="og:title" content="Mansa Stays Experiences — Unique Local Activities" />
        <link rel="canonical" href="https://circulate-black-wealth-hub.lovable.app/stays/experiences" />
      </Helmet>

      <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60" />

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="text-mansagold text-sm font-mono tracking-widest uppercase bg-mansagold/10 px-4 py-2 rounded-full border border-mansagold/20 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              New on Mansa Stays
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mansagold via-amber-400 to-mansagold">
              Experiences
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto mb-8"
          >
            Unique activities hosted by Black creators — go beyond the listing
          </motion.p>

          {/* Host CTA */}
          {user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Button
                onClick={() => navigate('/stays/experiences/new')}
                className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 font-bold hover:from-amber-400 hover:to-mansagold shadow-lg shadow-mansagold/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Host an Experience
              </Button>
            </motion.div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search experiences or cities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500 focus:border-mansagold/50"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-slate-800/70 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value} className="text-white">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  selectedCategory === cat.value
                    ? 'bg-mansagold text-slate-900 border-mansagold'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-mansagold/50 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Compass className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No experiences yet</h3>
            <p className="text-slate-400 mb-6">Be the first to host an experience in your city!</p>
            {user && (
              <Button
                onClick={() => navigate('/stays/experiences/new')}
                className="bg-mansagold text-black hover:bg-mansagold/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Host an Experience
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-slate-800/60 border-slate-700 overflow-hidden hover:border-mansagold/40 transition-all group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    {exp.photos?.[0] ? (
                      <img
                        src={exp.photos[0]}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-mansagold/20 to-slate-700 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-mansagold/50" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={`text-xs border ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.other}`}
                      >
                        {CATEGORIES.find(c => c.value === exp.category)?.label || exp.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-1 line-clamp-1">{exp.title}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-sm mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{exp.city}, {exp.state}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-3 text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exp.duration_hours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Up to {exp.max_guests}
                        </span>
                      </div>
                      {exp.average_rating > 0 && (
                        <span className="flex items-center gap-1 text-mansagold font-medium">
                          <Star className="w-3 h-3 fill-mansagold" />
                          {exp.average_rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-white">${exp.price_per_person}</span>
                        <span className="text-slate-400 text-xs"> / person</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-mansagold text-black hover:bg-mansagold/90 text-xs"
                        onClick={() => navigate(`/stays/experiences/${exp.id}`)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencesPage;
