import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Shapes, Frame } from 'lucide-react';

export interface QRCustomization {
  colorDark: string;
  colorLight: string;
  logoSize: number;
  cornerStyle: 'square' | 'rounded' | 'dots';
  frameStyle: 'none' | 'simple' | 'rounded' | 'banner';
}

interface QRCodeCustomizerProps {
  customization: QRCustomization;
  onChange: (customization: QRCustomization) => void;
}

export const QRCodeCustomizer: React.FC<QRCodeCustomizerProps> = ({ 
  customization, 
  onChange 
}) => {
  const presetColors = [
    { name: 'Classic', dark: '#000000', light: '#FFFFFF' },
    { name: 'Brand Blue', dark: '#003F7F', light: '#F0F9FF' },
    { name: 'Gold', dark: '#D4AF37', light: '#FFF9E6' },
    { name: 'Forest', dark: '#0F4C3A', light: '#ECFDF5' },
    { name: 'Royal Purple', dark: '#5B21B6', light: '#FAF5FF' },
    { name: 'Sunset', dark: '#EA580C', light: '#FFF7ED' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Customize QR Code Style
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Presets */}
        <div className="space-y-3">
          <Label>Color Themes</Label>
          <div className="grid grid-cols-3 gap-2">
            {presetColors.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onChange({ 
                  ...customization, 
                  colorDark: preset.dark, 
                  colorLight: preset.light 
                })}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  customization.colorDark === preset.dark 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border'
                }`}
              >
                <div className="flex gap-1 mb-1">
                  <div 
                    className="h-6 w-6 rounded-sm" 
                    style={{ backgroundColor: preset.dark }}
                  />
                  <div 
                    className="h-6 w-6 rounded-sm border" 
                    style={{ backgroundColor: preset.light }}
                  />
                </div>
                <p className="text-xs font-medium">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Dark Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customization.colorDark}
                onChange={(e) => onChange({ ...customization, colorDark: e.target.value })}
                className="h-10 w-full cursor-pointer rounded border"
              />
              <input
                type="text"
                value={customization.colorDark}
                onChange={(e) => onChange({ ...customization, colorDark: e.target.value })}
                className="h-10 w-24 rounded border px-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Light Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customization.colorLight}
                onChange={(e) => onChange({ ...customization, colorLight: e.target.value })}
                className="h-10 w-full cursor-pointer rounded border"
              />
              <input
                type="text"
                value={customization.colorLight}
                onChange={(e) => onChange({ ...customization, colorLight: e.target.value })}
                className="h-10 w-24 rounded border px-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Logo Size */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Logo Size</Label>
            <span className="text-sm text-muted-foreground">{customization.logoSize}%</span>
          </div>
          <Slider
            value={[customization.logoSize]}
            onValueChange={([value]) => onChange({ ...customization, logoSize: value })}
            min={15}
            max={35}
            step={5}
            className="w-full"
          />
        </div>

        {/* Corner Style */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Shapes className="h-4 w-4" />
            Corner Style
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(['square', 'rounded', 'dots'] as const).map((style) => (
              <button
                key={style}
                onClick={() => onChange({ ...customization, cornerStyle: style })}
                className={`p-3 rounded-lg border-2 capitalize transition-all hover:scale-105 ${
                  customization.cornerStyle === style 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Frame Style */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Frame className="h-4 w-4" />
            Frame Style
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {(['none', 'simple', 'rounded', 'banner'] as const).map((style) => (
              <button
                key={style}
                onClick={() => onChange({ ...customization, frameStyle: style })}
                className={`p-3 rounded-lg border-2 capitalize transition-all hover:scale-105 ${
                  customization.frameStyle === style 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
