
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SponsorshipSuccessStories = () => {
  const stories = [
    {
      company: "Global Financial Partners",
      logo: "https://via.placeholder.com/80x80?text=GFP",
      title: "Empowering Black Entrepreneurs",
      description: "Through our Platinum sponsorship, we've helped fund workshops that provided business development training to over 200 entrepreneurs, resulting in 35 new Black-owned businesses launching within 6 months.",
      quote: "Our partnership with Mansa Musa Marketplace aligns perfectly with our mission to create financial equity in underserved communities. The quantifiable impact has exceeded our expectations.",
      author: "Jennifer Wells",
      role: "Chief Diversity Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      company: "Horizon Technologies",
      logo: "https://via.placeholder.com/80x80?text=HT",
      title: "Tech Access Initiative",
      description: "Our Gold tier sponsorship funded a technology access program that provided digital resources to 150 Black-owned businesses, helping them increase their online visibility and sales by an average of 28%.",
      quote: "The detailed analytics and impact reporting helped us demonstrate to our stakeholders the tangible outcomes of our sponsorship investment.",
      author: "Marcus Thompson",
      role: "VP of Community Relations",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      company: "Unity Investments",
      logo: "https://via.placeholder.com/80x80?text=UI",
      title: "Capital Access Program",
      description: "We worked with Mansa Musa Marketplace to create a special funding pathway that has connected 45 Black business owners with over $1.2M in accessible capital for expansion.",
      quote: "What began as a corporate social responsibility initiative has evolved into a strategic partnership that generates measurable business value while creating community impact.",
      author: "Darius Johnson",
      role: "Director of Impact Investing",
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our corporate partners have made a meaningful impact while achieving their organizational goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <Card key={index} className="border-0 shadow-lg h-full">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={story.logo} 
                    alt={`${story.company} logo`} 
                    className="w-12 h-12 mr-4 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">{story.company}</h3>
                    <p className="text-mansablue">{story.title}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{story.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-10 w-10 border border-gray-200 mr-3">
                      <AvatarImage src={story.image} alt={story.author} />
                      <AvatarFallback className="bg-mansablue text-white">
                        {story.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{story.author}</p>
                      <p className="text-sm text-gray-500">{story.role}</p>
                    </div>
                  </div>
                  <p className="italic text-gray-600 mb-2">"{story.quote}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipSuccessStories;
