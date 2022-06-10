import React,  { forwardRef,useEffect ,useRef} from "react";
import "leaflet-rotatedmarker";
import L from "leaflet";
import { Marker,Popup, Tooltip } from "react-leaflet";

const flyIconMlat = new L.icon({
    iconSize:     [32, 32], 
    iconAnchor:   [16, 16], 
    tooltipAnchor:  [-12, -12],
    iconUrl: "./leaflet/images/airplane_1.png",    
  });

const flyIconAdsb = new L.icon({
    iconSize:     [32, 32], 
    iconAnchor:   [16, 16], 
    tooltipAnchor:  [-12, -12],
    iconUrl: "./leaflet/images/airplane_2.png",    
  });

const RotatedMarker = forwardRef(({ children, ...props }, forwardRef) => {
    const markerRef = useRef();
  
    const { rotationAngle, rotationOrigin } = props;
    useEffect(() => {
      const marker = markerRef.current;
      if (marker) {
        marker.setRotationAngle(+rotationAngle+90);
        marker.setRotationOrigin(+rotationOrigin+90);
      }     
    }, [rotationAngle, rotationOrigin]);
  
    return (        
      <Marker
        ref={(ref) => {
          markerRef.current = ref;
          if (forwardRef) {
            forwardRef.current = ref;
          }
        }}

        icon={props.info.mode ==='adsb'?flyIconAdsb:flyIconMlat}

        {...props}
      >
        {children}        
        <Popup>{props.info.icao.toUpperCase()+"\n"+props.info.targetsIdentific+"\n"+props.info.Alt}</Popup>
      </Marker>
    );
  });

  export default RotatedMarker;