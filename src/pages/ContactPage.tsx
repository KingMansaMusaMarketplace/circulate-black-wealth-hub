
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/AboutPage/ContactSection';

const ContactPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Contact Us - Mansa Musa Marketplace</title>
        <meta name="description" content="Get in touch with the Mansa Musa Marketplace team. We're here to answer your questions and help you get started." />
      </Helmet>

      <Navbar />
      <main className="flex-grow">
        <div className="bg-mansablue py-16">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              Have questions or feedback? We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
