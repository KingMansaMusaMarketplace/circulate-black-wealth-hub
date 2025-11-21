
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

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-mansablue/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-mansagold/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-md mb-4 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
            Media & Resources
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-blue-100/90 max-w-2xl mx-auto font-medium">
            Learn more about our work through articles, videos, and resources.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mediaItems.map((item, index) => {
            const gradients = [
              { icon: 'from-emerald-500 to-teal-500', border: 'border-emerald-400/30 hover:border-emerald-400/60', iconBg: 'bg-emerald-500/20' },
              { icon: 'from-rose-500 to-pink-500', border: 'border-rose-400/30 hover:border-rose-400/60', iconBg: 'bg-rose-500/20' },
              { icon: 'from-blue-500 to-cyan-500', border: 'border-blue-400/30 hover:border-blue-400/60', iconBg: 'bg-blue-500/20' },
              { icon: 'from-purple-500 to-fuchsia-500', border: 'border-purple-400/30 hover:border-purple-400/60', iconBg: 'bg-purple-500/20' }
            ];
            const colors = gradients[index % gradients.length];
            
            return (
              <Card 
                key={index} 
                className={`border-2 ${colors.border} bg-slate-800/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-xl ${colors.iconBg} shadow-md`}>
                      <div className={`bg-gradient-to-r ${colors.icon} bg-clip-text`}>
                        {item.icon}
                      </div>
                    </div>
                    <span className={`ml-3 text-sm uppercase font-bold tracking-wider bg-gradient-to-r ${colors.icon} bg-clip-text text-transparent`}>{item.type}</span>
                  </div>
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${colors.icon} bg-clip-text text-transparent mb-2`}>
                    {item.title}
                  </h3>
                  <div className="text-sm text-blue-200/70 mb-4 font-medium">
                    {item.source} • {item.date}
                  </div>
                  <p className="text-blue-100/90 mb-5 text-sm font-medium leading-relaxed">{item.preview}</p>
                  {item.isExternal ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`bg-gradient-to-r ${colors.icon} bg-clip-text text-transparent font-bold text-sm flex items-center hover:scale-110 transition-transform`}
                    >
                      View Full {item.type}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  ) : (
                    <Link 
                      to={item.link} 
                      className={`bg-gradient-to-r ${colors.icon} bg-clip-text text-transparent font-bold text-sm flex items-center hover:scale-110 transition-transform`}
                    >
                      View Full {item.type}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold/90 hover:to-amber-500/90 text-mansablue font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
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
