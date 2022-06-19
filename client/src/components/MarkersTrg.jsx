import React, {useState, useContext,  useRef, useEffect} from 'react'
import L from 'leaflet'
import { useHttp } from "../hooks/http.hooks";
import { GlobalContext } from '../context/GlobalContext';
import {FeatureGroup,  Marker, Tooltip, Polyline} from 'react-leaflet'
import "leaflet-rotatedmarker";
import flyIcons from './flyIcons';

const posCrd = JSON.parse(localStorage.getItem("positions"))

const MarkersTrg = (props) =>{        
    const [markers, setMarkers] = useState([])
    const [lines, setLines] = useState([])
    const [currInfo, setCurrInfo] = useState()
    const [currKey, setCurrKey] = useState(-1)
    const ctxt = useContext(GlobalContext)
    const timeoutContext = useRef(null);
    const { request} = useHttp();
    const  {mediumAdsb, mediumMlat, 
        smallMlat, smallAdsb, 
        largeMlat,  largeAdsb,
        triangleMlat, triangleAdsb, 
        flyIconNone} = flyIcons() 

    const nDt = new Date().getTime()
   // console.log("render Markers!!",nDt);


    const findMarkerIndex =  (key)=>{        
        const indx = markers.map(mrk=>mrk.key).indexOf(key)        
        if (markers[indx]){
        //   console.log("MARKERS: find ",key,markers[indx])
                
            setCurrInfo(markers[indx].props.prop)
            const c_crd=[ markers[indx].props.prop.geometry.coordinates[1],
                          markers[indx].props.prop.geometry.coordinates[0]]
            //lines
            const listStG = markers[indx].props.prop.properties['visible-stations'].split(',')
            const listStE = markers[indx].props.prop.properties['error-stations'].split(',')           
            const arrLines = []
           // console.log(listStG,listStE)
            if ( ctxt.showLines){

                if (listStG.length>0){                
                    const linesCrd = listStG.map(i=>{
                        if (i!=='')
                            return [posCrd[i] , c_crd]
                    })                        
                arrLines.push(<Polyline key={'gdLines'} pathOptions={{ weight:1, color: 'blue' }} positions={linesCrd} />)
                }
                if (listStE.length>0){                
                    const linesCrd = listStE.map(i=>{                    
                        if (i!==''){                       
                            return [posCrd[i] , c_crd]
                        }
                            
                    })                
                    if (linesCrd[0])           
                        arrLines.push(<Polyline key={'bdLines'} pathOptions={{ weight:1, color: 'red' }} positions={linesCrd} />)
                }
            }
            
            if (arrLines)
                setLines(arrLines) 
            else           
                setLines([]) 
                
        }  
        else{            
            if (currKey!=-1){
                clearKey()
                setCurrInfo()
            }
            
        }            
    }

    const handleClick = (key,e)=>{ 
       // console.log("Press ",key)
        findMarkerIndex(key) 
        setCurrKey(key)       
    }

    const Markers = ()=>{
        return (
            <FeatureGroup>                
                {markers}
                {lines}
            </FeatureGroup>            
        )
    }

    const selectIcon = (mode)=>{
        let icon = flyIconNone
        if (mode.mode ==='adsb' && ctxt.showADSB){
            switch (mode.type) {
                case "medium":
                    icon = mediumAdsb
                    break;
                case "heavy":
                    icon = largeAdsb
                    break;
                case "light":
                    icon = smallAdsb
                    break;
                default:
                    icon = smallAdsb
                    break;
            }
        
            if (mode.heading==='nan' && mode['mode-a']==='0000')   
                icon = triangleAdsb
        }        
        if (mode.mode === 'mlat' && ctxt.showMLAT){

            switch (mode.type) {
                case "medium":
                    icon = mediumMlat
                    break;
                case "heavy":
                    icon = largeMlat
                    break;
                case "light":
                    icon = smallMlat
                    break;
                default:
                    icon = triangleMlat
                    break;
            }   
            // if (mode.heading==='nan' && mode[mode-a]==='0000')   
            //     icon = triangleMlat        
        }
            
       //console.log(mode.icao, mode.mode, mode.type, mode.heading ,mode.heading==='nan')
        return icon
    }    

    const parseData = (dataP) =>{       
       // console.log("parseData",dataP)
        const lTime =  new Date().getTime()/1000               
        const arrTrg=[]

        for (let i=0;i<dataP.length;i++){
            const data = dataP[i]           
            const key = data.properties.mode+data.properties.icao+data.properties.name
            const position = [data.geometry.coordinates[1],data.geometry.coordinates[0]]            

            const cIicon = selectIcon(data.properties)
            arrTrg.push(<Marker                       
                rotationAngle={data.properties.heading}
                rotationOrigin="center" 
                key = {key}                               
                eventHandlers={{
                    mousedown: (e)=>handleClick(key,e)
                }}
               
                prop = {data}
                icon={cIicon}
                position={position}                                         
            >
                <Tooltip direction="top">
                    {data.properties.icao.toUpperCase()+" "+
                    data.properties.name}
                </Tooltip>
            </Marker>
            )            
        }       
        setMarkers(arrTrg)
    }

    const clearKey = ()=>{
      //  console.log("ClearKey!!")
        setCurrKey(-1)
        setLines([])
    }

    const clearKeyAndLines = ()=>{
       // console.log("ClearKeyAndLines!!")
        setCurrKey(-1)
        setLines([])
    }

    const readContextFromServer = async ()=>{
        try{ 
            const response = await request('/mlat/current','GET',null,{
                Authorization: `Bearer ${ctxt.token}`
            });                                           
            if (response) 
                if (response.data)
                    if (response.data.features)                    
                        parseData(response.data.features);                       
        }catch(e){
            console.log("Error CURRENT ==> ",e);
            if (String(e).includes('401') || String(e).includes('SyntaxError')) 
            {
                console.log("Send logout!!");
                ctxt.logout();
            }                
        }
    }
    
    useEffect(() =>{    
       // console.log("Update Markers CurrKey")  
        findMarkerIndex(currKey)                       
        timeoutContext.current = setInterval(()=>{                  
                readContextFromServer()                                  
        },5000);
        return ()=> clearInterval(timeoutContext.current)    
    },[markers, currKey])   
    
    useEffect(() =>{           
        readContextFromServer()    
    },[])   

    return {Markers, currInfo, clearKey, clearKeyAndLines}
}

export default MarkersTrg