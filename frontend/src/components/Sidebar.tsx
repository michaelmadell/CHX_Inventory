import React, { useState, type FC, type ElementType } from 'react';
import { 
    LayoutDashboard, Server, Cpu, FileText, Settings, ChevronDown, X, 
    PcCase,
    EthernetPort,
    User,
    Network,
    BellElectric,
    FolderKanban
} from 'lucide-react';
import * as Types from '../types';

// --- Reusable Component Types ---

const iconComponents: Record<Types.IconName, ElementType> = {
    LayoutDashboard, Server, Cpu, FileText, Settings, FolderKanban
};

// --- Child Components specific to Sidebar ---

const EnclosureLogo: FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 68 40" className={className} xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_406_2)">
            <path d="M4 8H0V32H4V8Z" fill="#6B7280"/>
            <path d="M68 8H64V32H68V8Z" fill="#6B7280"/>
            <rect x="4" y="4" width="60" height="32" rx="2" fill="#1F2937"/>
            {[...Array(10)].map((_, i) => (
                <g key={i} transform={`translate(${7 + i * 5.6}, 7)`}>
                    <rect width="4.6" height="26" rx="1" fill="#111827"/>
                    <circle cx="2.3" cy="3" r="0.8" fill="#374151"/><circle cx="2.3" cy="6" r="0.8" fill="#374151"/><circle cx="2.3" cy="9" r="0.8" fill="#374151"/><circle cx="2.3" cy="12" r="0.8" fill="#374151"/><circle cx="2.3" cy="15" r="0.8" fill="#374151"/>
                    <rect y="21" width="4.6" height="3" rx="1" fill="#3B82F6"/>
                </g>
            ))}
            <rect x="4" y="4" width="60" height="32" rx="2" stroke="#4B5563" strokeWidth="1.5" fill="none"/>
        </g>
        <defs><clipPath id="clip0_406_2"><rect width="68" height="40" rx="3" fill="white"/></clipPath></defs>
    </svg>
);


const NavLink: FC<Types.NavLinkProps> = ({ href = "#", icon, children, isActive = false, onClick, isButton = false, isMenuOpen = false }) => {
    const Tag = isButton ? 'button' : 'a';
    const IconComponent = iconComponents[icon];
    const commonClasses = "w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg transition-colors";
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <Tag href={!isButton ? href : undefined} onClick={onClick} className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <div className="flex items-center space-x-3">
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{children}</span>
            </div>
            {isButton && <ChevronDown className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />}
        </Tag>
    );
};


// --- Main Sidebar Component ---



export const Sidebar: FC<Types.SidebarProps> = ({ isOpen, onClose, currentPage, setCurrentPage }) => {
    // State for collapsible menus is now managed inside the Sidebar
    const [devicesMenuOpen, setDevicesMenuOpen] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

    return (
        <aside className={`bg-gray-800 w-64 min-h-screen flex-shrink-0 p-4 flex flex-col fixed lg:relative lg:translate-x-0 transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-8">
                <a href="#" className="flex items-center space-x-2">
                    <EnclosureLogo className="w-10 h-10" />
                    <span className="text-xl font-bold text-white">EnclosureMgr</span>
                </a>
                <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                    <X />
                </button>
            </div>

            <nav className="space-y-2 overflow-y-auto">
                <NavLink icon="LayoutDashboard" isActive={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')}>Dashboard</NavLink>
                <NavLink icon="FolderKanban" isActive={currentPage === 'groups'} onClick={() => setCurrentPage('groups')}>Groups</NavLink>
                <div>
                    <NavLink icon="Server" onClick={() => setDevicesMenuOpen(!devicesMenuOpen)} isButton={true} isMenuOpen={devicesMenuOpen}>Devices</NavLink>
                    <div className={`pl-6 mt-1 space-y-1 ${!devicesMenuOpen && 'hidden'}`}>
                        <a href="#" className="inline-flex w-full justify-between px-3 py-2 text-gray-400 hover:text-white rounded-md">Enclosures<Server /></a>
                        <a href="#" className="inline-flex w-full justify-between px-3 py-2 text-gray-400 hover:text-white rounded-md">Nodes<PcCase /></a>
                        <a href="#" className="inline-flex w-full justify-between px-3 py-2 text-gray-400 hover:text-white rounded-md">Networking<EthernetPort /></a>
                    </div>
                </div>
                <NavLink icon="Cpu">Firmware</NavLink>
                <NavLink icon="FileText">Logs</NavLink>
                <div>
                    <NavLink icon="Settings" onClick={() => setSettingsMenuOpen(!settingsMenuOpen)} isButton={true} isMenuOpen={settingsMenuOpen}>Settings</NavLink>
                    <div className={`pl-6 mt-1 space-y-1 ${!settingsMenuOpen && 'hidden'}`}>
                        <a href="#" className="inline-flex w-full justify-between px-3 py-2 text-gray-400 hover:text-white rounded-md">Users<User /></a>
                        <a href="#" className="inline-flex w-full justify-between px-3 py-2 text-gray-400 hover:text-white rounded-md">Network<Network /></a>
                        <a href="#" className="inline-flex w-full justify-between px-3 py-2 text-gray-400 hover:text-white rounded-md">Alerting<BellElectric /></a>
                    </div>
                </div>
            </nav>

            <div className="mt-auto pt-8">
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <h3 className="font-semibold text-white">System Health</h3>
                    <p className="text-sm text-gray-400 mt-1">All systems are operational.</p>
                    <div className="mt-4 h-2 w-full bg-gray-600 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{width: '100%'}}></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
