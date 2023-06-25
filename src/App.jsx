import { useContext, useEffect, useState } from 'react'
import './App.css'
import getParkingData from './Pharming/getter'
import CarparkManager from './Carpark/Manager';
import Header from './Header';
import DestinationPicker from './DestinationPicker';

function App() {

  const norwichCentre = {
    _id: 1,
    name: 'City Center',
    latitude: 52.628548,
    longitude: 1.292850,
  }

  const norwichStadium = {
    _id: 2,
    name: 'Stadium',
    latitude: 52.622091,
    longitude: 1.309129,
  }

  const norwichRiverside = {
    _id: 3,
    name: 'Riverside',
    latitude: 52.625556,
    longitude: 1.304052,
  }

  const [carParks, setParking] = useState(null);
  const [centre, selectedCentre] = useState(norwichCentre);

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
      <Header/>
      <DestinationPicker locations={[norwichCentre, norwichRiverside, norwichStadium]} setLocation={selectedCentre} current={centre}/>
      <CarparkManager locations={carParks} centre={centre}/>
    </section>
  )
}

export default App
