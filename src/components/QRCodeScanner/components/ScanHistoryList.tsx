
import React from 'react';
import { QrCode } from 'lucide-react';

interface ScanHistoryItem {
  name: string;
  points: number;
  date: string;
}

interface ScanHistoryListProps {
  scans: ScanHistoryItem[];
}

const ScanHistoryList: React.FC<ScanHistoryListProps> = ({ scans }) => {
  if (scans.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <h4 className="text-sm font-medium mb-3 text-gray-700">Recent Scans</h4>
      <div className="space-y-2">
        {scans.map((scan, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <QrCode size={14} className="text-mansablue" />
              <span>{scan.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{scan.date}</span>
              <span className="bg-mansagold/10 text-mansagold text-xs rounded px-1.5 py-0.5">
                +{scan.points}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanHistoryList;
