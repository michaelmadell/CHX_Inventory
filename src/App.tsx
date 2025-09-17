import { useState, useEffect } from 'react'
import { type EnclosureData } from './types'
import EnclosureTabs from './components/EnclosureTabs'
import EnclosureDetails from './components/EnclosureDetails'
import { Server } from 'lucide-react'
import CHXLogo from '../public/CHX.png'; 
import AHKLogo from '../public/GUI1.png';

type EnclosureMap = {
  [key: string]: EnclosureData;
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enclosures, setEnclosures] = useState<EnclosureMap>({});
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const indexResponse = await fetch('/data/index.json');
        if (!indexResponse.ok) {
          throw new Error(`Failed to fetch index: ${indexResponse.statusText}`);
        }
        const enclosureFiles: string[] = await indexResponse.json();

        if (enclosureFiles.length === 0) {
          throw new Error('No enclosure files found in index.');
        }

        const enclosurePromises = enclosureFiles.map(file => 
          fetch(`/data/${file}`).then(res => res.json())
        );
        const allEnclosureData: EnclosureData[] = await Promise.all(enclosurePromises);

        const enclosureMap: EnclosureMap = {};
        allEnclosureData.forEach((data, index) => {
          const fileName = enclosureFiles[index];
          enclosureMap[fileName] = data;
        });

        setEnclosures(enclosureMap);
        setActiveTab(enclosureFiles[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  const activeEnclosureData = enclosures[activeTab];

  if (loading) {
    return <div className='p-8 text-center'>Loading...</div>;
  }

  if (error) {
    return <div className='p-8 text-center text-red-600'>Error: {error}</div>;
  }

  return (
    <div className='bg-gray-200'>
      <header className='w-full flex justify-center p-4'>
        <div className='w-[80%] flex justify-between h-[80%] p-3 bg-gray-50 rounded-md shadow-md'>
        <img alt='Amulet Hotkey Logo' src={AHKLogo} className='flex h-min w-[8rem]'></img>
        <div className='inline-flex'>
          <Server size={30} className='mr-5 self-center'/>
          <h1 className="text-3xl self-center font-bold trackking-tight">Enclosure Inventory</h1>
          </div>
          <img alt='CoreStation HX Logo' src={CHXLogo} className='flex justify-self-end h-min w-[8rem]'></img>
          </div>
      </header>

      <EnclosureTabs
        enclosureFiles={Object.keys(enclosures)}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <main className='bg-gray-300'>
        {activeEnclosureData ? (
          <EnclosureDetails enclosureData={activeEnclosureData} />
        ) : (
          <div className='p-8 text-center'>No data available for the selected enclosure.</div>
        )}
      </main>
    </div>
  )
}

export default App