
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BusinessSettingsContent = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Loyalty Program Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Points Per Visit</h4>
                  <p className="text-sm text-gray-500">Standard points awarded per visit</p>
                </div>
                <input 
                  type="number" 
                  className="w-24 px-3 py-1 border rounded"
                  defaultValue={10}
                  min={1}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Points Per Review</h4>
                  <p className="text-sm text-gray-500">Points awarded for customer reviews</p>
                </div>
                <input 
                  type="number" 
                  className="w-24 px-3 py-1 border rounded"
                  defaultValue={15} 
                  min={0}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Points Per Dollar Spent</h4>
                  <p className="text-sm text-gray-500">Additional points based on purchase amount</p>
                </div>
                <input 
                  type="number" 
                  className="w-24 px-3 py-1 border rounded"
                  defaultValue={1} 
                  min={0}
                  step={0.1}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Discount Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Standard Discount</h4>
                  <p className="text-sm text-gray-500">Default discount for app users</p>
                </div>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    className="w-24 px-3 py-1 border rounded-r-none rounded-l"
                    defaultValue={10} 
                    min={0}
                    max={100}
                  />
                  <span className="bg-gray-100 px-3 py-1 border border-l-0 rounded-r">%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button className="bg-mansablue hover:bg-mansablue-dark text-white">
              Save Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessSettingsContent;
