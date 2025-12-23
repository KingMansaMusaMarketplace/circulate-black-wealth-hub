import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  FileText, 
  Video, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Loader2,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { TrainingContent, TrainingProgress } from '@/hooks/use-ambassador-resources';

interface TrainingContentSectionProps {
  content: TrainingContent[];
  progress: TrainingProgress[];
  loading: boolean;
  onStartContent: (content: TrainingContent) => void;
  onMarkComplete: (content: TrainingContent) => void;
  getContentProgress: (contentId: string) => TrainingProgress | undefined;
}

const getContentIcon = (type: TrainingContent['content_type']) => {
  switch (type) {
    case 'video':
      return Video;
    case 'webinar':
      return PlayCircle;
    case 'document':
      return FileText;
    case 'quiz':
      return BookOpen;
    case 'course':
      return GraduationCap;
    default:
      return FileText;
  }
};

const getDifficultyColor = (level: TrainingContent['difficulty_level']) => {
  switch (level) {
    case 'beginner':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'intermediate':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    case 'advanced':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatDuration = (minutes: number | null): string => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const TrainingContentSection: React.FC<TrainingContentSectionProps> = ({
  content,
  progress,
  loading,
  onStartContent,
  onMarkComplete,
  getContentProgress,
}) => {
  const completedCount = progress.filter(p => p.status === 'completed').length;
  const totalCount = content.length;
  const overallProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-mansablue" />
            Training Center
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
        </CardContent>
      </Card>
    );
  }

  if (content.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-mansablue" />
            Training Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Training content coming soon!</p>
            <p className="text-sm mt-2">Check back later for videos, webinars, and courses.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group content by category
  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, TrainingContent[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-mansablue" />
            Training Center
          </span>
          <Badge variant="secondary">
            {completedCount}/{totalCount} completed
          </Badge>
        </CardTitle>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedContent).map(([category, items]) => (
          <div key={category}>
            <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">
              {category}
            </h3>
            <div className="space-y-3">
              {items.map((item) => {
                const Icon = getContentIcon(item.content_type);
                const itemProgress = getContentProgress(item.id);
                const isCompleted = itemProgress?.status === 'completed';
                const isInProgress = itemProgress?.status === 'in_progress';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      isCompleted 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/10' : 'bg-mansablue/10'}`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Icon className="h-5 w-5 text-mansablue" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium">{item.title}</h4>
                            {item.is_required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {item.difficulty_level && (
                              <Badge variant="outline" className={getDifficultyColor(item.difficulty_level)}>
                                {item.difficulty_level}
                              </Badge>
                            )}
                            {item.duration_minutes && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(item.duration_minutes)}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {item.view_count} views
                            </span>
                          </div>
                          {isInProgress && itemProgress && (
                            <div className="mt-2">
                              <Progress value={itemProgress.progress_percent} className="h-1" />
                              <span className="text-xs text-muted-foreground">
                                {itemProgress.progress_percent}% complete
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {isCompleted ? (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              onClick={() => onStartContent(item)}
                              className="gap-1"
                            >
                              {item.external_url ? (
                                <>
                                  <ExternalLink className="h-4 w-4" />
                                  Open
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="h-4 w-4" />
                                  {isInProgress ? 'Continue' : 'Start'}
                                </>
                              )}
                            </Button>
                            {isInProgress && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onMarkComplete(item)}
                                className="gap-1 text-xs"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Mark Done
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrainingContentSection;
