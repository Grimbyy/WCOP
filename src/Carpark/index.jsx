import './Carpark.css';
import React, {useState, useEffect} from 'react'

export default function Carpark({location, centre}) {
    const statusMap = {
        carParkClosed: 'CLOSED',
    }

    const [parkStatus, setParkStatus] = useState(null);
    const [displayDistance, setDisplayDistance] = useState(null);

    useEffect(() => {
      if (!location || !centre) return;
      setParkStatus(location.status in statusMap && (Math.round(location.spacesTaken/location.capacity*10000)/100) < 10 ? statusMap[location.status] : 'OPEN')
      setDisplayDistance(location.distance > 1000 ? `${Math.round(location.distance/10)/100}km` : `${Math.round(location.distance)}m`);
    }, [location, centre]);

    //https://stackoverflow.com/a/7128796
    const percentColors = [
      { pct: 0.0, color: { r: 122, g: 168, b: 99 } },
      { pct: 0.65, color: { r: 122, g: 168, b: 99 } },
      { pct: 1.0, color: { r: 255, g: 0, b: 0 } } ];
    //https://stackoverflow.com/a/7128796
    const getColorForPercentage = function(pct) {
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        var lower = percentColors[i - 1];
        var upper = percentColors[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        // or output as hex if preferred
    };

    if (!displayDistance || !parkStatus) return <h1>Loading...</h1>

    function handleHold(e) {
      let time = 0;
      const to = setInterval(() => {time+=1;onTick()}, 1000);
      e.target.onmouseup = (e) => {
        clearInterval(to);
        if (time < 1) {
          openLocationMaps(e);
        }
      };
      e.target.ontouchend = (e) => {
        clearInterval(to);
        if (time < 1) {
          openLocationMaps(e)
        }
      };

      function onTick() {
        if (time > 0) {
          e.target.onmouseup = null;
          e.target.ontouchend = null;
          if(window.confirm("You've held that for a while... \nWould you like to get directions?")) {
            openLocationMaps(e, true)
          } else {
            clearInterval(to);
          };
        }
      }
    }

    function openLocationMaps(e, useGoogle = false) {
      e.preventDefault();
      console.log(useGoogle);
      if (useGoogle) {
        window.open(`comgooglemaps://?api=1&travelmode=driving&layer=traffic&destination=${location.location.latitude},${location.location.longitude}`);
      } else {
        window.open(`http://maps.apple.com/?daddr=${location.location.latitude},${location.location.longitude}&travelmode=driving&layer=traffic`);
      }
    }

  return (
    <div className='carpark'>
      <h1>{location.name} <span onMouseDown={handleHold} onTouchStart={handleHold}>🚘</span></h1>
        <div className='stats'>
            <span className='large-stat'>{parkStatus}</span>
            <span className='large-stat loader-stat' style={{
              '--preferred-width': (location.spacesTaken/location.capacity),
              '--preferred-colour': getColorForPercentage(location.spacesTaken/location.capacity)
              }}
              data-target={`${Math.round(location.spacesTaken/location.capacity*1000)/10}%`}></span>
            <span className='large-stat'><span>{displayDistance}</span></span>
            <span className='small-stat'>Capacity<span>{location.capacity}</span></span>
            <span className='small-stat'>Taken<span>{location.spacesTaken}</span></span>
            <span className='small-stat'>Available<span>{location.capacity-location.spacesTaken}</span></span>
        </div>
    </div>
  )
}
