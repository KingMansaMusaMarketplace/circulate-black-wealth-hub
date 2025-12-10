import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin } from 'lucide-react';
import { CoalitionMember } from '@/hooks/use-coalition';
import { Link } from 'react-router-dom';

interface CoalitionMembersGridProps {
  members: CoalitionMember[];
}

export function CoalitionMembersGrid({ members }: CoalitionMembersGridProps) {
  if (members.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">No Members Yet</h3>
        <p className="text-sm text-muted-foreground">
          Coalition members will appear here as businesses join.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Participating Businesses</h3>
        <Badge variant="secondary">{members.length} businesses</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Link 
            key={member.id} 
            to={`/business/${member.business_id}`}
            className="block"
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={member.business?.logo_url || undefined} 
                      alt={member.business?.business_name} 
                    />
                    <AvatarFallback>
                      {member.business?.business_name?.charAt(0) || 'B'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {member.business?.business_name}
                    </p>
                    {member.business?.category && (
                      <p className="text-xs text-muted-foreground truncate">
                        {member.business.category}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Earn & Redeem
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Coalition
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
