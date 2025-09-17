import React, {useState} from 'react';
import { type EnclosureData, type Node, type Location, type Psu } from '../types';
import FanCard from './FanCard';
import { PcCase, PanelsTopLeft, MapPin, EthernetPort, Cable, HardDrive, Fan } from 'lucide-react';
import NodeModal from './NodeModal';

const DetailItem = ({ label, textColor, value, isSecret = false }: { label: string, textColor?: string, value?: string, isSecret?: boolean }) => (
    <div className='py-2'>
        <dt className='text-sm font-medium text-gray-700'>{label}</dt>
        <dd className={`mt-1 text-sm ${isSecret ? 'blur-sm hover:blur-none transition-all' : ''} ${textColor ?? 'text-gray-900'}`}>
            {value || 'N/A'}
        </dd>
    </div>
);

const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
  <h3 className="text-lg font-semibold leading-6 text-gray-700">
    {title}
    {count !== undefined && <span className="text-sm font-normal text-gray-600"> ({count} items)</span>}
  </h3>
);


const NodeRow = ({ node, onRowClick }: { node: Node, onRowClick: (node: Node ) => void }) => {
  // Handle null RAM values
  const totalRam = (node.ram0 ?? 0) + (node.ram1 ?? 0);
  return (
    <tr 
      className={`${node.hostname ? 'bg-gray-200 hover:bg-gray-50' : 'bg-gray-400/50'}`}
      onClick={() => onRowClick(node)}
      >
      <td className="p-4 text-sm font-medium text-center text-gray-700">{node.id|| 'N/A'}</td>
      <td className={`p-4 text-sm font-medium ${node.hostname ? 'text-gray-700' : 'text-black'}`}>{node.hostname || 'Empty'}</td>
      <td className="p-4 text-sm font-medium text-gray-600 font-mono">{node.netExtIpv4 || 'N/A'}</td>
      <td className="p-4 text-sm font-medium text-gray-500">{node.model || 'N/A'}</td>
      <td className="p-4 text-sm font-medium text-gray-600 font-mono">{node.serialNumber || 'N/A'}</td>
      <td className="p-4 text-sm font-medium text-gray-500">{node.cpu || 'N/A'}</td>
      <td className="p-4 text-sm font-medium text-gray-500">{node.gpu || 'N/A'}</td>
      <td className="p-4 text-sm font-medium text-center text-gray-500">{totalRam > 0 ? `${totalRam} GB` : 'N/A'}</td>
    </tr>
  );
};

const PsuInfoCard = ({ psu }: { psu: Psu }) => {
  return (
    <tr>
      <td className="text-sm text-center w-5 font-mono">{psu.id|| 'N/A'}</td>
      <td className={`p-4 text-sm font-medium`}>{psu.model || 'Empty'}</td>
      <td className="p-4 text-sm font-medium text-gray-600">{psu.manufacturer || 'N/A'}</td>
      <td className="p-4 text-sm font-medium text-gray-500 font-mono">{psu.maxPower + "W" || 'N/A'}</td>
      <td className="p-4 text-sm font-medium text-gray-600 font-mono"><span className='p-1 bg-gray-300 rounded-md'>{psu.serial || psu.serialNumber || 'N/A'}</span></td>
    </tr>
  );
};

const LocationCard = ({ location }: { location: Location }) => (
  <div className="bg-gray-200 p-6 rounded-lg shadow-lg h-full">
    <div className='content-center inline-flex'>
      <MapPin className='mr-2'/>
      <SectionHeader title="Location" />
      </div>
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6">
      <DetailItem label="Datacenter" value={location.datacenter} />
      <DetailItem label="Room" value={location.room} />
      <DetailItem label="Aisle" value={location.aisle} />
      <DetailItem label="Rack" value={location.rack} />
      <div className="col-span-2">
       <DetailItem label="Rack Slot" value={location.rackSlot} />
      </div>
    </dl>
  </div>
);

interface EnclosureDetailsProps {
  enclosureData: EnclosureData;
}

export default function EnclosureDetails({ enclosureData }: EnclosureDetailsProps) {
  const { hardwareVersion, serialNumber, firmwareVersion, hostname, hostIp, switchDevice, psus, nodes, fans, firmwareData, locations, mgmtInfo } = enclosureData;
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const mainMgmtInfo = mgmtInfo?.[0];
  const mainLocation = locations?.[0];
  const mainFwData = firmwareData?.[0];

  const installDate = mainFwData.installDate;
  const buildDate = mainFwData.packageDate;

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"}
    return new Date(dateString).toUTCString()
  }

  if (!enclosureData) {
    return <div>No enclosure data provided.</div>;
  }

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const handleCloseModal = () => {
    setSelectedNode(null);
  }

  return (
    <>
    <div className="font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Main Header Card */}
        <section className="bg-gray-200 p-6 rounded-lg shadow-lg">
          <div className='flex content-center'><h2 className="flex text-2xl font-bold tracking-tight text-gray-700"><PcCase className='flex w-auto h-auto mr-2'/>{hostname}</h2></div>
          <dl className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
            <DetailItem label="Serial Number" value={serialNumber} />
            <DetailItem label="IP Address" value={hostIp} />
            <DetailItem label="Firmware" value={firmwareVersion} />
            <DetailItem label="Hardware Version" value={hardwareVersion} />
          </dl>
        </section>

        {/* Info Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-2 bg-gray-200 p-6 rounded-lg shadow-lg">
              <div className='inline-flex content-center'>
                <EthernetPort className='mr-2' />
                <SectionHeader title="Switch & Management" />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6">
                      {/* --- Switch Device Info --- */}
                      <DetailItem label="Switch Model" value={switchDevice.model} />
                      <DetailItem label="Switch S/N" value={switchDevice.serialNumber} />
                      <DetailItem label="Firmware Version" value={mainFwData.version} />
                      {/* --- Mgmt Info --- */}
                      {mainMgmtInfo && (
                        <>
                          <DetailItem label="Hostname" value={mainMgmtInfo.hostname} />
                          <a href={`https://${mainMgmtInfo.hostIp}`}>
                            <DetailItem label="Host IP" textColor={'text-blue-800 hover:text-blue-500'} value={mainMgmtInfo.hostIp} />
                          </a>
                          <DetailItem label="IP Assignment" value={mainMgmtInfo.ipAssignment} />
                          <DetailItem label="Gateway" value={mainMgmtInfo.gateway} />
                          <DetailItem label="Netmask" value={mainMgmtInfo.netmask} />
                          <DetailItem label="DNS" value={mainMgmtInfo.dns.join(', ')} />
                            <DetailItem label="FQDN" value={mainMgmtInfo.fqdn} />
                          <DetailItem label="Firmware Installed On" value={formatDate(mainFwData.installDate)} />
                          <DetailItem label="Firmware Built On" value={formatDate(mainFwData.installDate)} />
                        </>
                      )}
                  </dl>
            </div>
          
        </div>

        {/* Components Grid Section */}
        <div className="grid grid-flow-col gap-8">
          {mainLocation && <LocationCard location={mainLocation} />}
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <div className='inline-flex content-center'>
                <Cable className='mr-2'/>
                <SectionHeader title="PSUs" count={psus.length} />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Wattage</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {psus.map(psu => <PsuInfoCard key={psu.id} psu={psu} />)}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>

        {/* Nodes Section */}
        <section className="bg-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 inline-flex">
            <HardDrive className='mr-2'/>
            <SectionHeader title="Nodes" count={nodes.length} />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase">Pos</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Hostname</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Serial</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">CPU</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">GPU</th>
                  <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase">RAM</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 hover:cursor-pointer">
                {nodes.map(node => <NodeRow key={node.id} node={node} onRowClick={handleNodeClick} />)}
              </tbody>
            </table>
          </div>
        </section>

        {/* Fans Section */}
        <section className="bg-gray-200 p-6 rounded-lg shadow-lg">
          <div className='inline-flex'>
            <Fan className='flex mr-2' />
            <SectionHeader title="Fans" count={fans.length} />
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {fans.map(fan => <FanCard key={fan.id} fan={fan} />)}
            </div>
        </section>
      </div>
    </div>
    <NodeModal
      isOpen={!!selectedNode}
      onClose={handleCloseModal}
      node={selectedNode}
      />
    </>
  );
}