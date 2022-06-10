import React from 'react'
import { MapContainer } from 'react-leaflet'
import Layers from './Layers'

const Map = (props) => {
    const mapCenter = localStorage.getItem('centerM')?JSON.parse(localStorage.getItem('centerM')):[59.96906375537783, 30.32941039614578]           
    const zoom= localStorage.getItem('zoomM')?localStorage.getItem('zoomM'):10

    return  (                
        <MapContainer 
            center={mapCenter}                             
            zoom={zoom}    
            zoomControl={false} 
            doubleClickZoom={false}         
            style={{ height: '100%', width: '100%' }}           
        >                               
            <Layers />            
        </MapContainer>
    )
}
export default Map