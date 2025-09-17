export interface Psu {
    id: number;
    serial?: string;
    serialNumber?: string;
    manufacturer: string;
    model: string;
    maxPower: string;
}

export interface Fan {
  id: number;
  moduleSerialNumber: string;
  moduleRevision: string;
  moduleBuildTime: string;
  fanSerialNumber: string;
  fanManufacturer: string;
  fanModel: string;
  maxSpeed: number | null;
}

export interface SwitchDevice {
    model: string;
    serialNumber: string;
    firmwareVersion: string;
    hostIp: string;
}

export interface Node {
  id: number;
  hostname: string;
  netExtIpv4?: string;
  serialNumber: string;
  model: string;
  cpu: string;
  gpu: string;
  ram0: number | null;
  ram1: number | null;
  os?: string;
  nodeName: string;
  nodeGroup?: string;
  nodeRole?: string;
  netIntMac: string;
  netExtMac: string;
}

export interface FirmwareData {
  version: string;
  packageDate: string;
  installDate: string;
}

export interface Location {
  datacenter: string;
  room: string;
  aisle: string;
  rack: string;
  rackSlot: string;
}

export interface MgmtInfo {
  serialNumber: string;
  firmwareVersion: string;
  hostname: string;
  hostIp: string;
  alias: string;
  ipAssignment: string;
  gateway: string;
  netmask: string;
  dns: string[];
  fqdn: string;
}

export interface EnclosureData {
  hardwareVersion: string;
  serialNumber: string;
  firmwareVersion: string;
  hostname: string;
  alias?: string;
  hostIp: string;
  switchDevice: SwitchDevice;
  psus: Psu[];
  fans: Fan[];
  nodes: Node[];
  firmwareData: FirmwareData[];
  locations: Location[];
  mgmtInfo: MgmtInfo[];
}

