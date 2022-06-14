import React, {useState, useCallback} from 'react'
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { AuthContext } from '../context/AuthContext';
import RotatedMarker from "./RotatedMarker";
import {FeatureGroup, useMap} from 'react-leaflet'

const flyIconMlat = new L.icon({
    iconSize:     [32, 32], 
    iconAnchor:   [16, 16], 
    tooltipAnchor:  [-12, -12],
    iconUrl: "/leaflet/images/airplane_1.png",    
  });


const Targets = (props) =>{

    const myMap = useMap();

    const {loading, request} = useHttp();
    const [dataMLAT, setDataMLAT] = useState()
    const [dataADSB, setDataADSB] = useState()  
    const auth = React.useContext(AuthContext)


    const TargetsMLAT = useCallback(()=>{        
        return (           
                <FeatureGroup>{dataMLAT}</FeatureGroup>)
    },[dataMLAT])


    const TargetsADSB = useCallback(()=>{        
        return (           
                <FeatureGroup>{dataADSB}</FeatureGroup>)
    },[dataADSB])

    const parseData = (dataP) =>{  

        const arrMLAT=[];
        const arrADSB=[];

        const cntrCRD =  JSON.parse(localStorage.getItem('centerPos'))

        const userId = JSON.parse(localStorage.getItem('userData')).userId
        //if (userId>1)
        
        for (let i=0;i<dataP.length;i++){ 
            const data = dataP[i]           
            const position = [data.geometry.coordinates[1],data.geometry.coordinates[0]]
            
            const rr = myMap.distance(L.latLng(cntrCRD.lat, cntrCRD.lng),L.latLng(position[0],position[1]))
            if (userId>1 && rr>30000)
                continue            

            if (data.properties.heading)
            {                        
                const info={
                    mode:data.properties.mode,
                    icao:data.properties.icao,
                    targetsIdentific:data.properties.name,
                    Alt:data.geometry.coordinates[2],
                    id:userId

                }    
                //console.log("i=",i,position,info)

                if (info.mode==='adsb'){
                    arrADSB.push(
                        <RotatedMarker
                            key={"trg"+data.geometry.coordinates[1]+data.geometry.coordinates[0]}
                            position={position}                    
                            rotationAngle={data.properties.heading}
                            rotationOrigin="center"                            
                            info={info}
                        />                        
                    )
                }
                else{
                    arrMLAT.push(
                        <RotatedMarker
                            key={"trg"+data.geometry.coordinates[1]+data.geometry.coordinates[0]}
                            position={position}                    
                            rotationAngle={data.properties.heading}
                            rotationOrigin="center"                            
                            info={info}                            
                        />                        
                    )
                }

            }
        }                        
        setDataMLAT(arrMLAT)
        setDataADSB(arrADSB)
       // console.log(targetsAll);
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
            if (String(e).includes('401')) 
            {
                console.log("Send logout!!");
                auth.logout();
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
   
    return {TargetsMLAT, TargetsADSB}                 
}

export default Targets