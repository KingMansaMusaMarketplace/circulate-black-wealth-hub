import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Customer, addCustomerTag, removeCustomerTag } from '@/lib/api/customer-api';
import { toast } from 'sonner';

interface CustomerTagsManagerProps {
  customer: Customer;
  onUpdate: () => void;
}

export const CustomerTagsManager: React.FC<CustomerTagsManagerProps> = ({
  customer,
  onUpdate
}) => {
  const [newTag, setNewTag] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      await addCustomerTag(customer.id, newTag.trim());
      setNewTag('');
      onUpdate();
      toast.success('Tag added');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeCustomerTag(tagId);
      onUpdate();
      toast.success('Tag removed');
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Failed to remove tag');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {customer.tags && customer.tags.length > 0 ? (
          customer.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
              {tag.tag}
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No tags yet</p>
        )}
      </div>

      {isAdding ? (
        <div className="flex gap-2">
          <Input
            placeholder="Enter tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              }
            }}
            autoFocus
          />
          <Button onClick={handleAddTag} size="sm">
            Add
          </Button>
          <Button onClick={() => setIsAdding(false)} size="sm" variant="ghost">
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      )}
    </div>
  );
};
