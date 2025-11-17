
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
          className="text-blue-600 font-bold text-sm flex items-center hover:scale-110 transition-transform"
        >
          {linkText}
          {linkIcon}
        </a>
      );
    } else {
      return (
        <Link 
          to={item.link} 
          className="text-blue-600 font-bold text-sm flex items-center hover:scale-110 transition-transform"
        >
          {linkText}
          {linkIcon}
        </Link>
      );
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-mansablue-light/10 to-amber-50 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-mansablue/15 to-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-mansagold/15 to-amber-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4">
            <span className="bg-gradient-to-r from-mansablue via-blue-600 to-blue-700 bg-clip-text text-transparent">Media & </span>
            <span className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 bg-clip-text text-transparent">Resources</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-2xl mx-auto font-medium">
            Learn more about our work through articles, videos, and resources.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mediaItems.map((item, index) => {
            const gradients = [
              { icon: 'from-emerald-600 to-teal-600', border: 'emerald-300', bg: 'from-emerald-50 to-teal-50' },
              { icon: 'from-rose-600 to-pink-600', border: 'rose-300', bg: 'from-rose-50 to-pink-50' },
              { icon: 'from-blue-600 to-cyan-600', border: 'blue-300', bg: 'from-blue-50 to-cyan-50' },
              { icon: 'from-purple-600 to-fuchsia-600', border: 'purple-300', bg: 'from-purple-50 to-fuchsia-50' }
            ];
            const colors = gradients[index % gradients.length];
            
            return (
              <Card 
                key={index} 
                className={`border-2 border-${colors.border} bg-white/80 backdrop-blur-sm card-hover hover:shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-6">
                  <div className={`flex items-center mb-4 bg-gradient-to-r ${colors.icon} bg-clip-text text-transparent`}>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${colors.bg} shadow-md`}>
                      {item.icon}
                    </div>
                    <span className="ml-3 text-sm uppercase font-bold tracking-wider">{item.type}</span>
                  </div>
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${colors.icon} bg-clip-text text-transparent mb-2`}>
                    {item.title}
                  </h3>
                  <div className="text-sm text-gray-600 mb-4 font-medium">
                    {item.source} • {item.date}
                  </div>
                  <p className="text-gray-700 mb-5 text-sm font-medium leading-relaxed">{item.preview}</p>
                  {renderLink(item)}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
          >
            View Complete Media Archive
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MediaGallerySection;
