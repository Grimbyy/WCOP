import { useContext, useEffect, useState } from 'react'
import './App.css'
import getParkingData from './Pharming/getter'

import Carpark from './Carpark';

function App() {
  const [carParks, setParking] = useState(null);

  useEffect(() => {
    getParkingData((data) => {
      setParking(data);
    });
    const refreshInterval = setInterval(() => {
      getParkingData((data) => {
        setParking(data);
      });
    }, 300000);
    return () => clearInterval(refreshInterval);
  }, []);

  if (!carParks) return <h1 className='loading-title'>Loading...</h1>

  return (
    <section>
      {
        carParks.map((carpark, i) => <Carpark key={i} location={carpark}/>)
      }
    </section>
  )
}

export default App
