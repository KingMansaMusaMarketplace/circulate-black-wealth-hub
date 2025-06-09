
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Video, Image, ExternalLink } from 'lucide-react';

const MediaGallerySection = () => {
  const mediaItems = [
    {
      type: "article",
      title: "The Economic Power of Circulation",
      source: "Economic Empowerment Today",
      date: "May 15, 2024",
      preview: "How Mansa Musa Marketplace is revolutionizing Black economic empowerment through intentional circulation...",
      icon: <FileText className="h-5 w-5" />,
      link: "/blog",
      isExternal: false
    },
    {
      type: "video",
      title: "Founder's Vision Interview",
      source: "Business Innovation Channel",
      date: "April 3, 2024",
      preview: "Thomas Bowling explains the systemic approach to wealth building that inspired the marketplace...",
      icon: <Video className="h-5 w-5" />,
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      isExternal: true
    },
    {
      type: "article",
      title: "Black Dollar Circulation: The 72-Hour Challenge",
      source: "Community Economics Magazine",
      date: "March 21, 2024",
      preview: "Analyzing how Mansa Musa Marketplace has extended Black dollar circulation time from 6 to 72 hours...",
      icon: <FileText className="h-5 w-5" />,
      link: "/blog",
      isExternal: false
    },
    {
      type: "image",
      title: "Merchant Success Summit 2024",
      source: "Annual Gathering",
      date: "February 8, 2024",
      preview: "Photo gallery from our annual gathering of marketplace merchants sharing success stories...",
      icon: <Image className="h-5 w-5" />,
      link: "/blog",
      isExternal: false
    },
  ];

  const renderLink = (item: typeof mediaItems[0]) => {
    const linkText = `View Full ${item.type}`;
    const linkIcon = item.isExternal ? <ExternalLink className="ml-1 h-3 w-3" /> : <ArrowRight className="ml-1 h-3 w-3" />;
    
    if (item.isExternal) {
      return (
        <a 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-mansablue font-medium text-sm flex items-center hover:underline"
        >
          {linkText}
          {linkIcon}
        </a>
      );
    } else {
      return (
        <Link 
          to={item.link} 
          className="text-mansablue font-medium text-sm flex items-center hover:underline"
        >
          {linkText}
          {linkIcon}
        </Link>
      );
    }
  };

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Media & Resources</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn more about our work through articles, videos, and resources.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mediaItems.map((item, index) => (
            <Card key={index} className="border-mansagold/10 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center mb-3 text-mansagold">
                  {item.icon}
                  <span className="ml-2 text-xs uppercase font-bold">{item.type}</span>
                </div>
                <h3 className="text-lg font-bold text-mansablue-dark mb-2">{item.title}</h3>
                <div className="text-sm text-gray-500 mb-3">
                  {item.source} • {item.date}
                </div>
                <p className="text-gray-600 mb-4 text-sm">{item.preview}</p>
                {renderLink(item)}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/blog" className="text-mansablue font-bold hover:underline inline-flex items-center">
            View Complete Media Archive
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MediaGallerySection;
