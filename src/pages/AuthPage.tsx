import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, Users, GraduationCap, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCapacitor } from '@/hooks/use-capacitor';
import { BiometricLogin } from '@/components/auth/BiometricLogin';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { Separator } from '@/components/ui/separator';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const { platform } = useCapacitor();
  const { enableBiometric, isAvailable: isBiometricAvailable } = useBiometricAuth();
  
  // Detect if running on iOS
  const isIOS = platform === 'ios';

  // Get signup type from URL params - force customer on iOS
  const signupType = isIOS ? 'customer' : (searchParams.get('type') || 'customer');
  const businessTier = searchParams.get('tier');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: signupType,
    businessName: '',
    businessCategory: '',
    phone: '',
    isHbcuMember: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
          });
          
          // Enable biometric for future logins if available
          if (isBiometricAvailable) {
            await enableBiometric(formData.email);
          }
          
          navigate('/');
        }
      } else {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (formData.userType === 'business' && !formData.businessName) {
          toast({
            title: "Business Name Required",
            description: "Please enter your business name.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const userData = {
          full_name: formData.fullName,
          user_type: formData.userType,
          ...(formData.userType === 'business' && {
            business_name: formData.businessName,
            business_category: formData.businessCategory,
          }),
          phone: formData.phone,
          is_hbcu_member: formData.isHbcuMember,
        };

        const { error } = await signUp(formData.email, formData.password, userData);
        
        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to Mansa Musa Marketplace! Check your email to verify your account.",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Modern dark gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="border border-white/20 bg-slate-700/30 text-white hover:bg-slate-700/50 hover:border-mansablue/50 transition-all duration-300 shadow-lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Phase 1 Free Banner */}
        <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Badge className="bg-gradient-to-r from-mansagold via-amber-500 to-mansagold text-slate-900 px-6 py-3 text-sm font-bold rounded-full shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] transition-all duration-300 hover:scale-105">
            🎉 Customers ALWAYS FREE! Businesses FREE Until March 2026!
          </Badge>
        </div>

        <Card className="group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/10 overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Animated glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-mansablue via-mansagold to-mansablue rounded-lg blur-xl opacity-0 group-hover:opacity-75 transition duration-1000 animate-pulse" />
          
          {/* Colorful top border with shimmer */}
          <div className="h-1 bg-gradient-to-r from-mansablue via-mansagold to-mansablue bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]"></div>
          
          <CardHeader className="text-center relative z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-mansablue/5 to-mansagold/5 -z-10"></div>
            <CardTitle className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-300 via-white to-amber-300 bg-clip-text mb-3">
              {isLogin ? 'Welcome Back' : 'Join the Movement'}
            </CardTitle>
            <CardDescription className="text-lg text-slate-300 font-medium">
              {isLogin 
                ? 'Sign in to your Mansa Musa Marketplace account'
                : 'Create your FREE account and start building community wealth'
              }
            </CardDescription>
            
            {!isLogin && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {formData.userType === 'customer' && (
                  <Badge className="bg-gradient-to-r from-mansagold to-amber-600 text-slate-900 px-3 py-1.5 shadow-lg shadow-mansagold/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Users className="h-3 w-3 mr-1" />
                    Customer Account
                  </Badge>
                )}
                {formData.userType === 'business' && (
                  <Badge className="bg-gradient-to-r from-mansablue to-blue-600 text-white px-3 py-1.5 shadow-lg shadow-mansablue/30 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Building2 className="h-3 w-3 mr-1" />
                    Business Account
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-200 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-mansablue to-blue-600"></span>
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                      className="bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansablue/50 focus:ring-2 focus:ring-mansablue/20"
                    />
                  </div>

                  {!isIOS && (
                    <div className="space-y-2">
                      <Label htmlFor="userType" className="text-slate-200 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-mansagold to-amber-600"></span>
                        Account Type
                      </Label>
                      <Select 
                        value={formData.userType} 
                        onValueChange={(value) => handleInputChange('userType', value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-white/10 text-white focus:border-mansagold/50">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                          <SelectItem value="customer" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-mansagold" />
                              Customer - Browse & Shop
                            </div>
                          </SelectItem>
                          <SelectItem value="business" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2 text-mansablue" />
                              Business - List Your Business
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.userType === 'business' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="businessName" className="text-slate-200 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-mansablue to-blue-600"></span>
                          Business Name
                        </Label>
                        <Input
                          id="businessName"
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          required
                          className="bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansablue/50 focus:ring-2 focus:ring-mansablue/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessCategory" className="text-slate-200 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-mansablue"></span>
                          Business Category
                        </Label>
                        <Select 
                          value={formData.businessCategory} 
                          onValueChange={(value) => handleInputChange('businessCategory', value)}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-white/10 text-white focus:border-mansablue/50">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/10">
                            <SelectItem value="Food & Dining" className="text-white hover:bg-slate-700 focus:bg-slate-700">Food & Dining</SelectItem>
                            <SelectItem value="Beauty & Wellness" className="text-white hover:bg-slate-700 focus:bg-slate-700">Beauty & Wellness</SelectItem>
                            <SelectItem value="Health & Fitness" className="text-white hover:bg-slate-700 focus:bg-slate-700">Health & Fitness</SelectItem>
                            <SelectItem value="Professional Services" className="text-white hover:bg-slate-700 focus:bg-slate-700">Professional Services</SelectItem>
                            <SelectItem value="Retail & Shopping" className="text-white hover:bg-slate-700 focus:bg-slate-700">Retail & Shopping</SelectItem>
                            <SelectItem value="Art & Entertainment" className="text-white hover:bg-slate-700 focus:bg-slate-700">Art & Entertainment</SelectItem>
                            <SelectItem value="Education" className="text-white hover:bg-slate-700 focus:bg-slate-700">Education</SelectItem>
                            <SelectItem value="Technology" className="text-white hover:bg-slate-700 focus:bg-slate-700">Technology</SelectItem>
                            <SelectItem value="Transportation" className="text-white hover:bg-slate-700 focus:bg-slate-700">Transportation</SelectItem>
                            <SelectItem value="Finance" className="text-white hover:bg-slate-700 focus:bg-slate-700">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-200 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-600 to-mansagold"></span>
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansagold/50 focus:ring-2 focus:ring-mansagold/20"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-mansablue"></span>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansablue/50 focus:ring-2 focus:ring-mansablue/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-mansagold to-amber-500"></span>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansagold/50 focus:ring-2 focus:ring-mansagold/20"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-200 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-mansagold"></span>
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      className="bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansagold/50 focus:ring-2 focus:ring-mansagold/20"
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-mansagold/20 to-amber-600/20 rounded-lg border border-mansagold/30">
                    <Checkbox
                      id="hbcuMember"
                      checked={formData.isHbcuMember}
                      onCheckedChange={(checked) => handleInputChange('isHbcuMember', checked as boolean)}
                      className="border border-mansagold data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-mansagold data-[state=checked]:to-amber-600"
                    />
                    <Label htmlFor="hbcuMember" className="text-sm font-semibold text-white cursor-pointer">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-mansagold" />
                        I'm an HBCU student/alumni (Extra rewards! 🎓)
                      </div>
                    </Label>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full relative bg-gradient-to-r from-mansablue via-blue-600 to-mansagold hover:from-mansablue hover:via-blue-700 hover:to-mansagold text-white font-bold py-6 text-lg shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] transition-all duration-500 hover:scale-[1.02] overflow-hidden group before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLogin ? 'Sign In' : 'Create FREE Account'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-medium text-transparent bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text hover:from-blue-300 hover:to-amber-300 transition-all duration-300"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>

              {/* Biometric Login Option - Only show on login */}
              {isLogin && isBiometricAvailable && (
                <>
                  <div className="relative my-6">
                    <Separator className="bg-white/10" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-3 text-xs text-slate-400">
                      OR
                    </span>
                  </div>
                  
                  <BiometricLogin onSuccess={() => navigate('/')} />
                </>
              )}

              {!isLogin && (
                <div className="text-center text-xs text-slate-300 mt-4 p-4 bg-gradient-to-r from-mansagold/20 to-amber-600/20 rounded-lg border border-mansagold/30">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                  <br />
                  <strong className="text-mansagold font-bold">Customers are ALWAYS FREE! Businesses are FREE until March 2026!</strong>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;