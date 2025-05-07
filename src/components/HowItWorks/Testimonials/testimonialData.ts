
export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  image: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    quote: "I discovered 10 new Black-owned businesses in my city within a week! Mansa Musa Marketplace makes it so easy to support and save.",
    author: "Jasmine Williams",
    title: "Early Beta Tester",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsYWNrJTIwbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    rating: 5
  },
  {
    quote: "As a business owner, I gained 25 new customers the first month. Best $100/month I've ever spent.",
    author: "Marcus Johnson",
    title: "Business Beta Partner",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsYWNrJTIwd29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    rating: 5
  },
  {
    quote: "The loyalty points system keeps me coming back. I'm supporting my community AND saving money.",
    author: "Tasha Robinson",
    title: "Marketplace Member",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmxhY2slMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    rating: 5
  }
];
