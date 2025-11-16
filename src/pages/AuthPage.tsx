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

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const { platform } = useCapacitor();
  
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Phase 1 Free Banner */}
        <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Badge className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-3 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            🎉 Customers ALWAYS FREE! Businesses FREE Until Jan 2026!
          </Badge>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Colorful top border */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          
          <CardHeader className="text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 -z-10"></div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              {isLogin ? 'Welcome Back' : 'Join the Movement'}
            </CardTitle>
            <CardDescription className="text-lg text-gray-700 font-medium">
              {isLogin 
                ? 'Sign in to your Mansa Musa Marketplace account'
                : 'Create your FREE account and start building community wealth'
              }
            </CardDescription>
            
            {!isLogin && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {formData.userType === 'customer' && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <Users className="h-3 w-3 mr-1" />
                    Customer Account
                  </Badge>
                )}
                {formData.userType === 'business' && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <Building2 className="h-3 w-3 mr-1" />
                    Business Account
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-900 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                      className="border-2 focus:border-purple-500"
                    />
                  </div>

                  {!isIOS && (
                    <div className="space-y-2">
                      <Label htmlFor="userType" className="text-gray-900 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></span>
                        Account Type
                      </Label>
                      <Select 
                        value={formData.userType} 
                        onValueChange={(value) => handleInputChange('userType', value)}
                      >
                        <SelectTrigger className="border-2 focus:border-purple-500">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Customer - Browse & Shop
                            </div>
                          </SelectItem>
                          <SelectItem value="business">
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2" />
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
                        <Label htmlFor="businessName" className="text-gray-900 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></span>
                          Business Name
                        </Label>
                        <Input
                          id="businessName"
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          required
                          className="border-2 focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessCategory" className="text-gray-900 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"></span>
                          Business Category
                        </Label>
                        <Select 
                          value={formData.businessCategory} 
                          onValueChange={(value) => handleInputChange('businessCategory', value)}
                        >
                          <SelectTrigger className="border-2 focus:border-cyan-500">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                            <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
                            <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                            <SelectItem value="Professional Services">Professional Services</SelectItem>
                            <SelectItem value="Retail & Shopping">Retail & Shopping</SelectItem>
                            <SelectItem value="Art & Entertainment">Art & Entertainment</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Transportation">Transportation</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-900 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-green-500"></span>
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border-2 focus:border-purple-500"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="border-2 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="border-2 focus:border-purple-500"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-900 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></span>
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                      className="border-2 focus:border-purple-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <Checkbox
                      id="hbcuMember"
                      checked={formData.isHbcuMember}
                      onCheckedChange={(checked) => handleInputChange('isHbcuMember', checked as boolean)}
                      className="border-2 border-yellow-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-500 data-[state=checked]:to-orange-500"
                    />
                    <Label htmlFor="hbcuMember" className="text-sm font-semibold text-gray-900 cursor-pointer">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-yellow-600" />
                        I'm an HBCU student/alumni (Extra rewards! 🎓)
                      </div>
                    </Label>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLogin ? 'Sign In' : 'Create FREE Account'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>

              {!isLogin && (
                <div className="text-center text-xs text-gray-600 mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                  <br />
                  <strong className="text-green-700 font-bold">Customers are ALWAYS FREE! Businesses are FREE until January 1, 2026!</strong>
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