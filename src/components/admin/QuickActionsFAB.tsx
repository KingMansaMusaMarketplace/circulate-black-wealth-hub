import React, { useState } from 'react';
import { Plus, X, UserPlus, Building2, Bell, Download, Bot, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface QuickActionsFABProps {
  onExportOpen: () => void;
}

const QuickActionsFAB: React.FC<QuickActionsFABProps> = ({ onExportOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: Bot, label: 'AI Dashboard', action: () => navigate('/admin/ai'), color: 'bg-purple-500' },
    { icon: FileCheck, label: 'Verification', action: () => navigate('/admin/verification'), color: 'bg-blue-500' },
    { icon: Download, label: 'Export Reports', action: onExportOpen, color: 'bg-green-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Action buttons */}
      {isOpen && (
        <div className="flex flex-col-reverse gap-2 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {actions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => {
                action.action();
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${action.color} text-white shadow-lg hover:scale-105 transition-transform`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-yellow-500 hover:bg-yellow-400'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-slate-900" />
        )}
      </Button>
    </div>
  );
};

export default QuickActionsFAB;
