import React, { useEffect } from 'react'
import { FeatureGroup, MapContainer } from 'react-leaflet'

import Layers from './Layers'
import MarkersTrg from './MarkersTrg'


const Map = (props) => {
    const mapCenter = localStorage.getItem('centerM')?JSON.parse(localStorage.getItem('centerM')):[59.96906375537783, 30.32941039614578]           
    const zoom= localStorage.getItem('zoomM')?localStorage.getItem('zoomM'):10
    const { Markers, currInfo, clearKey, clearKeyAndLines } = MarkersTrg()
   // console.log("Render Map ", currInfo)

    useEffect(()=>{
        if (currInfo){                        
           props.info(currInfo)
        }
        else            
            props.info()
    },[currInfo])

    const handleClear = () =>{
        clearKeyAndLines()
        props.info()
    }

    useEffect(()=>{       
        handleClear()         
    },[props.clrKey])

    return  (       
                 
        <MapContainer 
            center={mapCenter}                             
            zoom={zoom}    
            zoomControl={false} 
            doubleClickZoom={false}         
            style={{ height: '100%', width: '100%' }}           
        >                                       
            <Layers click={handleClear} />            
            <Markers />            
           
        </MapContainer>
    )
}
export default Map