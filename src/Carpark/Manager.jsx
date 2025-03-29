/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'

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
        const X_1 = loc1.__manager_data.distance;
        const X_2 = loc1.__manager_data.fullness;
        const X_3 = loc1.__manager_data.available;
        const Y_1 = loc2.__manager_data.distance;
        const Y_2 = loc2.__manager_data.fullness;
        const Y_3 = loc2.__manager_data.available;
        const closed1 = loc1.status === 'carParkClosed' ? Infinity : 0;
        const closed2 = loc2.status === 'carParkClosed' ? Infinity : 0;
        const X_4 = closed1;
        const Y_4 = closed2;

        // Closed goes right to the bottom
        if (X_4 > Y_4) {
            return 1;
        } else if (X_4 < Y_4) {
            return -1;
        }
        // Care more about distance, haggle over fullness, number of free spaces is an afterthought
        return (
            (X_1 - Y_1)*(7/3)
            + (X_2 - Y_2)*0.1
            + (Y_3 - X_3)*0.05
        )
    }

    function relevanceStats(loc) {
        const distance = getDistance(centre, loc.location);
        loc.distance = distance;
        const fullness = loc.spacesTaken/loc.capacity;
        const available = loc.capacity-loc.spacesTaken;

        return { ...loc, __manager_data: { distance, fullness, available }};
    }

    function normaliseStats(arr) {
        const distances = arr.map((park) => park.__manager_data.distance).sort((a, b) => a-b);
        const availability = arr.map((park) => park.__manager_data.available).sort((a, b) => a-b);
        const minDist = distances[0];
        const maxDist = distances[distances.length-1];
        const minAvailable = availability[0];
        const maxAvailable = availability[availability.length-1];
        return arr.map((park) => ({
            ...park,
            __manager_data: {
                distance: (park.__manager_data.distance - minDist) / maxDist,
                fullness: park.__manager_data.fullness,
                available: (park.__manager_data.available - minAvailable) / maxAvailable
            }
        }));
    }

    useEffect(() => {
        if (!locations || !centre) return;
        setParks(locations);
    }, [locations, centre])

    if (!parks) return <h1>Loading...</h1>

  return (
    <section className='parkManager'>
    {
        normaliseStats(parks.map(relevanceStats)).sort(byRelevance).map((park, i) => <Carpark key={i} location={park} centre={centre}/>)
    }
    </section>
  )
}
