import React, { useEffect, useState } from 'react'
import { MapContainer } from 'react-leaflet'
import Layers from './Layers'
import Context from './Context'


const Map = (props) => {

    const [mapCenter,setMapCenter]=useState([59.96906375537783, 30.32941039614578])
    const [zoom,setZoom]=useState(9)

    
    useEffect(()=>{

        console.log("Show map NEW PROPS",props);

    },[props])

    return  (                
        <MapContainer 
            center={mapCenter}                             
            zoom={zoom} 
            
            style={{ height: '100%', width: '100%' }}           
        >                               
            <Layers />              
            <Context logout={props.logout} icao={props.icao} />
        </MapContainer>
    )
}
export default Map