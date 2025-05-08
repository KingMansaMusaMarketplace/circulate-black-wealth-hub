export interface Business {
  id: number;
  name: string;
  category: string;
  discount: string;
  discountValue: number;
  rating: number;
  reviewCount: number;
  distance: string;
  distanceValue: number;
  address: string;
  lat: number;
  lng: number;
  isFeatured?: boolean;
  imageUrl?: string;
  imageAlt?: string;
}

export const businesses: Business[] = [
  {
    id: 1,
    name: "Soul Food Kitchen",
    category: "Restaurant",
    discount: "15% off",
    discountValue: 15,
    rating: 4.8,
    reviewCount: 124,
    distance: "0.5",
    distanceValue: 0.5,
    address: "123 Main St, Atlanta, GA",
    lat: 33.748997,
    lng: -84.387985,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Delicious soul food with chicken, cornbread, and vegetables"
  },
  {
    id: 2,
    name: "Prestigious Cuts",
    category: "Barber Shop",
    discount: "10% off",
    discountValue: 10,
    rating: 4.9,
    reviewCount: 207,
    distance: "0.7",
    distanceValue: 0.7,
    address: "456 Oak Ave, Atlanta, GA",
    lat: 33.749568,
    lng: -84.391256,
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Interior of a modern Black barber shop with barber chairs and stylish decor"
  },
  {
    id: 3,
    name: "Heritage Bookstore",
    category: "Retail",
    discount: "20% off",
    discountValue: 20,
    rating: 4.7,
    reviewCount: 89,
    distance: "1.2",
    distanceValue: 1.2,
    address: "789 Elm St, Atlanta, GA",
    lat: 33.751234,
    lng: -84.384562,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    imageAlt: "Interior of a cozy bookstore with wooden shelves full of books"
  },
  {
    id: 4,
    name: "Prosperity Financial",
    category: "Services",
    discount: "Free Consultation",
    discountValue: 0,
    rating: 4.9,
    reviewCount: 56,
    distance: "1.5",
    distanceValue: 1.5,
    address: "321 Pine Rd, Atlanta, GA",
    lat: 33.753421,
    lng: -84.389754,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Two Black financial advisors in professional suits discussing business plans in an office"
  },
  {
    id: 5,
    name: "Ebony Crafts",
    category: "Retail",
    discount: "15% off",
    discountValue: 15,
    rating: 4.6,
    reviewCount: 42,
    distance: "1.8",
    distanceValue: 1.8,
    address: "567 Maple Dr, Atlanta, GA",
    lat: 33.746125,
    lng: -84.382369,
    imageUrl: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Handcrafted African-inspired art and crafts"
  },
  {
    id: 6,
    name: "Glorious Hair Salon",
    category: "Beauty",
    discount: "20% off first visit",
    discountValue: 20,
    rating: 4.8,
    reviewCount: 112,
    distance: "2.0",
    distanceValue: 2.0,
    address: "890 Cedar Ln, Atlanta, GA",
    lat: 33.742587,
    lng: -84.386541,
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
    imageAlt: "Black barber shop with clients and stylists in a professional salon setting"
  },
  {
    id: 7,
    name: "Royal Apparel",
    category: "Fashion",
    discount: "10% off",
    discountValue: 10,
    rating: 4.5,
    reviewCount: 78,
    distance: "2.2",
    distanceValue: 2.2,
    address: "432 Birch St, Atlanta, GA",
    lat: 33.759123,
    lng: -84.392587,
    imageUrl: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=2013&auto=format&fit=crop",
    imageAlt: "African-inspired clothing and fashion accessories"
  },
  {
    id: 8,
    name: "Ancestral Art Gallery",
    category: "Arts",
    discount: "15% off",
    discountValue: 15,
    rating: 4.9,
    reviewCount: 35,
    distance: "2.5",
    distanceValue: 2.5,
    address: "654 Walnut Ave, Atlanta, GA",
    lat: 33.747851,
    lng: -84.397456,
    imageUrl: "https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Gallery displaying African and African-American artwork"
  }
];
