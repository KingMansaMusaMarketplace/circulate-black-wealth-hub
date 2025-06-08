
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import QRCodeCard from './QRCodeCard';
import { QRCodeEditor } from './QRCodeEditor';
import { EmptyState } from './QRCodeEmptyState';
import { QRCode } from '@/lib/api/qr-code-api';
import { useQRCode } from '@/hooks/qr-code';

interface QRCodeManageTabProps {
  qrCodes: QRCode[];
}

export const QRCodeManageTab: React.FC<QRCodeManageTabProps> = ({ qrCodes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingQRCode, setEditingQRCode] = useState<QRCode | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { loading } = useQRCode();

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.code_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'active' && qr.is_active) ||
      (filterType === 'inactive' && !qr.is_active);
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    setEditingQRCode(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (qrCode: QRCode) => {
    setEditingQRCode(qrCode);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    // Handle delete logic here
    console.log('Delete QR code:', id);
  };

  const handleView = (qrCode: QRCode) => {
    // Handle view logic here
    console.log('View QR code:', qrCode);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingQRCode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Manage QR Codes</h2>
          <p className="text-sm text-gray-500 mt-1">
            {qrCodes.length} QR code{qrCodes.length !== 1 ? 's' : ''} total
          </p>
        </div>
        
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create New QR Code
        </Button>
      </div>

      {/* Search and Filters */}
      {qrCodes.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search QR codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('active')}
                >
                  Active
                </Button>
                <Button
                  variant={filterType === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Code List */}
      {filteredQRCodes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQRCodes.map((qrCode) => (
            <QRCodeCard
              key={qrCode.id}
              qrCode={qrCode}
              onEdit={() => handleEdit(qrCode)}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      ) : qrCodes.length === 0 ? (
        <EmptyState onCreateNew={handleCreateNew} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes match your filters</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search terms or filters.</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Code Editor Dialog */}
      <QRCodeEditor
        open={isEditorOpen}
        onOpenChange={handleEditorClose}
        qrCode={editingQRCode}
        isLoading={loading}
      />
    </div>
  );
};
