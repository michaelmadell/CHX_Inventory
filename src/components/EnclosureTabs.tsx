import React from 'react';

interface EnclosureTabsProps {
    enclosureFiles: string[];
    activeTab: string;
    onTabClick: (fileName: string) => void;
}

export default function EnclosureTabs({ enclosureFiles, activeTab, onTabClick}: EnclosureTabsProps) {
    return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px shadow-xl border-b-1 border-gray-400 flex space-x-8 px-4 sm:px-6 lg:px-8" aria-label="Tabs">
        {enclosureFiles.map((fileName) => {
          const serial = fileName.replace('.json', '');
          const isActive = fileName === activeTab;

          return (
            <button
              key={fileName}
              onClick={() => onTabClick(fileName)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md
                ${isActive
                  ? 'border-[var(--custom-a)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {serial}
            </button>
          );
        })}
      </nav>
    </div>
  );
}