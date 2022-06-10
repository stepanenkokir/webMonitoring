import React, {useEffect, useRef} from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet';

const applyRotation = (marker, _options) => {
  
    const oldIE = L.DomUtil.TRANSFORM === "msTransform";
    const options = Object.assign(_options, { rotationOrigin: "center" });
    const { rotationAngle, rotationOrigin ,} = options;
  
    if (rotationAngle && marker) {       
      marker._icon.style[L.DomUtil.TRANSFORM + "Origin"] = rotationOrigin;
  
      if (oldIE) {        
        marker._icon.style[L.DomUtil.TRANSFORM] = `rotate(${90+rotationAngle} deg)`;
      } else {        
        marker._icon.style[L.DomUtil.TRANSFORM] += ` rotateZ(${90+rotationAngle}deg)`;
      }
    }
  };

const flyIcon = L.icon({
    iconUrl: './leaflet/images/airplane_1.png',
    iconSize:     [32, 32], 
    iconAnchor:   [16, 16], 
    tooltipAnchor:  [-12, -12] 
    });
  

export default function Airplane(props){    
    const airplaneRef = useRef(null); 
    
    console.log("RENDER airplane = ",props.planer.Angle);
    useEffect(()=>{
        const render = ()=>{

          console.log("Change airplane = ",props.planer.Angle);
            const marker = airplaneRef.current;
            applyRotation(marker, { rotationAngle: props.planer.Angle, rotationOrigin:"center" });            
        };
        render();
    },[props]);

   
    return (
      <Marker key={props.planer.Angle} ref={airplaneRef} position={L.latLng(props.planer.Lat,props.planer.Lon)} icon={flyIcon} ><Popup>{props.planer.Angle}</Popup></Marker>
    )

}
