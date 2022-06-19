import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react'
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { AuthContext } from '../context/AuthContext';
import {FeatureGroup, useMap, Marker, Popup} from 'react-leaflet'
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

    const TargetsMLAT = useCallback(()=>{        
        return (           
                <FeatureGroup>{dataMLAT}</FeatureGroup>)
    },[dataMLAT])


    const TargetsADSB = useCallback(()=>{        
        return ([dataADSB])
    },[dataADSB])
    
    useEffect(()=>{  
        if (dataADSB){      
            setOldDataADSB(dataADSB);
            console.log("Change dataADSB!!",dataADSB, adsbRef.current)
        }
    },[dataADSB])

    const parseData = (dataP) =>{       
       // console.log("parseData",dataP,arrDataADSB)
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
        const arrADSB=[];
        const arrMLAT=[];
        const newADSB=[];
        const newMLAT=[];
        for (let i=0;i<arrDataADSB.length;i++){            
            const position = [arrDataADSB[i].crd[1],arrDataADSB[i].crd[0]]            


            if (arrDataADSB[i].prop.mode==='adsb'){                
               // if (adsbRef.current.length>0){                    
                    const indx = adsbRef.current.map(ref=>{
                        if (ref)
                           return ref.options.info.prop.icao+ref.options.info.prop.name+ref.options.info.prop.mode
                    }).indexOf(arrDataADSB[i].prop.icao+arrDataADSB[i].prop.name+arrDataADSB[i].prop.mode)

                    
                    if (indx>-1){
                      /* 
                        const marker = adsbRef.current[indx]
                        //console.log("Find REF change pos",i, marker.options.info, arrDataADSB[i])
                        // adsbRef.current[indx].options.info = arrDataADSB[i]
                        marker.options.info = arrDataADSB[i]
                        marker.setRotationAngle(arrDataADSB[i].prop.heading)
                        marker.setLatLng({lat:arrDataADSB[i].crd[1], lng: arrDataADSB[i].crd[0]}) 
                      //  arrADSB.push(marker)
*/
                        arrADSB.push(
                            <Marker         
                                ref = {adsbRef.current[indx]}
                                rotationAngle={arrDataADSB[i].prop.heading}
                                rotationOrigin="center"                                
                                eventHandlers={{
                                    mousedown: (e)=>handleClick(i,e)
                                }}
                                position={position}                         
                                info={arrDataADSB[i]}
                            >
                                <Popup 
                                    direction="top"
                                    multiline={true}>
                                    {arrDataADSB[i].prop.icao.toUpperCase()+" "+
                                    arrDataADSB[i].prop.name+" "+
                                    arrDataADSB[i].crd[2]}
                                </Popup>
                            </Marker>
                            )

                        
                    }
                    else{
                        console.log("Don't find",i,indx,arrDataADSB[i].prop.icao+arrDataADSB[i].prop.name+arrDataADSB[i].prop.mode)
                        
                        arrADSB.push(
                            <Marker         
                                ref = {ref => adsbRef.current.push(ref)}
                                rotationAngle={arrDataADSB[i].prop.heading}
                                rotationOrigin="center"  
                                key={"adsb"+arrDataADSB[i].prop.icao+arrDataADSB[i].prop.name}
                                eventHandlers={{
                                    mousedown: (e)=>handleClick(i,e)
                                }}
                                position={position}                         
                                info={arrDataADSB[i]}
                            >
                                <Popup 
                                    direction="top"
                                    multiline={true}>
                                    {arrDataADSB[i].prop.icao.toUpperCase()+" "+
                                    arrDataADSB[i].prop.name+" "+
                                    arrDataADSB[i].crd[2]}
                                </Popup>
                            </Marker>
                            )
                    }                                        
               /* }
                else{
                    arrADSB.push(
                        <Marker         
                            ref = {ref => adsbRef.current.push(ref)}
                            rotationAngle={arrDataADSB[i].prop.heading}
                            rotationOrigin="center"  
                            key={"adsb"+arrDataADSB[i].prop.icao+arrDataADSB[i].prop.name}
                            eventHandlers={{
                                mousedown: (e)=>handleClick(i,e)
                            }}
                            position={position}                         
                            info={arrDataADSB[i]}
                        >
                            <Popup 
                                direction="top"
                                multiline={true}>
                                {arrDataADSB[i].prop.icao.toUpperCase()+" "+
                                arrDataADSB[i].prop.name+" "+
                                arrDataADSB[i].crd[2]}
                            </Popup>
                        </Marker>
                        )
                }  */                              
            }
           /* else
            {
                arrMLAT.push(
                    <Marker                                                   
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

        // if (newADSB.length>0){
        //     for (let ii=0;ii<adsbRef.current.length;ii++){
        //         arrADSB.push(adsbRef.current[ii])
        //     }
        //     for (let ii=0;ii<newADSB.length;ii++){
        //         arrADSB.push(newADSB[ii])
        //     }
            
        //     console.log("NEW ARR = ",arrADSB)
        // }


        if (arrADSB.length > 0){  
            console.log("LENGTH:",dataADSB,adsbRef.current)  
            // if (!dataADSB)        
                 setDataADSB(arrADSB)
            // else{
            //     setDataADSB([...dataADSB,arrADSB])
            // }
        }
        if (arrMLAT.length > 0)
            setDataMLAT(arrMLAT)
    },[arrDataADSB])

    const reacalcCrd = ()=>{
        const lTime =  new Date().getTime()/1000
       /* 
        for (let i=0;i<adsbRef.current.length;i++){            
           
            if (!adsbRef.current[i])
                continue
            const marker = adsbRef.current[i]

          //  console.log(i,marker)

            const deltaT = marker.options.info.time-marker.options.info.oldTime

            if (deltaT==0)
                continue;
            const dLat  = (marker.options.info.crd[1] - marker.options.info.old_crd[1])/deltaT
            const dLon  = (marker.options.info.crd[0] - marker.options.info.old_crd[0])/deltaT
            const dLAlt = (marker.options.info.crd[2] - marker.options.info.old_crd[2])/deltaT
            const dT = lTime - marker.options.info.time

            const nLat = marker.options.info.crd[1]+dLat*dT
            const nLon = marker.options.info.crd[0]+dLon*dT
            
          //  console.log(marker.getLatLng(), nLat, nLon)
          //  marker.setLatLng({lat:nLat, lng: nLon}) 
        }    */   
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