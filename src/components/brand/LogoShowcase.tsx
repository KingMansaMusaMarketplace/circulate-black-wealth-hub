
import React from 'react';
import MansaMusaLogo from './MansaMusaLogo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LogoShowcase = () => {
  const logoVariants = [
    { name: 'Default', variant: 'default', description: 'Modern MM with crown and circulation symbol' },
    { name: 'Royal Crown', variant: 'crown', description: 'Elegant crown symbolizing Mansa Musa\'s wealth' },
    { name: 'Gold Coins', variant: 'coins', description: 'Coins representing wealth circulation' },
    { name: 'Silhouette', variant: 'silhouette', description: 'Mansa Musa silhouette with Mali map' },
    { name: 'Interlocking', variant: 'interlocking', description: 'Interlocking Ms representing connectivity' }
  ] as const;

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-mansablue mb-4">Mansa Musa Marketplace Logo Concepts</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Each concept captures a different aspect of Mansa Musa's legacy and the marketplace's mission 
          to circulate Black wealth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logoVariants.map((logo) => (
          <Card key={logo.variant} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-mansablue/10 to-mansablue/5">
              <CardTitle className="text-xl text-mansablue">{logo.name}</CardTitle>
              <CardDescription>{logo.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-8 bg-white">
              <div className="flex flex-col items-center">
                <MansaMusaLogo variant={logo.variant as any} size="xl" />
                <div className="mt-6 flex space-x-4">
                  <MansaMusaLogo variant={logo.variant as any} size="sm" />
                  <MansaMusaLogo variant={logo.variant as any} size="md" />
                  <MansaMusaLogo variant={logo.variant as any} size="lg" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-mansagold/10 to-mansagold/5 flex justify-center">
              <div className="text-sm text-gray-500">Available in various sizes</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LogoShowcase;
