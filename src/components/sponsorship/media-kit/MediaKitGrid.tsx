
import React from 'react';
import { FileText, Download, Users, BarChart3, FilePen, Shield } from 'lucide-react';
import MediaKitItem, { MediaKitItemProps } from './MediaKitItem';

interface MediaKitGridProps {
  onDownload: (title: string, action?: string) => void;
}

const MediaKitGrid: React.FC<MediaKitGridProps> = ({ onDownload }) => {
  const mediaKitItems = [
    {
      icon: <FileText className="h-8 w-8 text-mansablue" />,
      title: "Sponsorship Prospectus",
      description: "Complete details about our sponsorship tiers, benefits, and impact metrics.",
      buttonText: "Download PDF",
      action: "personalize-prospectus"
    },
    {
      icon: <FilePen className="h-8 w-8 text-mansablue" />,
      title: "Sponsorship Agreement",
      description: "Our detailed legal agreement outlining terms, conditions, and cancellation policies.",
      buttonText: "View Agreement",
      action: "view-agreement"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-mansablue" />,
      title: "Impact Report",
      description: "Our latest data on economic circulation and community impact.",
      buttonText: "Download Report"
    },
    {
      icon: <Users className="h-8 w-8 text-mansablue" />,
      title: "Audience Demographics",
      description: "Detailed information about our community members and their engagement.",
      buttonText: "View Demographics"
    },
    {
      icon: <Shield className="h-8 w-8 text-mansablue" />,
      title: "Legal Compliance Guide",
      description: "Guidelines on regulatory compliance and ethical considerations for partnerships.",
      buttonText: "Download Guide"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {mediaKitItems.map((item, index) => (
        <MediaKitItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          buttonText={item.buttonText}
          action={item.action}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

export default MediaKitGrid;
