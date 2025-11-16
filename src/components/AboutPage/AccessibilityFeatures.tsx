
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accessibility, 
  Type, 
  Contrast, 
  Languages, 
  MousePointer, 
  Save
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AccessibilityFeatures = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text');
  const [settings, setSettings] = useState({
    fontSize: 100, // percentage
    lineSpacing: 100, // percentage
    contrast: "default", // default, high, low
    screenReader: false,
    keyboardNavigation: false,
    reducedMotion: false,
    language: "english"
  });
  
  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const saveSettings = () => {
    // This would save to user preferences
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your accessibility preferences have been updated",
    });
  };
  
  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      lineSpacing: 100,
      contrast: "default",
      screenReader: false,
      keyboardNavigation: false,
      reducedMotion: false,
      language: "english"
    });
    localStorage.removeItem('accessibilitySettings');
    toast({
      title: "Settings reset",
      description: "Your accessibility preferences have been reset to default",
    });
  };

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Accessibility Options</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Accessibility className="h-5 w-5 text-mansagold" />
            <p className="text-lg font-medium text-mansablue-dark">Making Our Platform Inclusive For All</p>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to ensuring everyone can use our platform comfortably. Customize your experience with these settings.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Accessibility className="mr-2 h-5 w-5" />
                Accessibility Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <span className="hidden sm:inline">Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="display" className="flex items-center gap-2">
                    <Contrast className="h-4 w-4" />
                    <span className="hidden sm:inline">Display</span>
                  </TabsTrigger>
                  <TabsTrigger value="navigation" className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4" />
                    <span className="hidden sm:inline">Navigation</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Font Size ({settings.fontSize}%)</Label>
                        <span className="text-sm text-gray-500">
                          {settings.fontSize < 100 ? 'Smaller' : settings.fontSize > 100 ? 'Larger' : 'Default'}
                        </span>
                      </div>
                      <Slider
                        min={75}
                        max={200}
                        step={5}
                        value={[settings.fontSize]}
                        onValueChange={(value) => handleSettingChange('fontSize', value[0])}
                      />
                      <div className="mt-4">
                        <p 
                          className="p-3 border rounded-md" 
                          style={{ fontSize: `${settings.fontSize}%` }}
                        >
                          This is a preview of your selected font size.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Line Spacing ({settings.lineSpacing}%)</Label>
                        <span className="text-sm text-gray-500">
                          {settings.lineSpacing < 100 ? 'Compact' : settings.lineSpacing > 100 ? 'Spacious' : 'Default'}
                        </span>
                      </div>
                      <Slider
                        min={90}
                        max={200}
                        step={10}
                        value={[settings.lineSpacing]}
                        onValueChange={(value) => handleSettingChange('lineSpacing', value[0])}
                      />
                      <div className="mt-4">
                        <p 
                          className="p-3 border rounded-md" 
                          style={{ 
                            lineHeight: `${settings.lineSpacing}%`,
                            fontSize: `${settings.fontSize}%`
                          }}
                        >
                          This is a preview of your selected line spacing. The text will appear with more or less space between lines based on your preference. This can help with readability, especially for those with dyslexia or visual impairments.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="arabic">Arabic</option>
                        <option value="chinese">Chinese (Simplified)</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="display">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Color Contrast</Label>
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <button
                          className={`p-4 border rounded-md flex flex-col items-center space-y-2 ${settings.contrast === 'default' ? 'ring-2 ring-mansablue' : ''}`}
                          onClick={() => handleSettingChange('contrast', 'default')}
                        >
                          <div className="w-full h-10 bg-white border"></div>
                          <span className="text-sm">Default</span>
                        </button>
                        
                        <button
                          className={`p-4 border rounded-md flex flex-col items-center space-y-2 ${settings.contrast === 'high' ? 'ring-2 ring-mansablue' : ''}`}
                          onClick={() => handleSettingChange('contrast', 'high')}
                        >
                          <div className="w-full h-10 bg-black"></div>
                          <span className="text-sm">High Contrast</span>
                        </button>
                        
                        <button
                          className={`p-4 border rounded-md flex flex-col items-center space-y-2 ${settings.contrast === 'low' ? 'ring-2 ring-mansablue' : ''}`}
                          onClick={() => handleSettingChange('contrast', 'low')}
                        >
                          <div className="w-full h-10 bg-gray-100"></div>
                          <span className="text-sm">Low Contrast</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduced-motion">Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations and transitions
                        </p>
                      </div>
                      <Switch
                        id="reduced-motion"
                        checked={settings.reducedMotion}
                        onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="navigation">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="screen-reader">Screen Reader Compatibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Enhance compatibility with screen readers
                        </p>
                      </div>
                      <Switch
                        id="screen-reader"
                        checked={settings.screenReader}
                        onCheckedChange={(checked) => handleSettingChange('screenReader', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="keyboard-navigation">Keyboard Navigation</Label>
                        <p className="text-sm text-muted-foreground">
                          Improved focus indicators and keyboard shortcuts
                        </p>
                      </div>
                      <Switch
                        id="keyboard-navigation"
                        checked={settings.keyboardNavigation}
                        onCheckedChange={(checked) => handleSettingChange('keyboardNavigation', checked)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between mt-8 pt-4 border-t">
                <Button variant="outline" onClick={resetSettings}>
                  Reset to Default
                </Button>
                <Button 
                  className="bg-mansablue hover:bg-mansablue-dark text-white"
                  onClick={saveSettings}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              We are continuously working to improve our accessibility features. If you have suggestions or encounter any issues, please{" "}
              <Link to="/contact" className="text-mansablue hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessibilityFeatures;
