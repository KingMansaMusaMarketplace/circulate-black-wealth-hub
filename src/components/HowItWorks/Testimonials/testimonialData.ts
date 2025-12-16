
export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  image: string;
  rating: number;
}

// Real testimonials will be loaded from the database
export const testimonials: Testimonial[] = [];
