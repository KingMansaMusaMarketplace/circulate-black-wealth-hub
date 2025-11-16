import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Sparkles, Palette, Layers, Activity } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <Helmet>
        <title>Button Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Test all button variants and ensure visibility" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-full p-6 shadow-2xl animate-pulse border-4 border-white/30">
              <Sparkles className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
            Button Visibility Test
          </h1>
          <p className="text-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Click each button to verify it's visible and working
          </p>
        </div>

        {/* Variant Test */}
        <Card className="mb-8 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/30 dark:to-pink-900/30 border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Button Variants (All text should be clearly visible)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {buttonVariants.map((btn) => (
                <div key={btn.variant} className="space-y-2">
                  <Button
                    variant={btn.variant}
                    onClick={() => handleClick(btn.name)}
                    className="w-full hover:scale-105 transition-transform shadow-lg"
                  >
                    {btn.name}
                  </Button>
                  {clickedButtons.includes(btn.name) && (
                    <div className="flex items-center justify-center text-green-600 text-xs font-bold animate-fade-in">
                      <CheckCircle2 className="h-4 w-4 mr-1 animate-pulse" />
                      ✅ Working
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Size Test */}
        <Card className="mb-8 bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-blue-900/30 dark:to-cyan-900/30 border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Button Sizes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              {buttonSizes.map((btn) => (
                <Button
                  key={btn.size}
                  size={btn.size}
                  onClick={() => handleClick(btn.name + ' Size')}
                  className="hover:scale-110 transition-transform shadow-lg"
                >
                  {btn.size === 'icon' ? '🔍' : btn.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* State Test */}
        <Card className="mb-8 bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-gray-800 dark:via-green-900/30 dark:to-emerald-900/30 border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Button States
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 p-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-transparent rounded-xl border-2 border-green-200/50">
                <p className="text-sm font-bold text-green-700 dark:text-green-400">✅ Normal</p>
                <Button variant="default" className="w-full shadow-lg hover:scale-105 transition-transform">
                  Click Me
                </Button>
              </div>
              <div className="space-y-2 p-4 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900/20 dark:to-transparent rounded-xl border-2 border-gray-200/50">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-400">🚫 Disabled</p>
                <Button variant="default" disabled className="w-full shadow-lg">
                  Disabled
                </Button>
              </div>
              <div className="space-y-2 p-4 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-transparent rounded-xl border-2 border-blue-200/50">
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">⏳ Loading</p>
                <Button variant="default" disabled className="w-full shadow-lg">
                  <span className="mr-2 animate-pulse">⏳</span>
                  Loading...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Test */}
        <Card className="mb-8 bg-gradient-to-br from-white via-orange-50 to-pink-50 dark:from-gray-800 dark:via-orange-900/30 dark:to-pink-900/30 border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] transition-all group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-orange-600 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Buttons on Different Backgrounds
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* White Background */}
            <div className="bg-white p-6 rounded-xl border-2 border-purple-200 shadow-lg">
              <p className="text-sm font-bold mb-4 text-purple-600">🤍 White Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" className="shadow-md hover:scale-105 transition-transform">Default</Button>
                <Button variant="outline" className="shadow-md hover:scale-105 transition-transform">Outline</Button>
                <Button variant="white" className="shadow-md hover:scale-105 transition-transform">White</Button>
              </div>
            </div>

            {/* Dark Background */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-xl">
              <p className="text-sm font-bold mb-4 text-white">🌙 Dark Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="white" className="shadow-md hover:scale-105 transition-transform">White</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 shadow-md hover:scale-105 transition-transform">
                  Outline
                </Button>
                <Button variant="secondary" className="shadow-md hover:scale-105 transition-transform">Secondary</Button>
              </div>
            </div>

            {/* Gold Background */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl shadow-xl">
              <p className="text-sm font-bold mb-4 text-orange-900">✨ Gold Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" className="shadow-md hover:scale-105 transition-transform">Default</Button>
                <Button variant="white" className="shadow-md hover:scale-105 transition-transform">White</Button>
                <Button variant="outline" className="border-orange-900 text-orange-900 shadow-md hover:scale-105 transition-transform">
                  Outline
                </Button>
              </div>
            </div>

            {/* Gray Background */}
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-6 rounded-xl shadow-lg">
              <p className="text-sm font-bold mb-4 text-gray-800">⚪ Gray Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" className="shadow-md hover:scale-105 transition-transform">Default</Button>
                <Button variant="secondary" className="shadow-md hover:scale-105 transition-transform">Secondary</Button>
                <Button variant="ghost" className="shadow-md hover:scale-105 transition-transform">Ghost</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {clickedButtons.length > 0 && (
          <Card className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-teal-900/40 border-0 shadow-2xl animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg animate-pulse">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-2xl bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
                    🎉 {clickedButtons.length} button(s) tested successfully
                  </p>
                  <p className="text-base font-medium text-green-700 dark:text-green-300">
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
