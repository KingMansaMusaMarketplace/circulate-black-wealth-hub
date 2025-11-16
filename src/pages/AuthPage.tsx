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
    <div className="min-h-screen bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-mansablue">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Phase 1 Free Banner */}
        <div className="text-center mb-6">
          <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-bold rounded-full">
            🎉 Customers ALWAYS FREE! Businesses FREE Until Jan 2026!
          </Badge>
        </div>

        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Movement'}
            </CardTitle>
            <CardDescription className="text-base text-gray-700">
              {isLogin 
                ? 'Sign in to your Mansa Musa Marketplace account'
                : 'Create your FREE account and start building community wealth'
              }
            </CardDescription>
            
            {!isLogin && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {formData.userType === 'customer' && (
                  <Badge className="bg-green-500 text-white">
                    <Users className="h-3 w-3 mr-1" />
                    Customer Account
                  </Badge>
                )}
                {formData.userType === 'business' && (
                  <Badge className="bg-blue-500 text-white">
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
                    <Label htmlFor="fullName" className="text-gray-900 font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>

                  {!isIOS && (
                    <div className="space-y-2">
                      <Label htmlFor="userType" className="text-gray-900 font-medium">Account Type</Label>
                      <Select 
                        value={formData.userType} 
                        onValueChange={(value) => handleInputChange('userType', value)}
                      >
                        <SelectTrigger>
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
                        <Label htmlFor="businessName" className="text-gray-900 font-medium">Business Name</Label>
                        <Input
                          id="businessName"
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessCategory" className="text-gray-900 font-medium">Business Category</Label>
                        <Select 
                          value={formData.businessCategory} 
                          onValueChange={(value) => handleInputChange('businessCategory', value)}
                        >
                          <SelectTrigger>
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
                    <Label htmlFor="phone" className="text-gray-900 font-medium">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hbcuMember"
                      checked={formData.isHbcuMember}
                      onCheckedChange={(checked) => handleInputChange('isHbcuMember', checked as boolean)}
                    />
                    <Label htmlFor="hbcuMember" className="text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        I'm an HBCU student/alumni (Extra rewards!)
                      </div>
                    </Label>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-mansablue hover:bg-mansablue-dark text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? 'Sign In' : 'Create FREE Account'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-mansablue hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>

              {!isLogin && (
                <div className="text-center text-xs text-gray-600 mt-4">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                  <br />
                  <strong className="text-gray-900">Customers are ALWAYS FREE! Businesses are FREE until January 1, 2026!</strong>
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