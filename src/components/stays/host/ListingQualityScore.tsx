import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { VacationProperty } from '@/types/vacation-rental';
import {
  CheckCircle,
  XCircle,
  Camera,
  FileText,
  MapPin,
  DollarSign,
  Star,
  AlertTriangle,
} from 'lucide-react';

interface QualityItem {
  label: string;
  passed: boolean;
  weight: number;
  tip: string;
  icon: React.ReactNode;
}

interface ListingQualityScoreProps {
  property: VacationProperty;
}

const ListingQualityScore: React.FC<ListingQualityScoreProps> = ({ property }) => {
  const items: QualityItem[] = [
    {
      label: 'Title (10+ characters)',
      passed: (property.title?.length ?? 0) >= 10,
      weight: 10,
      tip: 'Use a descriptive title with location highlights',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: 'Description (50+ characters)',
      passed: (property.description?.length ?? 0) >= 50,
      weight: 15,
      tip: 'Tell guests what makes your space unique',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: 'At least 5 photos',
      passed: (property.photos?.length ?? 0) >= 5,
      weight: 25,
      tip: 'High-quality photos get 40% more bookings',
      icon: <Camera className="w-4 h-4" />,
    },
    {
      label: 'Cover photo set',
      passed: (property.photos?.length ?? 0) >= 1,
      weight: 10,
      tip: 'Your first photo is what guests see in search results',
      icon: <Camera className="w-4 h-4" />,
    },
    {
      label: 'Location complete',
      passed: !!(property.city && property.state && property.address),
      weight: 10,
      tip: 'Complete address helps guests plan their trip',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      label: '3+ amenities listed',
      passed: (property.amenities?.length ?? 0) >= 3,
      weight: 10,
      tip: 'Amenities are a top search filter for guests',
      icon: <Star className="w-4 h-4" />,
    },
    {
      label: 'Cleaning fee set',
      passed: (property.cleaning_fee ?? 0) > 0,
      weight: 5,
      tip: 'Transparent pricing builds guest trust',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: 'House rules added',
      passed: (property.house_rules?.length ?? 0) > 10,
      weight: 10,
      tip: 'Clear rules reduce misunderstandings',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: 'Instant Book enabled',
      passed: property.is_instant_book,
      weight: 5,
      tip: 'Instant Book listings get 20% more reservations',
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  const earnedWeight = items.filter(i => i.passed).reduce((s, i) => s + i.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-mansagold';
    return 'text-red-400';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Work';
  };

  const failedItems = items.filter(i => !i.passed);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-mansagold" />
              Listing Quality Score
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1">
              Higher scores rank better in search results
            </CardDescription>
          </div>
          <div className="text-right">
            <span className={`text-4xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-slate-400 text-sm">/100</span>
            <Badge className={`block mt-1 ${score >= 70 ? 'bg-green-500/20 text-green-400' : 'bg-mansagold/20 text-mansagold'}`}>
              {getScoreLabel()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={score} className="h-3" />

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded-lg ${
                item.passed ? 'bg-green-500/5' : 'bg-red-500/5'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.passed ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <span className={`text-sm ${item.passed ? 'text-slate-300' : 'text-white'}`}>
                  {item.label}
                </span>
              </div>
              <span className="text-xs text-slate-500">+{item.weight}pts</span>
            </div>
          ))}
        </div>

        {failedItems.length > 0 && (
          <div className="mt-4 p-3 bg-mansagold/10 border border-mansagold/20 rounded-lg">
            <h4 className="text-sm font-semibold text-mansagold flex items-center gap-1 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Quick Wins
            </h4>
            <ul className="space-y-1">
              {failedItems.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                  {item.icon}
                  {item.tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListingQualityScore;
