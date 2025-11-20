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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Helmet>
        <title>Button Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Test all button variants and ensure visibility" />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-yellow-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500 via-yellow-500 to-purple-500 rounded-full p-6 shadow-2xl border-4 border-white/30">
                <Sparkles className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            Button Visibility Test
          </h1>
          <p className="text-lg font-medium text-white/80">
            Click each button to verify it's visible and working
          </p>
        </div>

        {/* Variant Test */}
        <Card className="mb-8 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="text-white">
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
                    <div className="flex items-center justify-center text-green-400 text-xs font-bold animate-fade-in">
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
        <Card className="mb-8 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-all group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <span className="text-white">
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
        <Card className="mb-8 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-white">
                Button States
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 p-4 bg-slate-800/50 backdrop-blur rounded-xl border-2 border-white/10">
                <p className="text-sm font-bold text-green-400">✅ Normal</p>
                <Button variant="default" className="w-full shadow-lg hover:scale-105 transition-transform">
                  Click Me
                </Button>
              </div>
              <div className="space-y-2 p-4 bg-slate-800/50 backdrop-blur rounded-xl border-2 border-white/10">
                <p className="text-sm font-bold text-gray-400">🚫 Disabled</p>
                <Button variant="default" disabled className="w-full shadow-lg">
                  Disabled
                </Button>
              </div>
              <div className="space-y-2 p-4 bg-slate-800/50 backdrop-blur rounded-xl border-2 border-white/10">
                <p className="text-sm font-bold text-blue-400">⏳ Loading</p>
                <Button variant="default" disabled className="w-full shadow-lg">
                  <span className="mr-2 animate-pulse">⏳</span>
                  Loading...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Test */}
        <Card className="mb-8 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-all group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-white">
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
            <div className="bg-gradient-to-br from-blue-600 to-slate-800 p-6 rounded-xl shadow-xl">
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
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-xl shadow-xl">
              <p className="text-sm font-bold mb-4 text-yellow-900">✨ Gold Background</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" className="shadow-md hover:scale-105 transition-transform">Default</Button>
                <Button variant="white" className="shadow-md hover:scale-105 transition-transform">White</Button>
                <Button variant="outline" className="border-yellow-900 text-yellow-900 shadow-md hover:scale-105 transition-transform">
                  Outline
                </Button>
              </div>
            </div>

            {/* Gray Background */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-xl shadow-lg">
              <p className="text-sm font-bold mb-4 text-white">⚪ Gray Background</p>
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
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg animate-pulse">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-white mb-2">
                    🎉 {clickedButtons.length} button(s) tested successfully
                  </p>
                  <p className="text-base font-medium text-green-400">
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
