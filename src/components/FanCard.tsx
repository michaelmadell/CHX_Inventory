// src/components/FanCard.tsx

import React from 'react';
import { type Fan } from '../types';
import { Fan as FanIcon} from 'lucide-react';

// The card component to display individual fan details.
interface FanCardProps {
  fan: Fan;
}

export default function FanCard({ fan }: FanCardProps) {
  return (
    <div className="bg-gray-300/50 border border-gray-300 rounded-lg p-4 text-center shadow-lg flex flex-col items-center justify-between hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="text-gray-400">
        <FanIcon className="h-12 w-12" />
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className='text-md font-bold'>Fan Pos: {fan.id}</h3>
        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <div>
            <span className="font-medium">Fan Manufacturer:</span>
            <p className="font-mono">{fan.fanManufacturer}</p>
          </div>
          <div>
            <span className="font-medium">Fan Model:</span>
            <p className="font-mono">{fan.fanModel}</p>
          </div>
          <div>
            <span className="font-medium">Fan S/N:</span>
            <p className="font-mono">{fan.fanSerialNumber}</p>
          </div>
          <div>
            <span className="font-medium">Module S/N:</span>
            <p className="font-mono">{fan.moduleSerialNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
}