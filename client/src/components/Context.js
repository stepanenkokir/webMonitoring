import React, {useEffect, useState} from 'react'
import { Tooltip, FeatureGroup } from 'react-leaflet'
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { AuthContext } from '../context/AuthContext';
import RotatedMarker from "./RotatedMarker";

const flyIconMlat = new L.icon({
    iconSize:     [32, 32], 
    iconAnchor:   [16, 16], 
    tooltipAnchor:  [-12, -12],
    iconUrl: "/leaflet/images/airplane_1.png",    
  });


export  default function Context(props){   
    const {loading, request} = useHttp();
    const [targetsMLAT, setTargetsMLAT] = useState([])
    const [targetsADSB, setTargetsADSB] = useState([])  
    const auth = React.useContext(AuthContext)

    const parseData = (dataP) =>{               
        const TargetsAll = dataP.map((data,id)=>{                           
            const position = [data.geometry.coordinates[1],data.geometry.coordinates[0]]           
           // console.log(id,data)
            if (data.properties.heading)
            {                        
                const info={
                    mode:data.properties.mode,
                    icao:data.properties.icao,
                    targetsIdentific:data.properties.name,
                    Alt:data.geometry.coordinates[2]
                }      
                return (                    
                        <RotatedMarker
                            key={data.geometry.coordinates[1]+data.geometry.coordinates[0]}
                            position={position}                    
                            rotationAngle={data.properties.heading}
                            rotationOrigin="center"                            
                            info={info}
                        />                        
                )
            }
        });
        setTargetsMLAT(TargetsAll)
       // console.log(TargetsAll);
    }

    const readContextFromServer = async ()=>{       
        try{
            const response = await request('/mlat/current','GET',null,{
                Authorization: `Bearer ${auth.token}`
            });                      
            if (response)                     
                parseData(response.data.features);
        
        }catch(e){
           // console.log("Error CURRENT ==> ",e);
            if (String(e).startsWith('Error: 401')) 
            {
                console.log("Send logout!!");
                props.logout(true);
            }
                
        }
    }

    const timeoutContext = React.useRef(null);
    React.useEffect(() =>{           
        timeoutContext.current = setInterval(()=>{          
            readContextFromServer()            
        },5000);
        return ()=> clearInterval(timeoutContext.current)    
    },[])    

    React.useEffect(() =>{  
        readContextFromServer()                
    },[])



   
    return (        
        <>
          {targetsMLAT}         
        </>
    )

}
