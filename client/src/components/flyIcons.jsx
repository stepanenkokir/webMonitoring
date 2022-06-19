import React from 'react'
import L from 'leaflet'

const flyIcons = (props) =>{        
 
    const flyIconMlat = new L.icon({
        iconSize:     [24, 24], 
        iconAnchor:   [12, 12], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/icon_medium.svg",       
    });
    
    const flyIconAdsb = new L.icon({
        iconSize:     [24, 24], 
        iconAnchor:   [12, 12], 
        tooltipAnchor:  [0, 0],
        iconUrl: "./leaflet/images/airplane_2.png",    
    });

    const flyIconNone = new L.icon({
        iconSize:     [0, 0],  
        iconUrl: "./leaflet/images/airplane_2.png",           
    });


    return {flyIconMlat, flyIconAdsb, flyIconNone}
}

export default flyIcons