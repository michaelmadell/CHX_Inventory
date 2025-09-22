import React, { useState, useEffect, type FC, type ElementType } from 'react';
import * as Types from './types';

// Import icons needed for the main content area
import { 
    Menu, Search, Bell, ChevronDown, 
    ShieldCheck, AlertTriangle, HardDrive, Zap,
    LayoutDashboard, Server, Cpu, FileText, Settings,
    FolderKanban,
    X,
    PcCase,
    EthernetPort,
    User,
    Network,
    BellElectric,
    Plus,
    Trash2,
    XCircle,
    Edit
} from 'lucide-react';

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


const NavLink: FC<Types.NavLinkProps> = ({ icon, children, isActive = false, onClick, isButton = false, isMenuOpen = false }) => {
  const iconComponents: Record<Types.IconName, ElementType> = { LayoutDashboard, Server, Cpu, FileText, Settings, FolderKanban };
  const Tag = isButton ? 'button' : 'a';
  const IconComponent = iconComponents[icon];
  const commonClasses = "w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg transition-colors";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
      <Tag onClick={onClick} className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses}`} {...(!isButton && {href: '#'})}>
          <div className="flex items-center space-x-3">
              <IconComponent className="w-5 h-5" />
              <span className="font-medium">{children}</span>
          </div>
          {isButton && <ChevronDown className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />}
      </Tag>
  );
};

const statCardIconComponents: Record<Types.StatCardIconName, ElementType> = {
    ShieldCheck, AlertTriangle, HardDrive, Zap
};

const StatCard: FC<Types.StatCardProps> = ({ title, value, icon, color }) => {
  const IconComponent = statCardIconComponents[icon];
  const colorMap = {
      green: { bg: 'bg-green-500/10', text: 'text-green-400' },
      red: { bg: 'bg-red-500/10', text: 'text-red-400' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  };

  return (
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700/50">
          <div className="flex justify-between items-start">
              <div>
                  <p className="text-sm font-medium text-gray-400">{title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{value}</p>
              </div>
              <div className={`p-2.5 ${colorMap[color].bg} rounded-lg`}>
                  <IconComponent className={colorMap[color].text} />
              </div>
          </div>
      </div>
  );
};

const LogEntry: FC<Types.LogEntryProps> = ({ timestamp, severity, device, message }) => {
  const baseClasses = "w-[75px] inline-block text-center py-1 text-xs font-semibold rounded-full";
  const severityColorMap = {
      Critical: "text-red-200 bg-red-500/20",
      Warning: "text-yellow-200 bg-yellow-500/20",
      Info: "text-blue-200 bg-blue-500/20",
  };

  return (
      <tr className="bg-gray-800 border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors">
          <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{timestamp}</td>
          <td className="px-6 py-4">
              <span className={`${baseClasses} ${severityColorMap[severity]}`}>
                  {severity}
              </span>
          </td>
          <td className="px-6 py-4">{device}</td>
          <td className="px-6 py-4">{message}</td>
      </tr>
  );
};

export const Sidebar: FC<Types.SidebarProps> = ({ isOpen, onClose, currentPage, setCurrentPage }) => {
  // State for collapsible menus is now managed inside the Sidebar
  const [devicesMenuOpen, setDevicesMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  return (
      <aside className={`bg-gray-800 w-64 h-screen flex-shrink-0 p-4 flex flex-col fixed lg:relative lg:translate-x-0 transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-8">
              <a href="#" className="flex items-center space-x-2">
                  <EnclosureLogo className="w-10 h-10" />
                  <span className="text-xl font-bold text-white">EnclosureMgr</span>
              </a>
              <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                  <X />
              </button>
          </div>

          <nav className="space-y-2 h-full overflow-y-auto">
              <NavLink icon="LayoutDashboard" isActive={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')}>Dashboard</NavLink>
              <NavLink icon="FolderKanban" isActive={currentPage === 'groups'} onClick={() => setCurrentPage('groups')}>Groups</NavLink>
              <div>
                  <NavLink icon="Server" onClick={() => setDevicesMenuOpen(!devicesMenuOpen)} isButton={true} isMenuOpen={devicesMenuOpen}>Devices</NavLink>
                  <div className={`pl-6 mt-1 space-y-1 ${!devicesMenuOpen && 'hidden'}`}>
                      <NavLink icon='Server' isActive={currentPage === 'enclosures'} onClick={() => setCurrentPage('enclosures')}>Enclosures</NavLink>
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

// --- Page Components ---
const DashboardPage: FC = () => {
  type StatCardIconName = 'ShieldCheck' | 'AlertTriangle' | 'HardDrive' | 'Zap';
  const statCardIconComponents: Record<StatCardIconName, ElementType> = { ShieldCheck, AlertTriangle, HardDrive, Zap };
  interface StatCardProps { title: string; value: string; icon: StatCardIconName; color: 'green' | 'red' | 'blue' | 'yellow'; }
  const StatCard: FC<StatCardProps> = ({ title, value, icon, color }) => {
      const IconComponent = statCardIconComponents[icon];
      const colorMap = {
          green: { bg: 'bg-green-500/10', text: 'text-green-400' }, red: { bg: 'bg-red-500/10', text: 'text-red-400' },
          blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' }, yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
      };
      return ( <div className="bg-gray-800 rounded-xl p-5 border border-gray-700/50"><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-gray-400">{title}</p><p className="text-3xl font-bold text-white mt-1">{value}</p></div><div className={`p-2.5 ${colorMap[color].bg} rounded-lg`}><IconComponent className={colorMap[color].text} /></div></div></div> );
  };
  interface LogEntryProps { timestamp: string; severity: 'Critical' | 'Warning' | 'Info'; device: string; message: string; }
  const LogEntry: FC<LogEntryProps> = ({ timestamp, severity, device, message }) => {
      const baseClasses = "w-[75px] inline-block text-center py-1 text-xs font-semibold rounded-full";
      const severityColorMap = { Critical: "text-red-200 bg-red-500/20", Warning: "text-yellow-200 bg-yellow-500/20", Info: "text-blue-200 bg-blue-500/20" };
      return ( <tr className="bg-gray-800 border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors"><td className="px-6 py-4 font-medium text-white whitespace-nowrap">{timestamp}</td><td className="px-6 py-4"><span className={`${baseClasses} ${severityColorMap[severity]}`}>{severity}</span></td><td className="px-6 py-4">{device}</td><td className="px-6 py-4">{message}</td></tr> );
  };
  return (
      <><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><StatCard title="System Health" value="Healthy" icon="ShieldCheck" color="green" /><StatCard title="Critical Alerts" value="2" icon="AlertTriangle" color="red" /><StatCard title="Devices Managed" value="16" icon="HardDrive" color="blue" /><StatCard title="Power Consumption" value="2.1 kW" icon="Zap" color="yellow" /></div><div className="mt-8 bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden"><div className="p-5 border-b border-gray-700/50 flex flex-wrap gap-4 justify-between items-center"><h2 className="text-lg font-semibold text-white">Recent Activity Logs</h2></div><div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-400"><thead className="text-xs text-gray-300 uppercase bg-gray-700/50"><tr><th scope="col" className="px-6 py-3">Timestamp</th><th scope="col" className="px-6 py-3">Severity</th><th scope="col" className="px-6 py-3">Device</th><th scope="col" className="px-6 py-3">Message</th></tr></thead><tbody><LogEntry timestamp="2025-09-22 18:02:15" severity="Critical" device="Server-01A" message="Fan speed for CPU1 is below threshold." /><LogEntry timestamp="2025-09-22 18:01:05" severity="Critical" device="PSU-2" message="Power supply unit redundancy lost." /><LogEntry timestamp="2025-09-22 17:55:41" severity="Warning" device="Storage-03" message="Drive is predicted to fail." /><LogEntry timestamp="2025-09-22 17:40:09" severity="Info" device="Admin" message="User 'admin' logged in." /></tbody></table></div></div></>
  );
};

const GroupsPage: FC = () => {
  const [groups, setGroups] = useState<Types.Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const API_URL = 'http://localhost:3001/api';

  const fetchGroups = async () => {
      try {
          setIsLoading(true);
          const response = await fetch(`${API_URL}/groups`);
          if (!response.ok) throw new Error('Failed to fetch groups');
          const data = await response.json();
          setGroups(data);
      } catch (error) {
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      fetchGroups();
  }, []);

  const handleAddGroup = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newGroupName.trim() === '') return;

      try {
          const response = await fetch(`${API_URL}/groups`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newGroupName, description: newGroupDesc }),
          });

          if (!response.ok) throw new Error('Failed to create group');
          
          await fetchGroups();
          setNewGroupName('');
          setNewGroupDesc('');
          setIsModalOpen(false);
      } catch (error) {
          console.error(error);
      }
  };

  

  const handleDeleteGroup = async (groupId: string) => {
      if (!window.confirm('Are you sure you want to delete this group?')) return;
      
      try {
          const response = await fetch(`${API_URL}/groups/${groupId}`, {
              method: 'DELETE',
          });
          
          if (!response.ok) throw new Error('Failed to delete group');
          
          setGroups(prevGroups => prevGroups.filter(g => g.id.toString() !== groupId));

      } catch (error) {
          console.error(error);
      }
  };

  if (isLoading) {
      return <div className="text-center p-10">Loading groups...</div>;
  }

  return (
      <>
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Enclosure Groups</h2>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>New Group</span>
              </button>
          </div>
          
          {groups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groups.map(group => (
                      <div key={group.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700/50 flex flex-col justify-between">
                          <div>
                              <h3 className="text-lg font-bold text-white">{group.name}</h3>
                              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{group.description || 'No description'}</p>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                              <span className="text-sm text-gray-400">{group.enclosureCount} enclosures</span>
                              <button onClick={() => handleDeleteGroup(group.id.toString())} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5"/></button>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="text-center py-16 bg-gray-800 rounded-xl border border-dashed border-gray-700">
                  <FolderKanban className="mx-auto w-12 h-12 text-gray-500"/>
                  <h3 className="mt-4 text-lg font-semibold text-white">No Groups Found</h3>
                  <p className="mt-1 text-sm text-gray-400">Get started by creating a new enclosure group.</p>
              </div>
          )}
          
          {isModalOpen && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                  <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 w-full max-w-md m-4">
                      <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold text-white">Create New Group</h3><button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><XCircle /></button></div>
                      <form onSubmit={handleAddGroup}>
                          <div className="space-y-4">
                              <div>
                                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-300 mb-1">Group Name</label>
                                  <input type="text" id="groupName" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                              </div>
                              <div>
                                  <label htmlFor="groupDesc" className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                                  <textarea id="groupDesc" value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} rows={3} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                              </div>
                          </div>
                          <div className="mt-6 flex justify-end space-x-3">
                              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
                              <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Create Group</button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
      </>
  );
};

const EnclosuresPage: FC = () => {
    const [enclosures, setEnclosures] = useState<Types.Enclosure[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEnclosure, setEditingEnclosure] = useState<Types.Enclosure | null>(null);

    const API_URL = 'http://localhost:3001/api';

    const fetchEnclosures = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/enclosures`);
            if (!response.ok) throw new Error('Failed to fetch enclosures');
            const data = await response.json();
            setEnclosures(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnclosures();
    }, []);
    
    const handleOpenModal = (enclosure: Types.Enclosure | null = null) => {
        setEditingEnclosure(enclosure);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEnclosure(null);
    };
    
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this enclosure?')) return;
        try {
            const response = await fetch(`${API_URL}/enclosures/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setEnclosures(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return <div className="text-center p-10">Loading enclosures...</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Manage Enclosures</h2>
                <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>Add Enclosure</span>
                </button>
            </div>
            
            <div className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">IP Address</th>
                                <th scope="col" className="px-6 py-3">Username</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {enclosures.map(enc => (
                                <tr key={enc.id} className="bg-gray-800 border-b border-gray-700/50 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-white">{enc.name}</td>
                                    <td className="px-6 py-4">{enc.ipAddress}</td>
                                    <td className="px-6 py-4">{enc.username}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleOpenModal(enc)} className="text-gray-400 hover:text-blue-400 mr-4"><Edit className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(enc.id)} className="text-gray-400 hover:text-red-400"><Trash2 className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {enclosures.length === 0 && (
                        <div className="text-center py-16">
                            <Server className="mx-auto w-12 h-12 text-gray-500"/>
                            <h3 className="mt-4 text-lg font-semibold text-white">No Enclosures Found</h3>
                            <p className="mt-1 text-sm text-gray-400">Add an enclosure to begin management.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <EnclosureModal 
                    enclosure={editingEnclosure} 
                    onClose={handleCloseModal}
                    onSave={fetchEnclosures}
                />
            )}
        </>
    );
};

const EnclosureModal: FC<Types.EnclosureModalProps> = ({ enclosure, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: enclosure?.name || '',
        ipAddress: enclosure?.ipAddress || '',
        username: enclosure?.username || '',
        password: '',
    });
    const [error, setError] = useState('');
    const API_URL = 'http://localhost:3001/api';
    const isEditing = !!enclosure;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const url = isEditing ? `${API_URL}/enclosures/${enclosure.id}` : `${API_URL}/enclosures`;
        const method = isEditing ? 'PUT' : 'POST';
        
        // Don't send an empty password field when editing
        const body = { ...formData };
        if (isEditing && body.password === '') {
            delete (body as any).password;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const resData = await response.json();
            if (!response.ok) throw new Error(resData.error || 'Failed to save enclosure');

            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">{isEditing ? 'Edit Enclosure' : 'Add New Enclosure'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XCircle /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Form Fields: Name, IP, Username, Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Enclosure Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">IP Address</label>
                            <input type="text" name="ipAddress" value={formData.ipAddress} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={isEditing ? 'Leave blank to keep unchanged' : ''} required={!isEditing} />
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main App Component ---
const App: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Types.Page>('dashboard')

  const pageTitles: Record<Types.Page, string> = {
    dashboard: 'Dashboard',
    groups: 'Enclosure Groups',
    enclosures: 'Enclosures'
  };

  return (
    <div className="bg-gray-900 text-gray-200 flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col w-full">
            <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between p-4 h-16 sticky top-0 z-20">
                <div className="flex items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 text-gray-400 hover:text-white"><Menu /></button>
                    <h1 className="text-xl font-semibold text-white">{pageTitles[currentPage]}</h1>
                </div>
                <div className="flex items-center space-x-5">
                    <div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" placeholder="Search..." className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <button className="relative text-gray-400 hover:text-white"><Bell /><span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span></button>
                    <div className="flex items-center space-x-3 cursor-pointer"><img src="https://placehold.co/40x40/4A5568/E2E8F0?text=A" alt="Admin" className="w-9 h-9 rounded-full object-cover" /><div><p className="font-medium text-sm text-white">admin</p><p className="text-xs text-gray-400">System Administrator</p></div><ChevronDown className="text-gray-400 w-4 h-4" /></div>
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {currentPage === 'dashboard' && <DashboardPage />}
                {currentPage === 'groups' && <GroupsPage />}
                {currentPage === 'enclosures' && <EnclosuresPage />}
            </main>
        </div>
    </div>
);
};

export default App;
