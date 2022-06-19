import React, {useState, useCallback,  useRef} from 'react'
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { AuthContext } from '../context/GlobalContext';
import {FeatureGroup, useMap, Marker, Popup, Tooltip} from 'react-leaflet'
import "leaflet-rotatedmarker";
import { useEffect } from 'react';

const Targets = (props) =>{

    const auth = React.useContext(AuthContext)
    const {loading, request} = useHttp();
   
   // const [dataMLAT, setDataMLAT] = useState()
   // const [dataADSB, setDataADSB] = useState()  
    const [dataTarget, setDataTarget] = useState([])  

    
    // const [arrDataADSB, setArrDataADSB] = useState()
    // const [oldDataADSB, setOldDataADSB] = useState()
        
    const markerRef = useRef([]);
        
    // const TargetsMLAT = useCallback(()=>{    
    //     console.log("NEW MLAT",dataMLAT)    
    //     return (           
    //             <FeatureGroup>{dataMLAT}</FeatureGroup>)
    // },[dataMLAT])


    // const TargetsADSB = useCallback(()=>{ 
    //     console.log("NEW ADSB",dataADSB)           
    //     return ([dataADSB])
    // },[adsbRef])

    console.log("Render Targets", auth.showADSB, auth.showMLAT,markerRef)

    
    // const TargetsMarkers = useCallback(()=>{ 
    //     if (dataTarget.length>0){
    //         console.log("NEW ADSB :",dataTarget)                 
    //         return ([])
    //     }
    //     else
    //         return ([])
    // },[dataTarget])



    const TargetsMarkers = ()=>{ 
        if (dataTarget.length>0){
            console.log("NEW ADSB :",dataTarget)                 
            return ([])
        }
        else
            return ([])
    }

    const parseData = (dataP) =>{       
        console.log("parseData",dataP, dataTarget)
        const lTime =  new Date().getTime()/1000               
        const arrTrg=[]
/*
        for (let i=0;i<dataP.length;i++){ 
            const data = dataP[i]           
            const key = data.properties.mode+data.properties.icao+data.properties.name
            const position = [data.geometry.coordinates[1],data.geometry.coordinates[0]]            

            const indx = dataTarget.map(dataT=>dataT.key).indexOf(key)            
            if (indx==-1){
                console.log("Add new ",data)
                arrTrg.push({
                    key: key,
                    pos:position,
                    old_pos:position,
                    time:lTime,
                    heading:data.properties.heading,
                    icao:data.properties.icao,
                    mode:data.properties.mode,
                    modeA:data.properties['mode-a'],
                    name:data.properties.name,
                    vSt:data.properties['visible-stations'],
                    eSt:data.properties['error-stations'],                   
                })
            }            
            //  if (i<2)
            //      console.log(i, key, position, markerRef.current)
                        

        }  
        
        
        if (arrTrg.length>0)    
            setDataTarget(arrTrg)
       // console.log(markerRef.current, arrTrg)
       
       */
    }

    const readContextFromServer = async ()=>{
        try{            
            const response = await request('/mlat/current','GET',null,{
                  Authorization: `Bearer ${auth.token}`
            });                                           
            if (response) 
                if (response.data)
                    if (response.data.features)                    
                    setDataTarget(response.data.features);
        
        }catch(e){
            //console.log("Error CURRENT ==> ",e);
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


    const recalc = ()=>{
        // const lTime =  new Date().getTime()/1000 % 5
        // //console.log(72*lTime, markerRef.current.length)        
        //  for (let i=0;i<markerRef.current.length;i++){
        //         const mrk = markerRef.current[i]
        //         const angle = mrk.options.rotationAngle
        //        // if (i==0) console.log(mrk.options.rotationAngle, angle, +angle + lTime*72)
        //         mrk.setRotationAngle(+angle + 14)
        //     }
    }
    
    const timeoutRecalc = React.useRef(null);
    React.useEffect(() =>{                        
        timeoutRecalc.current = setInterval(()=>{          
            recalc();                                  
        },200);
        return ()=> clearInterval(timeoutRecalc.current)    
    },[])    

    
    React.useEffect(() =>{  
        readContextFromServer()                 
    },[])    
   
    return { TargetsMarkers }                 
}

export default Targets