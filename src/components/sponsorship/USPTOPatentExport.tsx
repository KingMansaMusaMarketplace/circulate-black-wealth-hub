
import React, { useState } from 'react';
import { FileText, FileDown, Scale, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { generateUSPTOPatentWordDoc, generateUSPTOPatentPDF } from './services/pdfGenerationService';

export const USPTOPatentExport: React.FC = () => {
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadWord = async () => {
    setIsGeneratingWord(true);
    try {
      await generateUSPTOPatentWordDoc();
    } catch (error) {
      console.error('Error generating USPTO Word document:', error);
    } finally {
      setIsGeneratingWord(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateUSPTOPatentPDF();
    } catch (error) {
      console.error('Error generating USPTO PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">USPTO Patent Filing Package</CardTitle>
            <CardDescription>
              Complete Provisional Patent Application ready for USPTO submission
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">14</p>
            <p className="text-xs text-muted-foreground">Independent Claims</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">25+</p>
            <p className="text-xs text-muted-foreground">Dependent Claims</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Major Sections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">$80</p>
            <p className="text-xs text-muted-foreground">Micro Entity Fee</p>
          </div>
        </div>

        {/* Key Protected Innovations */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Protected Innovations
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Temporal Founding Member</Badge>
            <Badge variant="outline">CMAL Engine (2.3x)</Badge>
            <Badge variant="outline">Fraud Detection</Badge>
            <Badge variant="outline">Coalition Loyalty</Badge>
            <Badge variant="outline">Voice AI Bridge</Badge>
            <Badge variant="outline">Sales Agent Network</Badge>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleDownloadWord}
            disabled={isGeneratingWord}
            className="flex-1"
            variant="default"
          >
            <FileText className="mr-2 h-4 w-4" />
            {isGeneratingWord ? 'Generating...' : 'Download Word (.docx)'}
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex-1"
            variant="outline"
          >
            <FileDown className="mr-2 h-4 w-4" />
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>

        {/* Filing Note */}
        <p className="text-xs text-muted-foreground text-center">
          Documents formatted for USPTO requirements: Times New Roman, 1-inch margins, 1.5 line spacing
        </p>
      </CardContent>
    </Card>
  );
};

export default USPTOPatentExport;
