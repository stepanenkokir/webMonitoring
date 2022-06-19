import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react'
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { AuthContext } from '../context/AuthContext';
import {FeatureGroup, useMap, Marker} from 'react-leaflet'
//import RotatedMarker from './RotatedMarker';
import "leaflet-rotatedmarker";

const Targets = (props) =>{

    const myMap = useMap();
       
    const {loading, request} = useHttp();
    const [dataMLAT, setDataMLAT] = useState()
    const [arrDataADSB, setArrDataADSB] = useState()
    const [oldDataADSB, setOldDataADSB] = useState()
    const [dataADSB, setDataADSB] = useState()  
    const auth = React.useContext(AuthContext)

    const adsbRef = useRef([]);
    console.log("START TARGETS!!!")

    const TargetsMLAT = useCallback(()=>{        
        return (           
                <FeatureGroup>{dataMLAT}</FeatureGroup>)
    },[dataMLAT])


    const TargetsADSB = useCallback(()=>{        
        return (           
                <FeatureGroup>{dataADSB}</FeatureGroup>)
    },[dataADSB])

    const parseData = (dataP) =>{       
        console.log("parseData",dataP)
        const arrMLAT=[];
        const arrADSB=[];

      

        const lTime =  new Date().getTime()/1000

        const c_arrDataADSB = []

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
                    time:lTime,
                    prop:data.properties,                    
                    crd:data.geometry.coordinates, 
                    
                    oldTime:lTime,
                    old_crd:data.geometry.coordinates, 
                }

                if (arrDataADSB){
                    const findIndx = arrDataADSB.map(p=>p.prop.icao+p.prop.mode+p.prop.name).indexOf(info.prop.icao+info.prop.mode+info.prop.name)
                    if (findIndx>=0){
                        info.oldTime = arrDataADSB[findIndx].time
                        info.old_crd = arrDataADSB[findIndx].crd
                    }                    
                }
                c_arrDataADSB.push(info)                
            }
        }                                
        setArrDataADSB(c_arrDataADSB)       
    }

    const handleClick = (i,e) => {
            
        console.log("Click ",i,e)
    }
    
    

    useEffect (()=>{
        if (!arrDataADSB) return;
        if (arrDataADSB.length<1) return;        
       // console.log("CALC ARRAY = ",arrDataADSB, adsbRef)
        const arrADSB=[];
        const arrMLAT=[];
        
        for (let i=0;i<arrDataADSB.length;i++){            
            const position = [arrDataADSB[i].crd[1],arrDataADSB[i].crd[0]]            
            if (adsbRef.current.length>0){
               // console.log("REF = ",adsbRef)
                continue;
            }
            if (arrDataADSB[i].prop.mode==='adsb'){                               
                
                //console.log("ADD MARKER")
                arrADSB.push(                    
                    <Marker                                                   
                        ref={ref => adsbRef.current.push(ref)}    
                        rotationAngle={arrDataADSB[i].prop.heading}
                        rotationOrigin="center"                          
                        key={"adsb"+arrDataADSB[i].prop.icao+arrDataADSB[i].prop.mode}
                        eventHandlers={{
                            mousedown: (e)=>handleClick(i,e)
                        }}
                        position={position}                         
                        info={arrDataADSB[i]}
                        
                    />
                    )
            }
          /*  else
            {
                arrMLAT.push(
                    <RotatedMarker                                                   
                        rotationAngle={arrDataADSB[i].prop.heading}
                        rotationOrigin="center"  
                        key={"mlat"+arrDataADSB[i].prop.icao+arrDataADSB[i].prop.mode}
                        eventHandlers={{
                            mousedown: (e)=>handleClick(i,e)
                        }}
                        position={position} 
                        info={arrDataADSB[i]}
                    />
                    )
            }*/
        }

        /*
        //59.91984,30.00883

        arrMLAT.push(
            <RotatedMarker                                                   
                rotationAngle={270}
                rotationOrigin="center" 
                eventHandlers={{
                    mousedown: (e)=>hendleClick(e)
                }}
                key={"mlat000_000"}
                position={[59.91984,30.00883]} 
                info={arrDataADSB[0]}
            />
            )
*/
        // for (let i=0;i<arrDataADSB.length;i++){
        //     const tTrg = arrDataADSB[i].prop.icao+arrDataADSB[i].prop.name+arrDataADSB[i].prop.mode
            
        //     let pos=-1;            
        //     if (oldDataADSB)
        //         pos = oldDataADSB.map(p=>p.prop.icao+p.prop.name+p.prop.mode).indexOf(tTrg)
            
        //    // console.log(i,tTrg,pos)
        // }


        // setOldDataADSB(arrDataADSB)

        setDataADSB(arrADSB)
        setDataMLAT(arrMLAT)
    },[arrDataADSB])

    const reacalcCrd = ()=>{
    /*
        const lTime =  new Date().getTime()/1000

       /// console.log("Recalc!!", lTime, arrDataADSB)
       const arrADSB=[];
       const arrMLAT=[];
        for (let i=0;i<arrDataADSB.length;i++){            
            if (arrDataADSB[i].time-arrDataADSB[i].oldTime==0)
                continue;
            const dLat  = (arrDataADSB[i].crd[0] - arrDataADSB[i].old_crd[0])/(arrDataADSB[i].time - arrDataADSB[i].oldTime)
            const dLon  = (arrDataADSB[i].crd[1] - arrDataADSB[i].old_crd[1])/(arrDataADSB[i].time - arrDataADSB[i].oldTime)
            const dLAlt = (arrDataADSB[i].crd[2] - arrDataADSB[i].old_crd[2])/(arrDataADSB[i].time - arrDataADSB[i].oldTime)
            const dT = lTime - arrDataADSB[i].time

            const position = [arrDataADSB[i].crd[1]+dLon*dT,arrDataADSB[i].crd[0]+dLat*dT]
            //console.log(i,position,dLat, dLon, dT, arrDataADSB[i].time,arrDataADSB[i].oldTime)

            if (arrDataADSB[i].prop.mode==='adsb'){                
                arrADSB.push(
                    <RotatedMarker                                                   
                        rotationAngle={arrDataADSB[i].prop.heading}
                        rotationOrigin="center"  
                        key={"adsb"+arrDataADSB[i].prop.icao+arrDataADSB[i].prop.mode}
                        eventHandlers={{
                            mousedown: (e)=>handleClick(i,e)
                        }}
                        position={position} 
                        openPopup={true}
                        info={arrDataADSB[i]}
                    />
                    )
            }
            else
            {
                arrMLAT.push(
                    <RotatedMarker                                                   
                        rotationAngle={arrDataADSB[i].prop.heading}
                        rotationOrigin="center"  
                        key={"mlat"+arrDataADSB[i].prop.icao+arrDataADSB[i].prop.mode}
                        eventHandlers={{
                            mousedown: (e)=>handleClick(i,e)
                        }}
                        position={position} 
                        info={arrDataADSB[i]}
                    />
                    )
            }
            
        }

        setDataADSB(arrADSB)
        setDataMLAT(arrMLAT)
        */
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

    const timeoutRecalc = React.useRef(null);
    React.useEffect(() =>{   
        clearInterval(timeoutRecalc.current)          
        timeoutRecalc.current = setInterval(()=>{          
            reacalcCrd()            
        },200);
        return ()=> clearInterval(timeoutRecalc.current)    
    },[arrDataADSB])    

    React.useEffect(() =>{  
        readContextFromServer()                
    },[])
   
    return {TargetsMLAT, TargetsADSB}                 
}

export default Targets