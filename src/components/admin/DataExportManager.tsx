import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, Database, FileJson, FileSpreadsheet, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ExportConfig {
  table: string;
  label: string;
  description: string;
  columns?: string[];
}

const exportConfigs: ExportConfig[] = [
  { table: 'profiles', label: 'Users', description: 'All user profiles and account data' },
  { table: 'businesses', label: 'Businesses', description: 'Business listings and details' },
  { table: 'transactions', label: 'Transactions', description: 'All point transactions' },
  { table: 'reviews', label: 'Reviews', description: 'Customer reviews and ratings' },
  { table: 'sales_agents', label: 'Sales Agents', description: 'Agent data and referrals' },
  { table: 'activity_log', label: 'Activity Log', description: 'User activity history' },
  { table: 'bookings', label: 'Bookings', description: 'All service bookings' },
  { table: 'support_tickets', label: 'Support Tickets', description: 'Customer support tickets' }
];

const DataExportManager: React.FC = () => {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string;
    tables: string[];
    format: string;
    timestamp: Date;
    size: string;
  }>>([]);

  const toggleTable = (table: string) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const selectAll = () => {
    setSelectedTables(exportConfigs.map(c => c.table));
  };

  const selectNone = () => {
    setSelectedTables([]);
  };

  const exportData = async () => {
    if (selectedTables.length === 0) {
      toast.error('Please select at least one table to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const exportData: Record<string, any[]> = {};
      const totalTables = selectedTables.length;

      for (let i = 0; i < selectedTables.length; i++) {
        const table = selectedTables[i];
        setExportProgress(((i + 0.5) / totalTables) * 100);

        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(10000);

        if (error) {
          console.error(`Error exporting ${table}:`, error);
          continue;
        }

        exportData[table] = data || [];
        setExportProgress(((i + 1) / totalTables) * 100);
      }

      // Generate file
      let content: string;
      let filename: string;
      let mimeType: string;

      if (exportFormat === 'json') {
        content = JSON.stringify(exportData, null, 2);
        filename = `export-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
        mimeType = 'application/json';
      } else {
        // CSV - combine all tables
        const csvLines: string[] = [];
        
        for (const [tableName, rows] of Object.entries(exportData)) {
          if (rows.length === 0) continue;
          
          csvLines.push(`\n### ${tableName.toUpperCase()} ###`);
          const headers = Object.keys(rows[0]);
          csvLines.push(headers.join(','));
          
          rows.forEach(row => {
            const values = headers.map(h => {
              const val = row[h];
              if (val === null || val === undefined) return '';
              if (typeof val === 'object') return JSON.stringify(val).replace(/"/g, '""');
              return String(val).includes(',') ? `"${val}"` : val;
            });
            csvLines.push(values.join(','));
          });
        }
        
        content = csvLines.join('\n');
        filename = `export-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
        mimeType = 'text/csv';
      }

      // Download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      // Add to history
      setExportHistory(prev => [{
        id: Date.now().toString(),
        tables: selectedTables,
        format: exportFormat,
        timestamp: new Date(),
        size: `${(blob.size / 1024).toFixed(1)} KB`
      }, ...prev.slice(0, 9)]);

      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-mansagold" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-white/80 mb-2 block">Export Format</Label>
            <div className="flex gap-4">
              <Button
                variant={exportFormat === 'csv' ? 'default' : 'outline'}
                onClick={() => setExportFormat('csv')}
                className={exportFormat === 'csv' 
                  ? 'bg-mansagold text-mansablue-dark' 
                  : 'border-white/20 text-white/70'
                }
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant={exportFormat === 'json' ? 'default' : 'outline'}
                onClick={() => setExportFormat('json')}
                className={exportFormat === 'json' 
                  ? 'bg-mansagold text-mansablue-dark' 
                  : 'border-white/20 text-white/70'
                }
              >
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>

          {/* Table Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-white/80">Select Tables to Export</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll} className="text-mansagold text-xs">
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={selectNone} className="text-white/60 text-xs">
                  Clear
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportConfigs.map((config) => (
                <div
                  key={config.table}
                  onClick={() => toggleTable(config.table)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTables.includes(config.table)
                      ? 'bg-mansagold/10 border-mansagold/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedTables.includes(config.table)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-white font-medium">{config.label}</p>
                      <p className="text-white/60 text-sm">{config.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Exporting...</span>
                <span className="text-mansagold">{Math.round(exportProgress)}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}

          {/* Export Button */}
          <Button
            onClick={exportData}
            disabled={selectedTables.length === 0 || isExporting}
            className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
          >
            <Download className="h-4 w-4 mr-2" />
            Export {selectedTables.length > 0 ? `${selectedTables.length} Table${selectedTables.length > 1 ? 's' : ''}` : 'Data'}
          </Button>
        </CardContent>
      </Card>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-mansagold" />
              Recent Exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <div>
                      <p className="text-white text-sm">
                        {item.tables.length} table{item.tables.length > 1 ? 's' : ''} exported
                      </p>
                      <p className="text-white/40 text-xs">
                        {format(item.timestamp, 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.format.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-white/60">
                      {item.size}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* GDPR Export Info */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">GDPR Data Export</p>
              <p className="text-white/60 text-sm mt-1">
                For individual user data export requests (GDPR compliance), use the User Management tab 
                to export specific user data. This bulk export is for administrative purposes only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExportManager;
