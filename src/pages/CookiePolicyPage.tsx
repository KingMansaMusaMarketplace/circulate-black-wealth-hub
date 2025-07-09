
import React from 'react';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';

const CookiePolicyPage = () => {
  return (
    <ResponsiveLayout
      title="Cookie Policy"
      description="Learn about how Mansa Musa Marketplace uses cookies"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mansablue mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-mansablue mb-4">What Are Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They help us provide you with a better experience by remembering your preferences and improving our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-mansablue mb-4">How We Use Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-mansablue-dark mb-2">Essential Cookies</h3>
                <p className="text-gray-600">
                  These cookies are necessary for the website to function properly. They enable core functionality 
                  such as security, network management, and accessibility.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-mansablue-dark mb-2">Performance Cookies</h3>
                <p className="text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-mansablue-dark mb-2">Functional Cookies</h3>
                <p className="text-gray-600">
                  These cookies enable the website to provide enhanced functionality and personalization, 
                  such as remembering your login status and preferences.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-mansablue mb-4">Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              You can control and manage cookies through your browser settings. Please note that disabling cookies 
              may affect the functionality of our website. Most browsers allow you to refuse cookies or delete 
              existing cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-mansablue mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about our Cookie Policy, please contact us at 
              <a href="mailto:contact@mansamusamarketplace.com" className="text-mansagold hover:text-mansagold-dark ml-1">
                contact@mansamusamarketplace.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default CookiePolicyPage;
