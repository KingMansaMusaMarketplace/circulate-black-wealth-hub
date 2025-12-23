import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Image, Mail, Presentation, CreditCard, Package, Loader2 } from 'lucide-react';
import { MarketingMaterial } from '@/hooks/use-ambassador-resources';

interface MarketingMaterialsSectionProps {
  materials: MarketingMaterial[];
  loading: boolean;
  onDownload: (material: MarketingMaterial) => void;
}

const getMaterialIcon = (type: MarketingMaterial['material_type']) => {
  switch (type) {
    case 'flyer':
      return FileText;
    case 'business_card':
      return CreditCard;
    case 'social_media':
      return Image;
    case 'email_template':
      return Mail;
    case 'presentation':
      return Presentation;
    default:
      return Package;
  }
};

const getMaterialTypeLabel = (type: MarketingMaterial['material_type']) => {
  switch (type) {
    case 'flyer':
      return 'Flyer';
    case 'business_card':
      return 'Business Card';
    case 'social_media':
      return 'Social Media';
    case 'email_template':
      return 'Email Template';
    case 'presentation':
      return 'Presentation';
    default:
      return 'Other';
  }
};

const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MarketingMaterialsSection: React.FC<MarketingMaterialsSectionProps> = ({
  materials,
  loading,
  onDownload,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-mansagold" />
            Marketing Materials
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
        </CardContent>
      </Card>
    );
  }

  if (materials.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-mansagold" />
            Marketing Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Marketing materials coming soon!</p>
            <p className="text-sm mt-2">Check back later for flyers, business cards, and more.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group materials by type
  const groupedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.material_type]) {
      acc[material.material_type] = [];
    }
    acc[material.material_type].push(material);
    return acc;
  }, {} as Record<string, MarketingMaterial[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-mansagold" />
          Marketing Materials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedMaterials).map(([type, items]) => {
          const Icon = getMaterialIcon(type as MarketingMaterial['material_type']);
          return (
            <div key={type}>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {getMaterialTypeLabel(type as MarketingMaterial['material_type'])}s
              </h3>
              <div className="grid gap-3">
                {items.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {material.thumbnail_url ? (
                        <img
                          src={material.thumbnail_url}
                          alt={material.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-mansagold/10 rounded flex items-center justify-center">
                          <Icon className="h-6 w-6 text-mansagold" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{material.title}</p>
                        {material.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {material.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {material.file_size && (
                            <Badge variant="secondary" className="text-xs">
                              {formatFileSize(material.file_size)}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {material.download_count} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDownload(material)}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default MarketingMaterialsSection;
