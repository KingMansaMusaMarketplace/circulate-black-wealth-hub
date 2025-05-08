
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Utensils, Scissors, Book, DollarSign } from 'lucide-react';

const FeaturedBusinesses = () => {
  const businesses = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      category: "Restaurant",
      discount: "15% off",
      rating: 4.8,
      reviewCount: 124,
      description: "Authentic soul food with family recipes passed down generations.",
      icon: <Utensils className="w-6 h-6 text-mansablue" />,
      imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2070&auto=format&fit=crop",
      imageAlt: "Delicious soul food with chicken, cornbread, and vegetables"
    },
    {
      id: 2,
      name: "Prestigious Cuts",
      category: "Barber Shop",
      discount: "10% off",
      rating: 4.9,
      reviewCount: 207,
      description: "Premium barbershop experience with skilled professionals.",
      icon: <Scissors className="w-6 h-6 text-mansablue" />,
      imageUrl: "https://images.unsplash.com/photo-1599981526814-61649765e2f8?q=80&w=1887&auto=format&fit=crop",
      imageAlt: "Young Black boy getting a haircut at a barber shop"
    },
    {
      id: 3,
      name: "Heritage Bookstore",
      category: "Retail",
      discount: "20% off",
      rating: 4.7,
      reviewCount: 89,
      description: "Curated selection of books celebrating Black culture and history.",
      icon: <Book className="w-6 h-6 text-mansablue" />,
      imageUrl: "https://images.unsplash.com/photo-1521056787327-965a34d83af7?q=80&w=2070&auto=format&fit=crop",
      imageAlt: "Bookstore with shelves full of diverse books"
    },
    {
      id: 4,
      name: "Prosperity Financial",
      category: "Services",
      discount: "Free Consultation",
      rating: 4.9,
      reviewCount: 56,
      description: "Financial planning services focused on building generational wealth.",
      icon: <DollarSign className="w-6 h-6 text-mansablue" />,
      imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=5304&auto=format&fit=crop",
      imageAlt: "Black financial advisor in professional meeting setting"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-12">
          <h2 className="heading-md text-mansablue-dark">Featured Black-Owned Businesses</h2>
          <Link to="/directory" className="text-mansablue font-medium hover:text-mansablue-dark transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((business) => (
            <div key={business.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden card-hover">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img 
                  src={business.imageUrl} 
                  alt={business.imageAlt}
                  width="400"
                  height="300"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.error(`Failed to load image: ${business.imageUrl}`);
                    e.currentTarget.src = `https://placehold.co/400x300/e0e0e0/808080?text=${business.name.charAt(0)}`;
                  }}
                />
                <div className="absolute top-3 left-3 bg-white/90 p-2 rounded-full shadow">
                  {business.icon}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{business.name}</h3>
                    <p className="text-gray-500 text-sm">{business.category}</p>
                  </div>
                  <span className="bg-mansagold/10 text-mansagold text-xs font-medium px-2.5 py-1 rounded">
                    {business.discount}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {business.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex text-mansagold">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(business.rating) ? 'text-mansagold' : 'text-gray-300'}`} 
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-500">{business.rating} ({business.reviewCount})</p>
                  </div>
                  <Link to={`/business/${business.id}`} className="text-sm font-medium text-mansablue hover:text-mansablue-dark">
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Link to="/directory">
            <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-8 py-2">
              Discover More Businesses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
