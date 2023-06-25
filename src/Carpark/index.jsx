import './Carpark.css';
import React from 'react'

export default function Carpark({location}) {
    console.log(location);
    const statusMap = {
        carParkClosed: 'CLOSED',
    }
  return (
    <div className='carpark'>
        <h1>{location.name}</h1>
        <h2>{statusMap[location.status] || 'OPEN'}</h2>
        <div className='stats'>
            <span className='occupancy'>"Occupancy"<span>{location.occupancy}</span></span>
            <span className='spacesTaken'>Spaces Taken<span>{location.spacesTaken}</span></span>
            <span className='capacity'>Total Capacity<span>{location.capacity}</span></span>
            <span className='available'>Parking Available<span>{location.capacity-location.spacesTaken}</span></span>
            <span className='filledPerc'>Capacity Filled<span>{Math.round(location.spacesTaken/location.capacity*10000)/100}%</span></span>
        </div>
    </div>
  )
}
