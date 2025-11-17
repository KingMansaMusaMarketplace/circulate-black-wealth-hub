
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, inquiryType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    });
    setIsSubmitted(false);
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50 to-amber-50 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-xl font-bold bg-gradient-to-r from-mansablue to-blue-700 bg-clip-text text-transparent mb-6">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="inquiryType" className="text-sm font-medium">
                      Inquiry Type
                    </label>
                    <Select 
                      value={formData.inquiryType} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="business">Business Partnership</SelectItem>
                        <SelectItem value="vendor">Become a Vendor</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please provide details about your inquiry..."
                    rows={5}
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-mansablue to-blue-700 bg-clip-text text-transparent mb-3">Thank You!</h3>
              <p className="text-gray-700 mb-8 max-w-md mx-auto">
                Your message has been sent successfully. We'll review it and get back to you soon.
              </p>
              <Button 
                onClick={resetForm}
                className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Send Another Message
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-8 border-t-2 border-violet-200">
          <h4 className="font-bold bg-gradient-to-r from-mansablue to-blue-700 bg-clip-text text-transparent mb-4">Our Location</h4>
          <div className="bg-gray-200 h-64 rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2986.4741266009594!2d-87.6295312!3d41.5564442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e3435f0f954db%3A0x6fb88912e6fac68!2s1000%20E%20111th%20St%20%231100%2C%20Chicago%2C%20IL%2060628!5e0!3m2!1sen!2sus!4v1683910944259!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mansa Musa Marketplace Office Location"
            ></iframe>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
