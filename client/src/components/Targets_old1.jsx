import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react'
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { AuthContext } from '../context/AuthContext';
import {FeatureGroup, useMap, Marker, Popup} from 'react-leaflet'
import "leaflet-rotatedmarker";

const Targets = (props) =>{

       
    const {loading, request} = useHttp();
    const [dataMLAT, setDataMLAT] = useState()
    const [arrDataADSB, setArrDataADSB] = useState()
    const [oldDataADSB, setOldDataADSB] = useState()
    const [dataADSB, setDataADSB] = useState()  
    const auth = React.useContext(AuthContext)

    const adsbRef = useRef([]);

    console.log("Render targets")

    const TargetsMLAT = useCallback(()=>{        
        return (           
                <FeatureGroup>{dataMLAT}</FeatureGroup>)
    },[dataMLAT])


    const TargetsADSB = useCallback(()=>{        
        return ([dataADSB])
    },[dataADSB])


    const parseData = (dataP) =>{       
        console.log("parseData",dataP,arrDataADSB)
       
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
        clearInterval(timeoutContext.current)        
        timeoutContext.current = setInterval(()=>{          
            readContextFromServer()            
        },5000);
        return ()=> clearInterval(timeoutContext.current)    
    },[arrDataADSB])    

    
    React.useEffect(() =>{  
        readContextFromServer()                
    },[])
   
    return {TargetsMLAT, TargetsADSB}                 
}

export default Targets