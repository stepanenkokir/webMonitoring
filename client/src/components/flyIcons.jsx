import React from 'react'
import L from 'leaflet'

const flyIcons = (props) =>{        
 
    const mediumMlat = new L.icon({
        iconSize:     [30, 30], 
        iconAnchor:   [15, 15], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/icon_medium_m.svg",       
    });
    const mediumAdsb = new L.icon({
        iconSize:     [30, 30], 
        iconAnchor:   [15, 15], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/icon_medium_a.svg",       
    });

    const smallMlat = new L.icon({
        iconSize:     [24, 24], 
        iconAnchor:   [12, 12], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/icon_small_m.svg",       
    });
    const smallAdsb = new L.icon({
        iconSize:     [24, 24], 
        iconAnchor:   [12, 12], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/icon_small_a.svg",       
    });

    const largeMlat = new L.icon({
        iconSize:     [36, 36], 
        iconAnchor:   [18, 18], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/icon_large_m.svg",       
    });
    const largeAdsb = new L.icon({
        iconSize:     [36, 36], 
        iconAnchor:   [18, 18], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/icon_large_a.svg",       
    });

    const triangleAdsb = new L.icon({
        iconSize:     [20, 20], 
        iconAnchor:   [10, 10], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/triangle_a.svg",       
    });

    const triangleMlat = new L.icon({
        iconSize:     [20, 20], 
        iconAnchor:   [10, 10], 
        tooltipAnchor:  [0, 0],    
        iconUrl: "./leaflet/images/triangle_m.svg",       
    });
       

    const flyIconNone = new L.icon({
        iconSize:     [0, 0],  
        iconUrl: "./leaflet/images/airplane_2.png",           
    });


    return {mediumMlat, mediumAdsb, 
        smallMlat, smallAdsb, 
        largeMlat,  largeAdsb, 
        triangleMlat, triangleAdsb,         
        flyIconNone}
}

export default flyIcons