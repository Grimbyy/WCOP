import React, { useEffect, useState } from 'react'

import Carpark from '.';

// https://www.movable-type.co.uk/scripts/latlong.html
function getDistance(loc1, loc2) {
    const lat1 = loc1.latitude;
    const lon1 = loc1.latitude;
    const lat2 = loc2.latitude;
    const lon2 = loc2.latitude;
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // in metres
}

export default function Manager({locations, centre}) {

    const [parks, setParks] = useState(null);

    function byRelevance(loc1, loc2) {
        const X_1 = distance(loc1, loc2);
        const X_2 = fullness(loc1, loc2);
        const X_3 = spacesAvailable(loc1, loc2);
        const closed1 = loc1.status === 'carParkClosed' ? Infinity : 0;
        const closed2 = loc2.status === 'carParkClosed' ? Infinity : 0;
        const X_4 = closed1 - closed2;
        if (!!X_4) return X_4;

        return ((X_1*0.6) + (X_2*0.3) + (X_3*0.1))
    }

    function distance(loc1,loc2) {
        const distance1 = getDistance(centre, loc1.location);
        loc1.distance = distance1;
        const distance2 = getDistance(centre, loc2.location);
        loc2.distance = distance2;
        return distance1 - distance2;
    }

    function fullness(loc1,loc2) {
        const fullness1 = loc1.spacesTaken/loc1.capacity;
        const fullness2 = loc2.spacesTaken/loc2.capacity;
        return fullness1 - fullness2;
    }

    function spacesAvailable(loc1,loc2) {
        const available1 = loc1.capacity-loc1.spacesTaken;
        const available2 = loc2.capacity-loc2.spacesTaken;
        return available2 - available1;
    }

    useEffect(() => {
        if (!locations || !centre) return;
        setParks(locations);
    }, [locations, centre])

    if (!parks) return <h1>Loading...</h1>

  return (
    <section className='parkManager'>
    {
        parks.sort(byRelevance).map((park, i) => <Carpark key={i} location={park} centre={centre}/>)
    }
    </section>
  )
}
