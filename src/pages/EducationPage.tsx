
import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, TrendingUp, Award } from 'lucide-react';
import WorkshopLibrary from '@/components/education/WorkshopLibrary';
import FinancialLiteracyCenter from '@/components/education/FinancialLiteracyCenter';
import BusinessResourceHub from '@/components/education/BusinessResourceHub';
import CertificationPrograms from '@/components/education/CertificationPrograms';

const EducationPage = () => {
  return (
    <>
      <Helmet>
        <title>Education & Resources - Mansa Musa Marketplace</title>
        <meta name="description" content="Empower yourself with business workshops, financial literacy courses, and educational resources for Black economic empowerment." />
      </Helmet>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-mansablue to-mansablue-dark py-16">
          <div className="container-custom">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Education & Empowerment Center
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Build wealth through knowledge. Access workshops, courses, and resources 
                designed for Black economic empowerment.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-blue-200">Workshops</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">25</div>
                  <div className="text-sm text-blue-200">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100+</div>
                  <div className="text-sm text-blue-200">Resources</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">5K+</div>
                  <div className="text-sm text-blue-200">Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12">
          <div className="container-custom">
            <Tabs defaultValue="workshops" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="workshops" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Workshops</span>
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Financial Literacy</span>
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Business Resources</span>
                </TabsTrigger>
                <TabsTrigger value="certification" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Certifications</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workshops">
                <WorkshopLibrary />
              </TabsContent>

              <TabsContent value="financial">
                <FinancialLiteracyCenter />
              </TabsContent>

              <TabsContent value="business">
                <BusinessResourceHub />
              </TabsContent>

              <TabsContent value="certification">
                <CertificationPrograms />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
};

export default EducationPage;
