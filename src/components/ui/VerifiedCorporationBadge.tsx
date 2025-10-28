import React from 'react';
import { Shield, CheckCircle2, ExternalLink } from 'lucide-react';

interface VerifiedCorporationBadgeProps {
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const VerifiedCorporationBadge: React.FC<VerifiedCorporationBadgeProps> = ({ 
  variant = 'default',
  className = '' 
}) => {
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full ${className}`}>
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">Verified Corporation</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-green-50 border-2 border-green-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">Verified Corporation</h3>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Mansa Musa Marketplace, Inc. is officially incorporated in the State of Illinois.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold text-gray-900">File #:</span>
                <span className="text-gray-700 ml-2">75201745</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Incorporated:</span>
                <span className="text-gray-700 ml-2">June 10, 2025</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">State:</span>
                <span className="text-gray-700 ml-2">Illinois</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Status:</span>
                <span className="text-green-700 ml-2 font-medium">Active</span>
              </div>
            </div>
            <a
              href="https://apps.ilsos.gov/corporatellc/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Verify on Illinois Secretary of State Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-green-200 rounded-lg shadow-sm ${className}`}>
      <Shield className="h-5 w-5 text-green-600" />
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-900">Verified Corporation</span>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </div>
        <p className="text-xs text-gray-600">Incorporated in Illinois • Est. 2025</p>
      </div>
    </div>
  );
};

export default VerifiedCorporationBadge;
