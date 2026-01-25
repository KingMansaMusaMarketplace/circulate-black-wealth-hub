import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Mail, Building2, Globe, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { DirectoryPartner } from '@/types/partner';
import { format } from 'date-fns';

interface PartnerPendingReviewProps {
  partner: DirectoryPartner;
}

const PartnerPendingReview: React.FC<PartnerPendingReviewProps> = ({ partner }) => {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      {/* Status Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 mb-4">
          <Clock className="h-10 w-10 text-amber-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">Application Under Review</h1>
        <p className="text-slate-400 max-w-md mx-auto">
          Thank you for applying to become a Directory Partner! Our team is reviewing your application.
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center mb-8">
        <Badge variant="outline" className="px-4 py-2 text-amber-400 border-amber-400/50 bg-amber-400/10">
          <Clock className="h-4 w-4 mr-2" />
          Pending Review
        </Badge>
      </div>

      {/* Application Details Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-400" />
            Your Application Details
          </CardTitle>
          <CardDescription>
            Submitted on {format(new Date(partner.created_at), 'MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Directory Name</p>
                <p className="text-white font-medium">{partner.directory_name}</p>
              </div>
            </div>

            {partner.directory_url && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">Website</p>
                  <a 
                    href={partner.directory_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300"
                  >
                    {partner.directory_url}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400">Contact Email</p>
                <p className="text-white">{partner.contact_email}</p>
              </div>
            </div>

            {partner.contact_phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">Contact Phone</p>
                  <p className="text-white">{partner.contact_phone}</p>
                </div>
              </div>
            )}

            {partner.description && (
              <div className="pt-2 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-1">About Your Directory</p>
                <p className="text-slate-300">{partner.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* What's Next Section */}
      <Card className="mt-6 bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-white font-medium">Application Received</p>
                <p className="text-sm text-slate-400">We've received your application and sent a confirmation email.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">
                2
              </div>
              <div>
                <p className="text-white font-medium">Review in Progress</p>
                <p className="text-sm text-slate-400">Our team reviews applications within 1-2 business days.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-600 text-slate-400 text-sm font-medium">
                3
              </div>
              <div>
                <p className="text-slate-300 font-medium">Approval Notification</p>
                <p className="text-sm text-slate-400">Once approved, you'll receive an email with your partner dashboard access.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="mt-8 text-center">
        <p className="text-slate-400 text-sm">
          Questions about your application?{' '}
          <a href="mailto:partners@1325.ai" className="text-amber-400 hover:text-amber-300">
            Contact our partner team
          </a>
        </p>
      </div>
    </div>
  );
};

export default PartnerPendingReview;
