import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Users, GraduationCap } from 'lucide-react';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  userType: string;
  businessName: string;
  businessCategory: string;
  phone: string;
  isHbcuMember: boolean;
}

interface AuthFormFieldsProps {
  formData: AuthFormData;
  isLogin: boolean;
  isIOS: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
}

const businessCategories = [
  'Food & Dining',
  'Beauty & Wellness', 
  'Health & Fitness',
  'Professional Services',
  'Retail & Shopping',
  'Art & Entertainment',
  'Education',
  'Technology',
  'Transportation',
  'Finance'
];

export const AuthFormFields: React.FC<AuthFormFieldsProps> = ({
  formData,
  isLogin,
  isIOS,
  onInputChange
}) => {
  return (
    <>
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
              onChange={(e) => onInputChange('fullName', e.target.value)}
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
                onValueChange={(value) => onInputChange('userType', value)}
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
            <BusinessFields 
              formData={formData} 
              onInputChange={onInputChange} 
            />
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
              onChange={(e) => onInputChange('phone', e.target.value)}
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
          onChange={(e) => onInputChange('email', e.target.value)}
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
          onChange={(e) => onInputChange('password', e.target.value)}
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
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              required
              className="bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-mansagold/50 focus:ring-2 focus:ring-mansagold/20"
            />
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-mansagold/10 to-amber-500/10 border border-mansagold/30">
            <Checkbox
              id="isHbcuMember"
              checked={formData.isHbcuMember}
              onCheckedChange={(checked) => onInputChange('isHbcuMember', checked as boolean)}
              className="border-mansagold data-[state=checked]:bg-mansagold data-[state=checked]:border-mansagold"
            />
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-mansagold" />
              <label htmlFor="isHbcuMember" className="text-sm font-medium text-slate-200 cursor-pointer">
                I am an HBCU student/alumni/faculty
              </label>
            </div>
          </div>
        </>
      )}
    </>
  );
};

interface BusinessFieldsProps {
  formData: AuthFormData;
  onInputChange: (field: string, value: string | boolean) => void;
}

const BusinessFields: React.FC<BusinessFieldsProps> = ({ formData, onInputChange }) => {
  return (
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
          onChange={(e) => onInputChange('businessName', e.target.value)}
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
          onValueChange={(value) => onInputChange('businessCategory', value)}
        >
          <SelectTrigger className="bg-slate-700/50 border-white/10 text-white focus:border-mansablue/50">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/10">
            {businessCategories.map((category) => (
              <SelectItem 
                key={category} 
                value={category} 
                className="text-white hover:bg-slate-700 focus:bg-slate-700"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default AuthFormFields;
