import React from 'react'

export default function DestinationPicker({locations, setLocation, current}) {
  return (
    <section className={"destinations"}>
        {
            locations.map((location, i) => 
                <span key={i} className={'destination' + ((current._id === location._id) ? ' current' : '')} onClick={(e) => {
                    if (current._id === location._id) return;
                    setLocation({...location});
                    console.log('Setter', location.name);
                    }}>
                    {location.name}
                </span>
            )
        }
    </section>
  )
}
