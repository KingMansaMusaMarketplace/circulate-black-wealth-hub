import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ButtonTestPage: React.FC = () => {
  const [clickedButtons, setClickedButtons] = useState<string[]>([]);

  const handleClick = (variant: string) => {
    setClickedButtons(prev => [...prev, variant]);
    toast.success(`${variant} button clicked!`, {
      description: 'Button is working correctly'
    });
  };

  const buttonVariants = [
    { name: 'Default', variant: 'default' as const },
    { name: 'Destructive', variant: 'destructive' as const },
    { name: 'Outline', variant: 'outline' as const },
    { name: 'Secondary', variant: 'secondary' as const },
    { name: 'Ghost', variant: 'ghost' as const },
    { name: 'Link', variant: 'link' as const },
    { name: 'White', variant: 'white' as const },
    { name: 'Red', variant: 'red' as const },
  ];

  const buttonSizes = [
    { name: 'Default', size: 'default' as const },
    { name: 'Small', size: 'sm' as const },
    { name: 'Large', size: 'lg' as const },
    { name: 'Icon', size: 'icon' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Button Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Test all button variants and ensure visibility" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-mansablue mb-2">Button Visibility Test</h1>
          <p className="text-gray-600">Click each button to verify it's visible and working</p>
        </div>

        {/* Variant Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Button Variants (All text should be clearly visible)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {buttonVariants.map((btn) => (
                <div key={btn.variant} className="space-y-2">
                  <Button
                    variant={btn.variant}
                    onClick={() => handleClick(btn.name)}
                    className="w-full"
                  >
                    {btn.name}
                  </Button>
                  {clickedButtons.includes(btn.name) && (
                    <div className="flex items-center justify-center text-green-600 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Working
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Size Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Button Sizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              {buttonSizes.map((btn) => (
                <Button
                  key={btn.size}
                  size={btn.size}
                  onClick={() => handleClick(btn.name + ' Size')}
                >
                  {btn.size === 'icon' ? '🔍' : btn.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* State Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Button States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Normal</p>
                <Button variant="default" className="w-full">
                  Click Me
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Disabled</p>
                <Button variant="default" disabled className="w-full">
                  Disabled
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Loading</p>
                <Button variant="default" disabled className="w-full">
                  <span className="mr-2">⏳</span>
                  Loading...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buttons on Different Backgrounds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* White Background */}
            <div className="bg-white p-6 rounded-lg border">
              <p className="text-sm font-medium mb-4">White Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="white">White</Button>
              </div>
            </div>

            {/* Dark Background */}
            <div className="bg-mansablue p-6 rounded-lg">
              <p className="text-sm font-medium mb-4 text-white">Dark Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="white">White</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Outline
                </Button>
                <Button variant="secondary">Secondary</Button>
              </div>
            </div>

            {/* Gold Background */}
            <div className="bg-mansagold p-6 rounded-lg">
              <p className="text-sm font-medium mb-4 text-mansablue">Gold Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="white">White</Button>
                <Button variant="outline" className="border-mansablue text-mansablue">
                  Outline
                </Button>
              </div>
            </div>

            {/* Gray Background */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-sm font-medium mb-4">Gray Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {clickedButtons.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold text-green-900">
                    {clickedButtons.length} button(s) tested successfully
                  </p>
                  <p className="text-sm text-green-700">
                    All clicked buttons are functioning correctly and text is visible
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ButtonTestPage;
