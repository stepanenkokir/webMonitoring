import React,  { forwardRef,useEffect ,useRef} from "react";
import "leaflet-rotatedmarker";
import L from "leaflet";
import { Marker,Popup, Tooltip } from "react-leaflet";

const flyIconMlat = new L.icon({
    iconSize:     [24, 24], 
    iconAnchor:   [12, 12], 
    tooltipAnchor:  [0, 0],
    iconUrl: "./leaflet/images/airplane_1.png",    
});


const flyIconAdsb = new L.icon({
    iconSize:     [24, 24], 
    iconAnchor:   [12, 12], 
    tooltipAnchor:  [0, 0],
    iconUrl: "./leaflet/images/airplane_2.png",    
});

const RotatedMarker = forwardRef(({ children, ...props }, forwardRef) => {
    const markerRef = useRef();
    const { rotationAngle, rotationOrigin, openPopup } = props;
    useEffect(() => {
        const marker = markerRef.current;
        if (marker) {
            marker.setRotationAngle(+rotationAngle);
            marker.setRotationOrigin(rotationOrigin);
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
            icon={props.info.prop.mode ==='adsb'?flyIconAdsb:flyIconMlat}
            {...props}
        >
            {children}        
            <Tooltip 
                direction="top"
                multiline={true}>
                {props.info.prop.icao.toUpperCase()+" "+
                props.info.prop.name+" "+
                props.info.crd[2]}
            </Tooltip>
        </Marker>
    );
  });

export default RotatedMarker;