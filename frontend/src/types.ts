export type Page = 'dashboard' | 'groups' | 'enclosures';

export type StatCardIconName = 'ShieldCheck' | 'AlertTriangle' | 'HardDrive' | 'Zap';

export interface StatCardProps {
  title: string;
  value: string;
  icon: StatCardIconName;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

export interface LogEntryProps {
  timestamp: string;
  severity: 'Critical' | 'Warning' | 'Info';
  device: string;
  message: string;
}

export type IconName = 'LayoutDashboard' | 'Server' | 'Cpu' | 'FileText' | 'Settings' | 'FolderKanban';

export interface NavLinkProps {
    icon: IconName;
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    isButton?: boolean;
    isMenuOpen?: boolean;
}

export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    enclosureCount: number;
    created_at: string;
}

export interface Enclosure {
  id: string,
  name: string,
  ipAddress: string, 
  username: string
}

export interface EnclosureModalProps {
  enclosure: Enclosure | null;
  onClose: () => void;
  onSave: () => void;
}